import { useState } from "react";
import { useWebSocketHook } from "../../store/WebSocketContext";
import { useConfigStore } from "../../store/useConfigStore";
import { useControlPanel } from "./useControlPanel";
import { useMeterValue } from "../../hooks/useMeterValue";
import { EditIcon } from "../../Icons/EditIcon";

export const MeterControls = () => {
  const { readyState } = useWebSocketHook();
  const { config, setConfig } = useConfigStore();
  const { handleSendMeter } = useControlPanel();
  const { isMeterIntervalActive } = useMeterValue();
  const [showConfig, setShowConfig] = useState(false);

  const { meterValue, meterCount } = config;
  const isConnected = readyState === 1;

  const setStartingValue = (value: number) =>
    setConfig({ ...config, meterValue: value });

  return (
    <div className="space-y-3">
      {/* Meter Value Display */}
      <div className="bg-base-200 rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-sm text-base-content/70">Current Energy</div>
            <div className="text-2xl font-mono text-primary">
              {meterValue.toFixed(1)} kWh
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowConfig(!showConfig)}
            disabled={!isConnected}
          >
            <EditIcon />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-base-300 rounded-full h-2 mb-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((meterValue / 100) * 100, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-base-content/50">
          <span>Interval: {meterCount}</span>
          <span>0 kWh</span>
          <span>100 kWh</span>
        </div>
      </div>

      {/* Configuration Panel */}
      {showConfig && (
        <div className="bg-base-100 border border-base-300 rounded-lg p-3">
          <div className="text-sm font-medium mb-2">Configuration</div>
          <div className="space-y-2">
            <div>
              <label className="label">
                <span className="label-text text-xs">Starting Value (kWh)</span>
              </label>
              <input
                type="number"
                className="input input-bordered input-sm w-full"
                value={meterValue}
                onChange={(e) => setStartingValue(Number(e.target.value))}
                disabled={!isConnected}
                placeholder="Starting meter value"
              />
            </div>
          </div>
        </div>
      )}

      {/* Control Button */}
      <button
        className={`btn h-12 text-base w-full ${
          isMeterIntervalActive() ? "btn-error" : "btn-primary"
        }`}
        onClick={handleSendMeter}
        disabled={!isConnected}
      >
        {isMeterIntervalActive() ? "Stop Meter" : "Start Meter"}
      </button>
    </div>
  );
};
