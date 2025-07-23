import { useLoggerStore } from "../../../../store/useLoggerStore";

export const useAuthorizeResultHandler = () => {
  const { logMsg } = useLoggerStore();

  const handleAuthorizeResult = (payload: Record<string, unknown>) => {
    const idTagInfo = payload.idTagInfo as Record<string, unknown>;
    const status = idTagInfo?.status as string;

    if (status === "Accepted") {
      logMsg("incoming", `Authorization accepted for ID tag`);
    } else {
      logMsg("incoming", `Authorization ${status.toLowerCase()} for ID tag`);
    }
  };

  return { handleAuthorizeResult };
};
