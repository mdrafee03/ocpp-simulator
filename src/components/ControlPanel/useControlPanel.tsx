import { useEffect, useState, useRef, useCallback } from "react";
import { ReadyState } from "react-use-websocket";
import { OcppMessageType, OcppRequestType } from "../../constants/enums";
import { useMeterValue } from "../../hooks/useMeterValue";
import { useStartTransaction } from "../../hooks/useStartTransaction";
import { useActionStore } from "../../store/useActionsStore";
import { getRandomId } from "../../helpers/helpers";
import { useConfigStore } from "../../store/useConfigStore";
import { useLoggerStore } from "../../store/useLoggerStore";
import { useMessageTrackingStore } from "../../store/useMessageTrackingStore";
import { useWebSocketHook } from "../../store/WebSocketContext";

export function useControlPanel() {
  const logMsg = useLoggerStore((state) => state.logMsg);
  const clearLogs = useLoggerStore((state) => state.clear);
  const { connect, sendMessage, closeWebSocket, readyState } =
    useWebSocketHook();
  const { config } = useConfigStore();
  const { actions } = useActionStore();
  const { addPendingMessage } = useMessageTrackingStore();
  const { handleStartTransaction } = useStartTransaction();
  const [status, setStatus] = useState("Available");
  const { startMeterInterval, stopMeterInterval, isMeterIntervalActive } =
    useMeterValue();

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
    addPendingMessage(id, OcppRequestType.BootNotification);
    logMsg("outgoing", `Boot notification sent`);
  }, [id, sendMessage, logMsg, addPendingMessage]);

  useEffect(() => {
    if (
      readyState === ReadyState.OPEN &&
      prevReadyState.current !== ReadyState.OPEN
    ) {
      if (isReconnecting) {
        logMsg("info", "Reconnected successfully");
        setIsReconnecting(false);
      }
      if (shouldSendBootNotification) {
        // Add a small delay to ensure "WebSocket is connected" appears first
        setTimeout(() => {
          handleBootNotification();
          setShouldSendBootNotification(false);
        }, 50);
      }
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
    addPendingMessage(id, OcppRequestType.Authorize);
    logMsg("outgoing", `Authorize request sent`);
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
    addPendingMessage(id, requestType);
    logMsg("outgoing", `Stop transaction request sent`);
  };

  const handleHeartbeat = () => {
    const requestType = OcppRequestType.Heartbeat;
    const message = JSON.stringify([OcppMessageType.Call, id, requestType, {}]);

    sendMessage(message);
    addPendingMessage(id, requestType);
    logMsg("outgoing", `Heartbeat request sent`);
  };

  const handleSendMeter = () => {
    if (isMeterIntervalActive()) {
      stopMeterInterval();
    } else {
      startMeterInterval(60000); // 1 minute interval
    }
  };
  const handleStatus = () => {
    const requestType = OcppRequestType.StatusNotification;
    const uniqueId = getRandomId();
    const message = JSON.stringify([
      OcppMessageType.Call,
      uniqueId,
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
    addPendingMessage(uniqueId, requestType);
    logMsg("outgoing", `Status notification sent: ${status}`);
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
