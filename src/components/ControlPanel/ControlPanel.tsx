import { Environments } from "../../constants/constants";
import { useConfigStore } from "../../store/useConfigStore";
import { useWebSocketHook } from "../../store/WebSocketContext";
import { useControlPanel } from "./useControlPanel";

type ControlPanelProps = {
  toggleIndicator: (color: string) => void;
};

export const ControlPanel = ({ toggleIndicator }: ControlPanelProps) => {
  const { config, setConfig } = useConfigStore();
  const { readyState } = useWebSocketHook();

  const {
    handleConnect,
    handleAuthorize,
    handleStartTransaction,
    handleStopTransaction,
    handleHeartbeat,
    handleSendMeter,
    handleStatus,
    status,
    setStatus,
    meterValue,
    setMeterValue,
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
      <div className="form-control">
        <label className="label">Charger Serial</label>
        <input
          className="input input-bordered w-full"
          value={config.serialNumber}
          onChange={(e) =>
            setConfig({ ...config, serialNumber: e.target.value })
          }
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
        <button className="btn btn-primary" onClick={handleConnect}>
          {readyState === 1 ? "Reconnect" : "Connect"}
        </button>
        <button className="btn btn-primary" onClick={handleAuthorize}>
          Authorize
        </button>
        <button className="btn btn-primary" onClick={handleStartTransaction}>
          Start Transaction
        </button>
        <button
          className="btn btn-primary"
          onClick={() => handleStopTransaction()}
        >
          Stop Transaction
        </button>
        <button className="btn btn-primary" onClick={handleHeartbeat}>
          Heartbeat
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="input">
          Meter Value:
          <input
            type="number"
            className="grow"
            value={meterValue}
            onChange={(e) => setMeterValue(Number(e.target.value))}
          />
        </label>
        <button className="btn btn-primary" onClick={handleSendMeter}>
          Send Meter
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select
          className="select select-bordered"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Available</option>
          <option>Preparing</option>
          <option>Charging</option>
          <option>SuspendedEVSE</option>
          <option>SuspendedEV</option>
          <option>Finishing</option>
          <option>Reserved</option>
          <option>Unavailable</option>
          <option>Faulted</option>
        </select>
        <button className="btn btn-primary" onClick={handleStatus}>
          Send Status Notification
        </button>
      </div>
    </div>
  );
};
