import { OcppMessageType, OcppRequestType } from "../../../../constants/enums";
import type { CallRequest } from "../../../../interfaces/CallRequest";
import { useLoggerStore } from "../../../../store/useLoggerStore";
import { useWebSocketHook } from "../../../../store/WebSocketContext";
import { useMessageTrackingStore } from "../../../../store/useMessageTrackingStore";
import { useActionStore } from "../../../../store/useActionsStore";
import { getRandomId } from "../../../../helpers/helpers";
import { useResponseUtils } from "../utils/responseUtils";

interface CallResponse {
  status?: string;
  [key: string]: unknown;
}

export const useRemoteStopTransactionHandler = () => {
  const { sendMessage } = useWebSocketHook();
  const { logMsg } = useLoggerStore();
  const { addPendingMessage } = useMessageTrackingStore();
  const { actions, setActions } = useActionStore();
  const { sendResponse } = useResponseUtils();

  const handleRemoteStopTransaction = (callRequest: CallRequest) => {
    const payload = callRequest.payload as unknown as {
      transactionId?: number;
    };
    const { transactionId } = payload;

    // Check if the payload contains a valid transaction ID
    if (!transactionId) {
      const response: CallResponse = {
        status: "Rejected",
      };
      sendResponse(
        callRequest.uniqueId,
        response,
        `RemoteStopTransaction ${response.status} - No transaction ID provided`
      );
      return;
    }

    // Accept if transaction ID is provided
    const response: CallResponse = {
      status: "Accepted",
    };
    sendResponse(
      callRequest.uniqueId,
      response,
      `RemoteStopTransaction ${response.status}`
    );

    // Send Stop Transaction for the specified transaction ID
    const stopTransactionId = getRandomId();
    const stopTransactionPayload = {
      transactionId: transactionId,
      idTag: "remote_stop",
      timestamp: new Date().toISOString(),
      meterStop: 20,
    };

    const stopTransactionMessage = [
      OcppMessageType.Call,
      stopTransactionId,
      OcppRequestType.StopTransaction,
      stopTransactionPayload,
    ];

    sendMessage(JSON.stringify(stopTransactionMessage));
    addPendingMessage(stopTransactionId, OcppRequestType.StopTransaction);
    logMsg(
      "outgoing",
      `StopTransaction request sent for transaction ${transactionId}`
    );

    // Clear our transaction ID if it matches the one being stopped
    if (actions.transactionId === transactionId) {
      setActions({
        ...actions,
        transactionId: undefined,
      });
    }
  };

  return { handleRemoteStopTransaction };
};
