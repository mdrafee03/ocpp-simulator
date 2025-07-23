import { OcppMessageType, OcppRequestType } from "../constants/enums";
import { getRandomId } from "../helpers/helpers";
import { useActionStore } from "../store/useActionsStore";
import { useConfigStore } from "../store/useConfigStore";
import { useLoggerStore } from "../store/useLoggerStore";
import { useWebSocketHook } from "../store/WebSocketContext";

export const useStartTransaction = () => {
  const logMsg = useLoggerStore((state) => state.logMsg);
  const { sendMessage } = useWebSocketHook();
  const { config } = useConfigStore();
  const { actions, setActions } = useActionStore();

  const { serialNumber } = config;

  const id = getRandomId();

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

  return { handleStartTransaction };
};
