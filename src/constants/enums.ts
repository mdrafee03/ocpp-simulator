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

export const OcppStatus = {
  Available: "Available",
  Preparing: "Preparing",
  Charging: "Charging",
  SuspendedEV: "SuspendedEV",
  SuspendedEVSE: "SuspendedEVSE",
  Finishing: "Finishing",
  Reserved: "Reserved",
  Unavailable: "Unavailable",
  Faulted: "Faulted",
};

export const OcppErrorCode = {
  GenericError: 0,
  NotImplemented: 1,
  NotSupported: 2,
  InternalError: 3,
  SecurityError: 4,
  FormationViolation: 5,
  PropertyConstraintViolation: 6,
  OccurrenceConstraintViolation: 7,
  TypeConstraintViolation: 8,
};

export type OcppMessageType =
  (typeof OcppMessageType)[keyof typeof OcppMessageType];
export type OcppRequestType =
  (typeof OcppRequestType)[keyof typeof OcppRequestType];

export type OcppStatusType = (typeof OcppStatus)[keyof typeof OcppStatus];

export type OcppErrorCodeType =
  (typeof OcppErrorCode)[keyof typeof OcppErrorCode];
