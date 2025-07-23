import { OcppStatus } from "../../constants/enums";
import { useWebSocketHook } from "../../store/WebSocketContext";
import { useControlPanel } from "./useControlPanel";

export const StatusControls = () => {
  const { readyState } = useWebSocketHook();
  const { handleStatus, status, setStatus } = useControlPanel();

  const isConnected = readyState === 1;

  return (
    <div className="grid grid-cols-2 gap-2">
      <select
        className={`select select-bordered h-12 text-base w-full ${
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
        className="btn btn-primary h-12 text-base w-full"
        onClick={handleStatus}
        disabled={!isConnected}
      >
        Send Status Notification
      </button>
    </div>
  );
};
