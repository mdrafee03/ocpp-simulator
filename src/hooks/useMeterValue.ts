import { OcppMessageType, OcppRequestType } from "../constants/enums";
import { getRandomId } from "../helpers/helpers";
import { useConfigStore } from "../store/useConfigStore";
import { useLoggerStore } from "../store/useLoggerStore";
import { useWebSocketHook } from "../store/WebSocketContext";

export const useMeterValue = () => {
  const { sendMessage } = useWebSocketHook();
  const { logMsg } = useLoggerStore();
  const { config, setConfig } = useConfigStore();
  const { transactionId, meterCount, meterValue } = config;

  const sendMeterValues = () => {
    const id = getRandomId();
    const requestType = OcppRequestType.MeterValues;

    const ssid = transactionId;

    let chargeAmount = meterValue;
    if (meterCount < 100) {
      setConfig({ ...config, meterCount: meterCount + 1 });
    }

    const chargeEffect =
      800 + (Math.floor(Math.random() * 100 + 1) + meterCount) * 100;

    let soc = 50 + meterCount + 2;
    if (soc > 100) {
      soc = 100;
    } else {
      chargeAmount += Math.floor(Math.random() * 10);
      setConfig({ ...config, meterValue: chargeAmount });
    }
    const message = JSON.stringify([
      OcppMessageType.Call,
      id,
      OcppRequestType.MeterValues,
      {
        connectorId: 1,
        transactionId: ssid,
        meterValue: [
          {
            timestamp: new Date().toISOString(),
            sampledValue: [
              {
                value: chargeAmount,
                measurand: "Energy.Active.Import.Register",
              },
              { value: chargeEffect, measurand: "Power.Active.Import" },
              { value: soc, measurand: "SoC" },
            ],
          },
        ],
      },
    ]);

    sendMessage(message);
    logMsg("outgoing", `Meter Values sent: ${message}`);
    setConfig({ ...config, lastAction: requestType });
  };

  return { sendMeterValues };
};
