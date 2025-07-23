import { OcppMessageType } from "../../../constants/enums";
import type { CallRequest } from "../../../interfaces/CallRequest";
import { useLoggerStore } from "../../../store/useLoggerStore";
import { useWebSocketHook } from "../../../store/WebSocketContext";

interface OcppKeyValue {
  key: string;
  value: string;
  readonly: boolean;
}

interface GetConfigurationResponse {
  configurationKey: OcppKeyValue[];
  unknownKey: OcppKeyValue[];
}

export const useGetConfigurationCallRequest = () => {
  const { sendMessage } = useWebSocketHook();
  const { logMsg } = useLoggerStore();

  const handleGetConfigurationCallRequest = (callRequest: CallRequest) => {
    const configurationKeys = [
      { key: "NumberOfConnectors", value: "1", readOnly: false },
      {
        key: "ChargingScheduleAllowedChargingRateUnit",
        value: "Current",
        readOnly: false,
      },
      { key: "OperatorMaxCurrent", value: "32", readOnly: false },
    ];

    const payload: GetConfigurationResponse = {
      configurationKey: configurationKeys.map((key) => ({
        key: key.key,
        value: key.value,
        readonly: key.readOnly,
      })),
      unknownKey: [],
    };

    const message = [OcppMessageType.CallResult, callRequest.uniqueId, payload];

    sendMessage(JSON.stringify(message));
    logMsg(
      "outgoing",
      `GetConfiguration CallResult sent: ${JSON.stringify(message)}`
    );
  };

  return { handleGetConfigurationCallRequest };
};
