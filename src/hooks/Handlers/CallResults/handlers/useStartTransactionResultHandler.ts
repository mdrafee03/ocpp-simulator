import { useResultUtils } from "../utils/resultUtils";
import { useMeterValue } from "../../../useMeterValue";

export const useStartTransactionResultHandler = () => {
  const { logMsg, updateTransactionState } = useResultUtils();
  const { startMeterInterval } = useMeterValue();

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

      // Automatically start meter values when transaction starts
      const meterStarted = startMeterInterval(60000); // 1 minute interval
      if (meterStarted) {
        logMsg("info", "Meter values started automatically");
      }
    } else {
      logMsg("incoming", `Start transaction ${status.toLowerCase()}`);
    }
  };

  return { handleStartTransactionResult };
};
