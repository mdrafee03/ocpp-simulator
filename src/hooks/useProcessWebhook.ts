import { useEffect } from "react";
import { OcppMessageType, OcppRequestType } from "../constants/enums";
import { useActionStore } from "../store/useActionsStore";
import { useLoggerStore } from "../store/useLoggerStore";
import { useWebSocketHook } from "../store/WebSocketContext";

export const useProcessWebhook = () => {
  const { logMsg } = useLoggerStore();
  const { lastMessage } = useWebSocketHook();
  const { actions, setActions } = useActionStore();

  const handleCall = (payload: any) => {};

  const handleCallResult = (payload: any) => {
    if (actions.lastAction === OcppRequestType.StartTransaction) {
      const transactionId = payload.transactionId;
      setActions({ ...actions, transactionId: transactionId });
    }
  };

  useEffect(() => {
    const parsedMessage = lastMessage ? JSON.parse(lastMessage.data) : null;

    if (!parsedMessage) return;

    const [messageType, id, payload] = parsedMessage;

    switch (messageType) {
      case OcppMessageType.Call:
        logMsg(
          "incoming",
          `Call message received with ID: ${id} and payload: ${JSON.stringify(
            payload
          )}`
        );
        handleCall(payload);
        break;
      case OcppMessageType.CallResult:
        logMsg(
          "incoming",
          `CallResult received for ID: ${id} and payload: ${JSON.stringify(
            payload
          )}`
        );
        handleCallResult(payload);
        break;
      case OcppMessageType.CallError:
        logMsg(
          "incoming",
          `CallError received for ID: ${id} and payload: ${JSON.stringify(
            payload
          )}`
        );
        // Handle CallError logic here
        break;
      default:
        logMsg("info", `Unknown message type: ${messageType}`);
    }
  }, [lastMessage]);
};
