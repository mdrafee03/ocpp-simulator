import { ReadyState } from "react-use-websocket";

export const getRandomId = () => {
  const AllowedChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(36);
  window.crypto.getRandomValues(array);
  return Array.from(array, (x) => AllowedChars[x % AllowedChars.length]).join(
    ""
  );
};

export const getReadyStateStatus = (readyState: number): string | undefined => {
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return connectionStatus;
};
