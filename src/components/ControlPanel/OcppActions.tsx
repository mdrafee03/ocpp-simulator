import { useWebSocketHook } from "../../store/WebSocketContext";
import { useControlPanel } from "./useControlPanel";

export const OcppActions = () => {
  const { readyState } = useWebSocketHook();
  const { handleAuthorize, handleStartTransaction, handleStopTransaction } =
    useControlPanel();

  const isConnected = readyState === 1;

  return (
    <div className="grid grid-cols-1 gap-2">
      <button
        className="btn btn-primary h-10 text-sm w-full group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:shadow-none"
        onClick={handleAuthorize}
        disabled={!isConnected}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Authorize</span>
        </div>
      </button>

      <div className="grid grid-cols-2 gap-2">
        <button
          className="btn btn-secondary h-10 text-sm w-full group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:shadow-none"
          onClick={handleStartTransaction}
          disabled={!isConnected}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>Start Transaction</span>
          </div>
        </button>

        <button
          className="btn btn-accent h-10 text-sm w-full group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:shadow-none"
          onClick={() => handleStopTransaction()}
          disabled={!isConnected}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            </svg>
            <span>Stop Transaction</span>
          </div>
        </button>
      </div>
    </div>
  );
};
