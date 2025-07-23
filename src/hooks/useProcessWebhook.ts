import { useEffect } from "react";
import { OcppMessageType, OcppRequestType } from "../constants/enums";

import { useLoggerStore } from "../store/useLoggerStore";
import { useMessageTrackingStore } from "../store/useMessageTrackingStore";
import { useWebSocketHook } from "../store/WebSocketContext";
import type { CallRequest } from "../interfaces/CallRequest";
import { useGetConfigurationHandler } from "./Handlers/CallRequests/handlers/useGetConfigurationHandler";
import { useRemoteStartTransactionHandler } from "./Handlers/CallRequests/handlers/useRemoteStartTransactionHandler";
import { useRemoteStopTransactionHandler } from "./Handlers/CallRequests/handlers/useRemoteStopTransactionHandler";
import { useChargingProfileHandlers } from "./Handlers/CallRequests/handlers/useChargingProfileHandlers";
import { useNotImplementedHandler } from "./Handlers/CallRequests/handlers/useNotImplementedHandler";
import { useHeartbeatResultHandler } from "./Handlers/CallResults/handlers/useHeartbeatResultHandler";
import { useStatusNotificationResultHandler } from "./Handlers/CallResults/handlers/useStatusNotificationResultHandler";
import { useStartTransactionResultHandler } from "./Handlers/CallResults/handlers/useStartTransactionResultHandler";
import { useStopTransactionResultHandler } from "./Handlers/CallResults/handlers/useStopTransactionResultHandler";
import { useAuthorizeResultHandler } from "./Handlers/CallResults/handlers/useAuthorizeResultHandler";
import { useMeterValuesResultHandler } from "./Handlers/CallResults/handlers/useMeterValuesResultHandler";
import { useGenericResultHandler } from "./Handlers/CallResults/handlers/useGenericResultHandler";

export const useProcessWebhook = () => {
  const { logMsg } = useLoggerStore();
  const { lastMessage } = useWebSocketHook();
  const { removePendingMessage } = useMessageTrackingStore();

  const { handleGetConfiguration } = useGetConfigurationHandler();
  const { handleRemoteStartTransaction } = useRemoteStartTransactionHandler();
  const { handleRemoteStopTransaction } = useRemoteStopTransactionHandler();
  const { handleSetChargingProfile, handleClearChargingProfile } =
    useChargingProfileHandlers();
  const { handleNotImplemented } = useNotImplementedHandler();
  const { handleHeartbeatResult } = useHeartbeatResultHandler();
  const { handleStatusNotificationResult } =
    useStatusNotificationResultHandler();
  const { handleStartTransactionResult } = useStartTransactionResultHandler();
  const { handleStopTransactionResult } = useStopTransactionResultHandler();
  const { handleAuthorizeResult } = useAuthorizeResultHandler();
  const { handleMeterValuesResult } = useMeterValuesResultHandler();
  const { handleGenericCallResult } = useGenericResultHandler();

  const processCallRequest = (
    id: string,
    action: OcppRequestType,
    payload: string
  ) => {
    const callRequest: CallRequest = {
      uniqueId: id,
      action: action,
      payload: payload,
    };

    switch (action) {
      case OcppRequestType.GetConfiguration:
        handleGetConfiguration(callRequest);
        break;

      case OcppRequestType.RemoteStartTransaction:
        handleRemoteStartTransaction(callRequest);
        break;

      case OcppRequestType.RemoteStopTransaction:
        handleRemoteStopTransaction(callRequest);
        break;

      case OcppRequestType.SetChargingProfile:
        handleSetChargingProfile(callRequest);
        break;

      case OcppRequestType.ClearChargingProfile:
        handleClearChargingProfile(callRequest);
        break;

      default:
        handleNotImplemented(callRequest);
        break;
    }
  };

  const handleCallResult = (id: string, payload: Record<string, unknown>) => {
    const pendingMessage = removePendingMessage(id);

    if (pendingMessage) {
      const actionName = pendingMessage.action;

      switch (actionName) {
        case OcppRequestType.Authorize:
          handleAuthorizeResult(payload);
          break;

        case OcppRequestType.Heartbeat:
          handleHeartbeatResult();
          break;

        case OcppRequestType.StatusNotification:
          handleStatusNotificationResult();
          break;

        case OcppRequestType.StartTransaction:
          handleStartTransactionResult(payload);
          break;

        case OcppRequestType.StopTransaction:
          handleStopTransactionResult(payload);
          break;

        case OcppRequestType.MeterValues:
          handleMeterValuesResult();
          break;

        default:
          handleGenericCallResult(actionName, payload);
          break;
      }
    } else {
      logMsg("incoming", `Call result received for unknown request ID: ${id}`);
    }
  };

  useEffect(() => {
    const parsedMessage = lastMessage ? JSON.parse(lastMessage.data) : null;

    if (!parsedMessage) return;

    const [messageTypeId, id, action, payload] = parsedMessage;

    switch (messageTypeId) {
      case OcppMessageType.Call:
        logMsg("incoming", `${action} request received`);
        processCallRequest(id, action, payload);
        break;
      case OcppMessageType.CallResult:
        handleCallResult(id, parsedMessage[2]);
        break;
      case OcppMessageType.CallError:
        {
          const pendingMessage = removePendingMessage(id);
          if (pendingMessage) {
            // Extract error details from the payload
            const errorCode = parsedMessage[2]?.errorCode || "Unknown";
            const errorDescription =
              parsedMessage[2]?.errorDescription || "No description";
            logMsg(
              "error",
              `${pendingMessage.action} failed: ${errorCode} - ${errorDescription}`
            );
          } else {
            logMsg(
              "error",
              `Call error received for unknown request ID: ${id}`
            );
          }
          // Handle CallError logic here
          break;
        }
        break;
      default:
        logMsg("info", `Unknown message type: ${messageTypeId}`);
    }
  }, [lastMessage]);
};
