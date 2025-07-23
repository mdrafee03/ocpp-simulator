import { useLoggerStore } from "../../../../store/useLoggerStore";

export const useStatusNotificationResultHandler = () => {
  const { logMsg } = useLoggerStore();

  const handleStatusNotificationResult = () => {
    logMsg("incoming", "Status notification received successfully");
  };

  return { handleStatusNotificationResult };
};
