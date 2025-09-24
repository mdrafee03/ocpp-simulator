import { OcppStatus } from "../../constants/enums";
import { useWebSocketHook } from "../../store/WebSocketContext";
import { useControlPanel } from "./useControlPanel";

export const StatusControls = () => {
  const { readyState } = useWebSocketHook();
  const { handleStatus, status, setStatus } = useControlPanel();

  const isConnected = readyState === 1;

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="relative">
        <select
          className={`select select-bordered h-10 text-sm w-full transition-all duration-200 focus:select-primary ${
            !isConnected
              ? "!bg-neutral !text-neutral-content !border-neutral !opacity-30 !cursor-not-allowed"
              : "hover:border-primary/50"
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
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-base-content/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <button
        className="btn btn-warning h-10 text-sm w-full group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:shadow-none"
        onClick={handleStatus}
        disabled={!isConnected}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-warning/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="flex items-center justify-center gap-2 relative z-10">
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
              d="M15 17h5l-5 5v-5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <span>Send Status</span>
        </div>
      </button>
    </div>
  );
};
