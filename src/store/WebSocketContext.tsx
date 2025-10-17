import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
  type PropsWithChildren,
} from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { OCPP_VERSIONS } from "../constants/constants";
import { useConfigStore } from "./useConfigStore";
import { useLoggerStore } from "./useLoggerStore";
import { useServerStore } from "./useServerStore";

interface WebSocketContextType {
  sendMessage: (msg: string) => void;
  lastMessage: MessageEvent<string> | null;
  readyState: ReadyState;
  connect: () => void;
  closeWebSocket: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider = ({ children }: PropsWithChildren) => {
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const config = useConfigStore((state) => state.config);
  const logMsg = useLoggerStore((state) => state.logMsg);
  const getServerUrl = useServerStore((state) => state.getServerUrl);
  const prevReadyState = useRef<ReadyState | null>(null);

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    wsUrl,
    {
      protocols: wsUrl ? [...OCPP_VERSIONS] : undefined,
      shouldReconnect: () => false,
    }
  );

  // Handle WebSocket connection state changes and logging
  useEffect(() => {
    if (
      readyState === ReadyState.OPEN &&
      prevReadyState.current !== ReadyState.OPEN
    ) {
      logMsg("info", "WebSocket is connected");
    } else if (
      readyState === ReadyState.CLOSED &&
      prevReadyState.current !== ReadyState.CLOSED
    ) {
      logMsg("info", "WebSocket connection closed");
    }
    prevReadyState.current = readyState;
  }, [readyState, logMsg]);

  const connect = useCallback(() => {
    // Force reconnection by first closing any existing connection
    getWebSocket()?.close();
    setWsUrl(null);
    // Set the URL after a brief delay to ensure the previous connection is closed
    setTimeout(() => {
      const serverUrl = getServerUrl(config.serverName);
      if (serverUrl) {
        setWsUrl(serverUrl + config.serialNumber);
      }
    }, 100);
  }, [getWebSocket, getServerUrl, config.serverName, config.serialNumber]);

  const closeWebSocket = useCallback(() => {
    getWebSocket()?.close();
    setWsUrl(null);
  }, [getWebSocket]);

  const value = useMemo(
    () => ({ sendMessage, lastMessage, readyState, connect, closeWebSocket }),
    [sendMessage, lastMessage, readyState, connect, closeWebSocket]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketHook = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx)
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  return ctx;
};
