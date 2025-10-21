import { OcppMessageType, OcppRequestType } from "../../../../constants/enums";
import type { CallRequest } from "../../../../interfaces/CallRequest";
import { useLoggerStore } from "../../../../store/useLoggerStore";
import { useWebSocketHook } from "../../../../store/WebSocketContext";
import { useMessageTrackingStore } from "../../../../store/useMessageTrackingStore";
import { useConfigStore } from "../../../../store/useConfigStore";
import { getRandomId } from "../../../../helpers/helpers";
import { useResponseUtils } from "../utils/responseUtils";

interface CallResponse {
  status?: string;
  [key: string]: unknown;
}

export const useRemoteStartTransactionHandler = () => {
  const { sendMessage } = useWebSocketHook();
  const { logMsg } = useLoggerStore();
  const { addPendingMessage } = useMessageTrackingStore();
  const { config, setConfig } = useConfigStore();
  const { sendResponse } = useResponseUtils();

  const handleRemoteStartTransaction = (callRequest: CallRequest) => {
    // First, respond with acceptance
    const response: CallResponse = { status: "Accepted" };
    sendResponse(
      callRequest.uniqueId,
      response,
      "Remote start transaction accepted"
    );

    // Reset meter value to 0 when starting a new transaction
    setConfig({ ...config, meterValue: 0, meterCount: 1 });

    // Then, start the actual transaction
    setTimeout(() => {
      const payload = callRequest.payload as unknown as {
        idTag: string;
        connectorId?: number;
      };
      const idTag = payload.idTag;
      const connectorId = payload.connectorId || 1;

      const startTransactionId = getRandomId();
      const startTransactionMessage = JSON.stringify([
        OcppMessageType.Call,
        startTransactionId,
        OcppRequestType.StartTransaction,
        {
          connectorId: connectorId,
          idTag: idTag,
          meterStart: 0,
          timestamp: new Date().toISOString(),
          reservationId: 0,
        },
      ]);

      sendMessage(startTransactionMessage);
      addPendingMessage(startTransactionId, OcppRequestType.StartTransaction);
      logMsg("outgoing", "Start transaction initiated from remote start");
    }, 1000);
  };

  return { handleRemoteStartTransaction };
};
