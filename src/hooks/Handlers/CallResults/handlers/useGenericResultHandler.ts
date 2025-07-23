import { useResultUtils } from "../utils/resultUtils";

export const useGenericResultHandler = () => {
  const { handleGenericResult } = useResultUtils();

  const handleGenericCallResult = (
    actionName: string,
    payload: Record<string, unknown>
  ) => {
    handleGenericResult(actionName, payload);
  };

  return { handleGenericCallResult };
};
