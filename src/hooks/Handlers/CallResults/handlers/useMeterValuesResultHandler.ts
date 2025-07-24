import { useLoggerStore } from "../../../../store/useLoggerStore";

export const useMeterValuesResultHandler = () => {
  const { logMsg } = useLoggerStore();

  const handleMeterValuesResult = () => {
    logMsg("incoming", "Meter values received by server");
  };

  return { handleMeterValuesResult };
};
