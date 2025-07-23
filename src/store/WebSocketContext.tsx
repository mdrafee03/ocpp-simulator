import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Environments, OCPP_VERSIONS } from "../constants/constants";
import { useConfigStore } from "./useConfigStore";

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

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    wsUrl,
    {
      protocols: wsUrl ? [...OCPP_VERSIONS] : undefined,
      shouldReconnect: () => false,
    }
  );

  const connect = () => {
    // Force reconnection by first closing any existing connection
    getWebSocket()?.close();
    setWsUrl(null);
    // Set the URL after a brief delay to ensure the previous connection is closed
    setTimeout(() => {
      setWsUrl(Environments[config.env] + config.serialNumber);
    }, 100);
  };

  const closeWebSocket = () => {
    getWebSocket()?.close();
    setWsUrl(null);
  };

  const value = useMemo(
    () => ({ sendMessage, lastMessage, readyState, connect, closeWebSocket }),
    [sendMessage, lastMessage, readyState, config, getWebSocket]
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
