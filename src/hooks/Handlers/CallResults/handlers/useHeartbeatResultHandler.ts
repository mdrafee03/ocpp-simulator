import { useLoggerStore } from "../../../../store/useLoggerStore";

export const useHeartbeatResultHandler = () => {
  const { logMsg } = useLoggerStore();

  const handleHeartbeatResult = () => {
    logMsg("incoming", "Heartbeat received successfully");
  };

  return { handleHeartbeatResult };
};
