import { OcppMessageType } from "../../../../constants/enums";
import { useLoggerStore } from "../../../../store/useLoggerStore";
import { useWebSocketHook } from "../../../../store/WebSocketContext";

interface CallResponse {
  status?: string;
  [key: string]: unknown;
}

export const useResponseUtils = () => {
  const { sendMessage } = useWebSocketHook();
  const { logMsg } = useLoggerStore();

  const sendResponse = (
    id: string,
    response: CallResponse,
    logMessage: string
  ) => {
    const message = [OcppMessageType.CallResult, id, response];
    sendMessage(JSON.stringify(message));
    logMsg("outgoing", logMessage);
  };

  return { sendResponse };
};
