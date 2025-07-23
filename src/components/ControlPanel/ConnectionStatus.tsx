import { useWebSocketHook } from "../../store/WebSocketContext";
import { useControlPanel } from "./useControlPanel";

export const ConnectionStatus = () => {
  const { readyState } = useWebSocketHook();
  const { handleConnect, handleReconnect, handleClose } = useControlPanel();

  return (
    <div className="flex justify-between items-center gap-4 p-3 bg-base-200 rounded-lg">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        {readyState === 1 ? (
          <>
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="font-medium text-success">Connected</span>
          </>
        ) : (
          <>
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="font-medium text-error">Disconnected</span>
          </>
        )}
      </div>

      {/* Connection Actions */}
      <div className="flex gap-2">
        {readyState === 1 ? (
          <>
            <button
              className="btn btn-sm btn-outline"
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
            <button className="btn btn-sm btn-error" onClick={handleClose}>
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
          <button className="btn btn-sm btn-primary" onClick={handleConnect}>
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
  );
};
