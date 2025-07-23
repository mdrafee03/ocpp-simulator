import { useResultUtils } from "../utils/resultUtils";

export const useStartTransactionResultHandler = () => {
  const { logMsg, updateTransactionState } = useResultUtils();

  const handleStartTransactionResult = (payload: Record<string, unknown>) => {
    const idTagInfo = payload.idTagInfo as Record<string, unknown>;
    const status = idTagInfo?.status as string;
    const transactionId = payload.transactionId as number;

    if (status === "Accepted") {
      logMsg(
        "incoming",
        `Start transaction accepted with ID: ${transactionId}`
      );
      updateTransactionState(transactionId);
    } else {
      logMsg("incoming", `Start transaction ${status.toLowerCase()}`);
    }
  };

  return { handleStartTransactionResult };
};
