import type { CallRequest } from "../../../../interfaces/CallRequest";
import { useLoggerStore } from "../../../../store/useLoggerStore";

export const useNotImplementedHandler = () => {
  const { logMsg } = useLoggerStore();

  const handleNotImplemented = (callRequest: CallRequest) => {
    const message = {
      uniqueId: callRequest.uniqueId,
      errorCode: "NotImplemented",
      errorDescription: `Action ${callRequest.action} is not implemented`,
      errorPayload: "",
    };
    logMsg("error", `Call request error: ${JSON.stringify(message)}`);
  };

  return { handleNotImplemented };
};
