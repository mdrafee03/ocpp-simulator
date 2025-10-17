import type { CallRequest } from "../../../../interfaces/CallRequest";
import { useResponseUtils } from "../utils/responseUtils";

interface CallResponse {
  status?: string;
  [key: string]: unknown;
}

export const useGetConfigurationHandler = () => {
  const { sendResponse } = useResponseUtils();

  const handleGetConfiguration = (callRequest: CallRequest) => {
    const response: CallResponse = {
      configurationKey: [
        {
          key: "HeartbeatInterval",
          readonly: false,
          value: "300",
        },
        {
          key: "ChargingScheduleAllowedChargingRateUnit",
          readonly: false,
          value: "Current",
        },
        {
          key: "OperatorMaxCurrent",
          readonly: false,
          value: "32.0",
        },
      ],
      unknownKey: [],
    };
    sendResponse(callRequest.uniqueId, response, "Configuration sent");
  };

  return { handleGetConfiguration };
};
