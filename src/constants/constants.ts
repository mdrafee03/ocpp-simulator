export const Environments = {
  Dev: "ws://watt-appengine-ocpp-api-dev-dot-watt-dev-307411.ey.r.appspot.com/ocpp/",
  Local: "ws://localhost:5001/ocpp/",
};

export type Environments = keyof typeof Environments;

export const OCPP_VERSIONS = ["ocpp1.6", "ocpp1.5"] as const;
