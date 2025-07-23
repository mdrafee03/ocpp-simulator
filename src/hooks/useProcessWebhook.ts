import { useEffect } from "react";
import {
  OcppErrorCode,
  OcppMessageType,
  OcppRequestType,
} from "../constants/enums";
import { useActionStore } from "../store/useActionsStore";
import { useLoggerStore } from "../store/useLoggerStore";
import { useWebSocketHook } from "../store/WebSocketContext";
import type { CallRequest } from "../interfaces/CallRequest";
import { useGetConfigurationCallRequest } from "./Handlers/CallRequests/useGetConfigurationCallRequest";
import type { CallError } from "../interfaces/CallError";

export const useProcessWebhook = () => {
  const { logMsg } = useLoggerStore();
  const { lastMessage } = useWebSocketHook();
  const { actions, setActions } = useActionStore();

  const { handleGetConfigurationCallRequest } =
    useGetConfigurationCallRequest();

  const handleCallRequest = (
    id: string,
    action: OcppRequestType,
    payload: string
  ) => {
    // if (action === OcppRequestType.StartTransaction) {
    //   const message = JSON.stringify([
    //     OcppMessageType.CallResult,
    //     id,
    //     { status: "Accepted" },
    //   ]);
    //   sendMessage(message);
    //   setTimeout(() => handleStartTransaction, 5000);
    // }
    const callRequest: CallRequest = {
      uniqueId: id,
      action: action,
      payload: payload,
    };

    switch (action) {
      case OcppRequestType.GetConfiguration:
        handleGetConfigurationCallRequest(callRequest);
        break;
      default: {
        const message: CallError = {
          uniqueId: id,
          errorCode: OcppErrorCode.NotImplemented,
          errorDescription: `Action ${action} is not implemented`,
          errorPayload: "",
        };
        logMsg("error", `Call request error: ${JSON.stringify(message)}`);
        break;
      }
    }
  };

  const handleCallResult = (payload: Record<string, unknown>) => {
    if (actions.lastAction === OcppRequestType.StartTransaction) {
      const transactionId = payload.transactionId as number;
      setActions({ ...actions, transactionId: transactionId });
    }
  };

  useEffect(() => {
    const parsedMessage = lastMessage ? JSON.parse(lastMessage.data) : null;

    if (!parsedMessage) return;

    const [messageTypeId, id, action, payload] = parsedMessage;

    switch (messageTypeId) {
      case OcppMessageType.Call:
        logMsg(
          "incoming",
          `Call message received with ID: ${id}, request: ${
            parsedMessage[2]
          } payload: ${JSON.stringify(parsedMessage[3])}`
        );
        handleCallRequest(id, action, payload);
        break;
      case OcppMessageType.CallResult:
        logMsg(
          "incoming",
          `CallResult received for ID: ${id} and payload: ${JSON.stringify(
            parsedMessage[2]
          )}`
        );
        handleCallResult(parsedMessage[2]);
        break;
      case OcppMessageType.CallError:
        logMsg(
          "incoming",
          `CallError received for ID: ${id} and payload: ${JSON.stringify(
            parsedMessage[2]
          )}`
        );
        // Handle CallError logic here
        break;
      default:
        logMsg("info", `Unknown message type: ${messageTypeId}`);
    }
  }, [lastMessage]);
};
