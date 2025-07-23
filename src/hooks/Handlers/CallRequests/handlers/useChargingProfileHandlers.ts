import type { CallRequest } from "../../../../interfaces/CallRequest";
import { useResponseUtils } from "../utils/responseUtils";

interface CallResponse {
  status?: string;
  [key: string]: unknown;
}

export const useChargingProfileHandlers = () => {
  const { sendResponse } = useResponseUtils();

  const handleSetChargingProfile = (callRequest: CallRequest) => {
    const response: CallResponse = { status: "Accepted" };
    sendResponse(callRequest.uniqueId, response, "SetChargingProfile accepted");
  };

  const handleClearChargingProfile = (callRequest: CallRequest) => {
    const response: CallResponse = { status: "Accepted" };
    sendResponse(
      callRequest.uniqueId,
      response,
      "ClearChargingProfile accepted"
    );
  };

  return { handleSetChargingProfile, handleClearChargingProfile };
};
