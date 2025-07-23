import { useLoggerStore } from "../../../../store/useLoggerStore";

export const useMeterValuesResultHandler = () => {
  const { logMsg } = useLoggerStore();

  const handleMeterValuesResult = () => {
    // If we receive any payload (even empty), meter values were successful
    logMsg("incoming", "Meter values sent successfully");
  };

  return { handleMeterValuesResult };
};
