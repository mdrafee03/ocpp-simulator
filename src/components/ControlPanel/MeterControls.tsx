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
    <div className="space-y-2">
      {/* Meter Value Display */}
      <div className="bg-base-200 rounded-lg p-3 border border-base-300 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-sm text-base-content/70 flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Current Energy
            </div>
            <div className="text-2xl font-mono text-primary font-bold">
              {meterValue.toFixed(1)} kWh
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm hover:btn-primary hover:text-primary-content transition-all duration-200"
            onClick={() => setShowConfig(!showConfig)}
            disabled={!isConnected}
          >
            <EditIcon />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-base-300 rounded-full h-2 mb-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${Math.min((meterValue / 100) * 100, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-base-content/50">
          <span className="flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Interval: {meterCount}
          </span>
          <span>0 kWh</span>
          <span>100 kWh</span>
        </div>
      </div>

      {/* Configuration Panel */}
      {showConfig && (
        <div className="bg-base-100 border border-base-300 rounded-lg p-3 shadow-sm animate-in slide-in-from-top-2 duration-200">
          <div className="text-sm font-medium mb-2 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Configuration
          </div>
          <div className="space-y-2">
            <div>
              <label className="label">
                <span className="label-text text-xs">Starting Value (kWh)</span>
              </label>
              <input
                type="number"
                className="input input-bordered input-sm w-full focus:input-primary transition-colors duration-200"
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
        className={`btn h-10 text-sm w-full group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:shadow-none ${
          isMeterIntervalActive() ? "btn-error" : "btn-success"
        }`}
        onClick={handleSendMeter}
        disabled={!isConnected}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isMeterIntervalActive()
              ? "from-error/20 to-transparent"
              : "from-success/20 to-transparent"
          }`}
        ></div>
        <div className="flex items-center justify-center gap-2 relative z-10">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMeterIntervalActive() ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            )}
          </svg>
          <span>{isMeterIntervalActive() ? "Stop Meter" : "Start Meter"}</span>
        </div>
      </button>
    </div>
  );
};
