import type { OcppErrorCodeType } from "../constants/enums";

export interface CallError {
  uniqueId: string;
  errorCode: OcppErrorCodeType;
  errorDescription: string;
  errorPayload?: string;
}
