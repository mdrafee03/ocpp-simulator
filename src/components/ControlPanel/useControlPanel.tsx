import { useEffect, useState } from "react";
import { ReadyState } from "react-use-websocket";
import { OcppMessageType, OcppRequestType } from "../../constants/enums";
import { useActionStore } from "../../store/useActionsStore";
import { useConfigStore } from "../../store/useConfigStore";
import { useLoggerStore } from "../../store/useLoggerStore";
import { useWebSocketHook } from "../../store/WebSocketContext";

export function useControlPanel() {
  const logMsg = useLoggerStore((state) => state.logMsg);
  const { connect, sendMessage } = useWebSocketHook();
  const { config, setConfig } = useConfigStore();
  const { actions, setActions } = useActionStore();
  const [status, setStatus] = useState("Available");
  const [meterValue, setMeterValue] = useState(10);

  const { readyState } = useWebSocketHook();

  const { id, serialNumber, meterCount } = config;

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      logMsg("info", "WebSocket is connected");
    }
  }, [readyState]);

  const handleConnect = () => {
    connect();
    handleBootNotification();
  };

  const handleBootNotification = () => {
    const message = JSON.stringify([
      OcppMessageType.Call,
      id,
      OcppRequestType.BootNotification,
      {
        chargePointVendor: "AVT-Company-1",
        chargePointModel: "AVT-Express",
        chargePointSerialNumber: "2706_1",
        chargeBoxSerialNumber: "2706_1.01.22",
        firmwareVersion: "0.9.87",
        iccid: "2222",
        imsi: "33333",
        meterType: "AVT NQC-ACDC",
        meterSerialNumber: "2706_1.01",
      },
    ]);

    sendMessage(message);
    logMsg("outgoing", `Boot notification: ${message}`);
  };

  const handleAuthorize = () => {
    const message = JSON.stringify([
      OcppMessageType.Call,
      id,
      OcppRequestType.Authorize,
      { idTag: serialNumber },
    ]);
    sendMessage(message);
    logMsg("outgoing", `Authorize sent: ${message}`);
  };

  const handleStartTransaction = () => {
    const message = JSON.stringify([
      OcppMessageType.Call,
      id,
      OcppRequestType.StartTransaction,
      {
        connectorId: 1,
        idTag: serialNumber,
        timestamp: new Date().toISOString(),
        meterStart: 0,
        reservationId: 0,
      },
    ]);

    sendMessage(message);
    logMsg("outgoing", `Start Transaction sent: ${message}`);
    setActions({
      ...actions,
      lastAction: OcppRequestType.StartTransaction,
    });
  };

  const handleStopTransaction = (transactionId = "") => {
    const requestType = OcppRequestType.StopTransaction;

    const ssid = transactionId ? transactionId : actions.transactionId;
    if (!ssid) {
      logMsg(
        "error",
        "Transaction ID is not set. Please start a transaction first."
      );
      return;
    }
    const message = JSON.stringify([
      OcppMessageType.Call,
      id,
      requestType,
      {
        transactionId: ssid,
        idTag: serialNumber,
        timestamp: new Date().toISOString(),
        meterStop: 20,
      },
    ]);

    sendMessage(message);
    logMsg("outgoing", `Stop Transaction sent: ${message}`);
    setActions({
      ...actions,
      lastAction: requestType,
    });
  };

  const handleHeartbeat = () => {
    const requestType = OcppRequestType.Heartbeat;
    const message = JSON.stringify([OcppMessageType.Call, id, requestType, {}]);

    sendMessage(message);
    logMsg("outgoing", `Heartbeat sent: ${message}`);
    setActions({
      ...actions,
      lastAction: requestType,
    });
  };

  const sendMeterValuesInterval = () => {
    const requestType = OcppRequestType.MeterValues;

    const ssid = actions.transactionId;

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
      setMeterValue(chargeAmount);
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
    setActions({ ...actions, lastAction: requestType });
  };

  const handleSendMeter = () => {
    logMsg("info", "Setting meter value interval to 1 minutes");
    setInterval(() => {
      sendMeterValuesInterval();
    }, 60000);
  };
  const handleStatus = () => {
    const requestType = OcppRequestType.StatusNotification;
    const message = JSON.stringify([
      OcppMessageType.Call,
      id,
      requestType,
      {
        connectorId: 1,
        status: status,
        errorCode: "NoError",
        info: "",
        timestamp: new Date().toISOString(),
        vendorId: "",
        vendorErrorCode: "",
      },
    ]);

    sendMessage(message);
    logMsg("outgoing", `Status Notification sent: ${message}`);
    setActions({ ...actions, lastAction: requestType });
  };

  return {
    handleConnect,
    handleAuthorize,
    handleStartTransaction,
    handleStopTransaction,
    handleHeartbeat,
    handleSendMeter,
    handleStatus,
    status,
    setStatus,
    meterValue,
    setMeterValue,
  };
}
