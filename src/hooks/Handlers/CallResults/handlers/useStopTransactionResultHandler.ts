import { useResultUtils } from "../utils/resultUtils";
import { useMeterValue } from "../../../useMeterValue";

export const useStopTransactionResultHandler = () => {
  const { logMsg, updateTransactionState } = useResultUtils();
  const { stopMeterInterval } = useMeterValue();

  const handleStopTransactionResult = (payload: Record<string, unknown>) => {
    const idTagInfo = payload.idTagInfo as Record<string, unknown>;
    const status = idTagInfo?.status as string;

    if (status === "Accepted") {
      logMsg("incoming", "Stop transaction accepted");
      updateTransactionState(undefined);
      stopMeterInterval(); // Stop meter interval when transaction ends
    } else {
      logMsg("incoming", `Stop transaction ${status.toLowerCase()}`);
    }
  };

  return { handleStopTransactionResult };
};
