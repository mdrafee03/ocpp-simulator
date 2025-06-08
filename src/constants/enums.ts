export const OcppMessageType = {
  Call: 2,
  CallResult: 3,
  CallError: 4,
} as const;

export const OcppRequestType = {
  BootNotification: "BootNotification",
  Authorize: "Authorize",
  Heartbeat: "Heartbeat",
  StartTransaction: "StartTransaction",
  StopTransaction: "StopTransaction",
  RemoteStartTransaction: "RemoteStartTransaction",
  RemoteStopTransaction: "RemoteStopTransaction",
  ChangeConfiguration: "ChangeConfiguration",
  StatusNotification: "StatusNotification",
  MeterValues: "MeterValues",
  ChangeAvailability: "ChangeAvailability",
  TriggerMessage: "TriggerMessage",
  ClearChargingProfile: "ClearChargingProfile",
  SetChargingProfile: "SetChargingProfile",
  GetCompositeSchedule: "GetCompositeSchedule",
  GetConfiguration: "GetConfiguration",
} as const;

export type OcppMessageType =
  (typeof OcppMessageType)[keyof typeof OcppMessageType];
export type OcppRequestType =
  (typeof OcppRequestType)[keyof typeof OcppRequestType];
