import { useEffect, useState, useRef, useCallback } from "react";
import { ReadyState } from "react-use-websocket";
import { OcppMessageType, OcppRequestType } from "../../constants/enums";
import { useMeterValue } from "../../hooks/useMeterValue";
import { useStartTransaction } from "../../hooks/useStartTransaction";
import { useActionStore } from "../../store/useActionsStore";
import { useConfigStore } from "../../store/useConfigStore";
import { useLoggerStore } from "../../store/useLoggerStore";
import { useWebSocketHook } from "../../store/WebSocketContext";

export function useControlPanel() {
  const logMsg = useLoggerStore((state) => state.logMsg);
  const clearLogs = useLoggerStore((state) => state.clear);
  const { connect, sendMessage, closeWebSocket } = useWebSocketHook();
  const { config } = useConfigStore();
  const { actions, setActions } = useActionStore();
  const { handleStartTransaction } = useStartTransaction();
  const [status, setStatus] = useState("Available");
  const { sendMeterValues } = useMeterValue();

  const { readyState } = useWebSocketHook();

  const { id, serialNumber } = config;

  const [shouldSendBootNotification, setShouldSendBootNotification] =
    useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const prevReadyState = useRef<ReadyState | null>(null);

  const handleBootNotification = useCallback(() => {
    const message = JSON.stringify([
      OcppMessageType.Call,
      id,
      OcppRequestType.BootNotification,
      {
        chargePointVendor: "AVT-Company-1",
        chargePointModel: "AVT-Express",
        chargePointSerialNumber: "2706_1",
        chargeBoxSerialNumber: "2706_1.01.22",
        firmwareVersion: "0.9.87",
        iccid: "2222",
        imsi: "33333",
        meterType: "AVT NQC-ACDC",
        meterSerialNumber: "2706_1.01",
      },
    ]);

    sendMessage(message);
    logMsg("outgoing", `Boot notification: ${message}`);
  }, [id, sendMessage, logMsg]);

  useEffect(() => {
    if (
      readyState === ReadyState.OPEN &&
      prevReadyState.current !== ReadyState.OPEN
    ) {
      if (isReconnecting) {
        logMsg("info", "Reconnected successfully");
        setIsReconnecting(false);
      } else {
        logMsg("info", "WebSocket is connected");
      }
      if (shouldSendBootNotification) {
        handleBootNotification();
        setShouldSendBootNotification(false);
      }
    } else if (
      readyState === ReadyState.CLOSED &&
      prevReadyState.current !== ReadyState.CLOSED
    ) {
      logMsg("info", "WebSocket connection closed");
    }
    prevReadyState.current = readyState;
  }, [
    readyState,
    shouldSendBootNotification,
    logMsg,
    isReconnecting,
    handleBootNotification,
  ]);

  const handleConnect = () => {
    clearLogs();
    setShouldSendBootNotification(true);
    connect();
  };

  const handleReconnect = () => {
    clearLogs();
    setIsReconnecting(true);
    logMsg("info", "Reconnecting...");
    handleConnect();
  };

  const handleClose = () => {
    closeWebSocket();
  };

  const handleAuthorize = () => {
    const message = JSON.stringify([
      OcppMessageType.Call,
      id,
      OcppRequestType.Authorize,
      { idTag: serialNumber },
    ]);
    sendMessage(message);
    logMsg("outgoing", `Authorize sent: ${message}`);
  };

  const handleStopTransaction = (transactionId = "") => {
    const requestType = OcppRequestType.StopTransaction;

    const ssid = transactionId ? transactionId : actions.transactionId;
    if (!ssid) {
      logMsg(
        "error",
        "Transaction ID is not set. Please start a transaction first."
      );
      return;
    }
    const message = JSON.stringify([
      OcppMessageType.Call,
      id,
      requestType,
      {
        transactionId: ssid,
        idTag: serialNumber,
        timestamp: new Date().toISOString(),
        meterStop: 20,
      },
    ]);

    sendMessage(message);
    logMsg("outgoing", `Stop Transaction sent: ${message}`);
    setActions({
      ...actions,
      lastAction: requestType,
    });
  };

  const handleHeartbeat = () => {
    const requestType = OcppRequestType.Heartbeat;
    const message = JSON.stringify([OcppMessageType.Call, id, requestType, {}]);

    sendMessage(message);
    logMsg("outgoing", `Heartbeat sent: ${message}`);
    setActions({
      ...actions,
      lastAction: requestType,
    });
  };

  const handleSendMeter = () => {
    logMsg("info", "Setting meter value interval to 1 minutes");
    setInterval(() => {
      sendMeterValues();
    }, 60000);
  };
  const handleStatus = () => {
    const requestType = OcppRequestType.StatusNotification;
    const message = JSON.stringify([
      OcppMessageType.Call,
      id,
      requestType,
      {
        connectorId: 1,
        status: status,
        errorCode: "NoError",
        info: "",
        timestamp: new Date().toISOString(),
        vendorId: "",
        vendorErrorCode: "",
      },
    ]);

    sendMessage(message);
    logMsg("outgoing", `Status Notification sent: ${message}`);
    setActions({ ...actions, lastAction: requestType });
  };

  return {
    handleConnect,
    handleReconnect,
    handleClose,
    handleAuthorize,
    handleStartTransaction,
    handleStopTransaction,
    handleHeartbeat,
    handleSendMeter,
    handleStatus,
    status,
    setStatus,
  };
}
