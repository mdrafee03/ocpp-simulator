import { OcppMessageType, OcppRequestType } from "../constants/enums";
import { getRandomId } from "../helpers/helpers";
import { useConfigStore } from "../store/useConfigStore";
import { useLoggerStore } from "../store/useLoggerStore";
import { useWebSocketHook } from "../store/WebSocketContext";
import { useMessageTrackingStore } from "../store/useMessageTrackingStore";
import { useActionStore } from "../store/useActionsStore";

export const useStartTransaction = () => {
  const logMsg = useLoggerStore((state) => state.logMsg);
  const { sendMessage } = useWebSocketHook();
  const { config } = useConfigStore();
  const { addPendingMessage } = useMessageTrackingStore();
  const { actions } = useActionStore();

  const { serialNumber } = config;

  const id = getRandomId();

  const handleStartTransaction = () => {
    // Check if there's already an active transaction
    if (actions.transactionId) {
      logMsg(
        "error",
        "Cannot start transaction: Another transaction is already active"
      );
      return;
    }

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
    addPendingMessage(id, OcppRequestType.StartTransaction);
    logMsg("outgoing", `Start Transaction sent: ${message}`);
  };

  return { handleStartTransaction };
};
