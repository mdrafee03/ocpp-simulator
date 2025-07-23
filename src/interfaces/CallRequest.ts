import type { OcppRequestType } from "../constants/enums";

export interface CallRequest {
  uniqueId: string;
  action: OcppRequestType;
  payload: string;
}
