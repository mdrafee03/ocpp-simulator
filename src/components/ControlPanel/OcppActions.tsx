import { useWebSocketHook } from "../../store/WebSocketContext";
import { useControlPanel } from "./useControlPanel";

export const OcppActions = () => {
  const { readyState } = useWebSocketHook();
  const {
    handleAuthorize,
    handleStartTransaction,
    handleStopTransaction,
    handleHeartbeat,
  } = useControlPanel();

  const isConnected = readyState === 1;

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        className="btn btn-primary h-12 text-base w-full"
        onClick={handleAuthorize}
        disabled={!isConnected}
      >
        Authorize
      </button>
      <button
        className="btn btn-primary h-12 text-base w-full"
        onClick={handleStartTransaction}
        disabled={!isConnected}
      >
        Start Transaction
      </button>
      <button
        className="btn btn-primary h-12 text-base w-full"
        onClick={() => handleStopTransaction()}
        disabled={!isConnected}
      >
        Stop Transaction
      </button>
      <button
        className="btn btn-primary h-12 text-base w-full"
        onClick={handleHeartbeat}
        disabled={!isConnected}
      >
        Heartbeat
      </button>
    </div>
  );
};
