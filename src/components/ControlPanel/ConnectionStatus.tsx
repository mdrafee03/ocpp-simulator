import { useWebSocketHook } from "../../store/WebSocketContext";
import { useControlPanel } from "./useControlPanel";

export const ConnectionStatus = () => {
  const { readyState } = useWebSocketHook();
  const { handleConnect, handleReconnect, handleClose, handleHeartbeat } =
    useControlPanel();

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center gap-4 p-4 bg-base-200 rounded-lg border-2 border-base-300">
        {/* Connection Status */}
        <div className="flex items-center gap-3">
          {readyState === 1 ? (
            <>
              <div className="w-4 h-4 bg-success rounded-full animate-pulse shadow-lg"></div>
              <div className="flex flex-col">
                <span className="font-bold text-success text-lg">
                  Connected
                </span>
                <span className="text-xs text-success/70">
                  WebSocket Active
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="w-4 h-4 bg-error rounded-full shadow-lg"></div>
              <div className="flex flex-col">
                <span className="font-bold text-error text-lg">
                  Disconnected
                </span>
                <span className="text-xs text-error/70">No Connection</span>
              </div>
            </>
          )}
        </div>

        {/* Connection Actions */}
        <div className="flex gap-2">
          {readyState === 1 ? (
            <>
              <button
                className="btn btn-sm btn-info group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
                onClick={handleHeartbeat}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-info/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center gap-2 relative z-10">
                  <svg
                    className="w-4 h-4 animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>Heartbeat</span>
                </div>
              </button>
              <button
                className="btn btn-sm btn-outline hover:btn-secondary"
                onClick={handleReconnect}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Reconnect
              </button>
              <button
                className="btn btn-sm btn-error hover:btn-error/80"
                onClick={handleClose}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Disconnect
              </button>
            </>
          ) : (
            <button
              className="btn btn-sm btn-primary hover:btn-primary/80"
              onClick={handleConnect}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
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
      </div>
    </div>
  );
};
