import { Environments } from "../../constants/constants";
import { OcppStatus } from "../../constants/enums";
import { useConfigStore } from "../../store/useConfigStore";
import { useChargersStore } from "../../store/useChargersStore";
import { useActionStore } from "../../store/useActionsStore";
import { useWebSocketHook } from "../../store/WebSocketContext";
import { useControlPanel } from "./useControlPanel";

export const ControlPanel = () => {
  const { config, setConfig } = useConfigStore();
  const { chargers } = useChargersStore();
  const { readyState } = useWebSocketHook();
  const { actions } = useActionStore();

  const { meterValue } = config;

  // Determine button states based on connection and OCPP flow
  const isConnected = readyState === 1;
  const isAuthorized = actions.lastAction === "Authorize";
  const hasActiveTransaction = actions.transactionId !== undefined;

  const setMeterValue = (value: number) =>
    setConfig({ ...config, meterValue: value });

  const {
    handleConnect,
    handleReconnect,
    handleClose,
    handleAuthorize,
    handleStartTransaction,
    handleStopTransaction,
    handleHeartbeat,
    handleSendMeter,
    handleStatus,
    status,
    setStatus,
  } = useControlPanel();

  return (
    <div className="space-y-4">
      <select
        className="select select-bordered"
        value={config.env}
        onChange={(e) =>
          setConfig({ ...config, env: e.target.value as Environments })
        }
      >
        {Object.keys(Environments).map((env) => (
          <option key={env} value={env}>
            {env}
          </option>
        ))}
      </select>
      <div className="flex flex-justify-between items-end gap-2">
        <div className="form-control">
          <label className="label block">Charger Serial</label>
          <select
            className="select select-bordered"
            value={config.serialNumber}
            onChange={(e) =>
              setConfig({ ...config, serialNumber: e.target.value })
            }
          >
            {chargers.map((charger) => (
              <option key={charger.id} value={charger.serialNumber}>
                {charger.serialNumber}
              </option>
            ))}
          </select>
        </div>
        {readyState === 1 && (
          <>
            <div role="alert" className="alert alert-success p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Connected</span>
            </div>
            <button className="btn btn-inf" onClick={handleReconnect}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Reconnect
            </button>
            <button className="btn btn-error" onClick={handleClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Close
            </button>
          </>
        )}
        {readyState !== 1 && (
          <button className="btn btn-primary" onClick={handleConnect}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
              />
            </svg>
            Connect
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
        <button
          className="btn btn-primary"
          onClick={handleAuthorize}
          disabled={!isConnected}
        >
          Authorize
        </button>
        <button
          className="btn btn-primary"
          onClick={handleStartTransaction}
          disabled={!isConnected || !isAuthorized}
        >
          Start Transaction
        </button>
        <button
          className="btn btn-primary"
          onClick={() => handleStopTransaction()}
          disabled={!isConnected || !hasActiveTransaction}
        >
          Stop Transaction
        </button>
        <button
          className="btn btn-primary"
          onClick={handleHeartbeat}
          disabled={!isConnected}
        >
          Heartbeat
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          className={`input input-bordered grow ${
            !isConnected
              ? "!bg-neutral !text-neutral-content !border-neutral !opacity-30 !cursor-not-allowed"
              : ""
          }`}
          value={meterValue}
          onChange={(e) => setMeterValue(Number(e.target.value))}
          disabled={!isConnected}
          placeholder="Meter Value"
        />
        <button
          className="btn btn-primary"
          onClick={handleSendMeter}
          disabled={!isConnected}
        >
          Send Meter
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select
          className={`select select-bordered ${
            !isConnected
              ? "!bg-neutral !text-neutral-content !border-neutral !opacity-30 !cursor-not-allowed"
              : ""
          }`}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={!isConnected}
        >
          {Object.keys(OcppStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          className="btn btn-primary"
          onClick={handleStatus}
          disabled={!isConnected}
        >
          Send Status Notification
        </button>
      </div>
    </div>
  );
};
