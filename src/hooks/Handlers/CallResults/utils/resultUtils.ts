import { useLoggerStore } from "../../../../store/useLoggerStore";
import { useActionStore } from "../../../../store/useActionsStore";

export const useResultUtils = () => {
  const { logMsg } = useLoggerStore();
  const { actions, setActions } = useActionStore();

  const handleGenericResult = (
    actionName: string,
    payload: Record<string, unknown>
  ) => {
    const status = payload.status as string;
    if (status === "Accepted") {
      logMsg("incoming", `${actionName} accepted`);
    } else if (status === "Rejected") {
      logMsg("incoming", `${actionName} rejected`);
    } else if (status === "Pending") {
      logMsg("incoming", `${actionName} pending`);
    } else {
      logMsg("incoming", `${actionName} status: ${status}`);
    }
  };

  const updateTransactionState = (transactionId: number | undefined) => {
    setActions({
      ...actions,
      transactionId,
    });
  };

  return { logMsg, handleGenericResult, updateTransactionState };
};
