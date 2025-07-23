import { useRef, useCallback, useEffect } from "react";
import { OcppMessageType, OcppRequestType } from "../constants/enums";
import { getRandomId } from "../helpers/helpers";
import { useConfigStore } from "../store/useConfigStore";
import { useLoggerStore } from "../store/useLoggerStore";
import { useWebSocketHook } from "../store/WebSocketContext";
import { useActionStore } from "../store/useActionsStore";
import { useMessageTrackingStore } from "../store/useMessageTrackingStore";

export const useMeterValue = () => {
  const { sendMessage, readyState } = useWebSocketHook();
  const { logMsg } = useLoggerStore();
  const { config, setConfig } = useConfigStore();
  const { actions } = useActionStore();
  const { addPendingMessage } = useMessageTrackingStore();
  const { meterCount, meterValue } = config;
  const { transactionId } = actions;

  // Store interval reference to prevent memory leaks
  const intervalRef = useRef<number | null>(null);
  // Store current meter value to avoid race conditions
  const currentMeterValueRef = useRef<number>(meterValue);

  // Update ref when meterValue changes
  useEffect(() => {
    currentMeterValueRef.current = meterValue;
  }, [meterValue]);

  const sendMeterValues = useCallback(() => {
    // Only send meter values if we have an active transaction
    if (!transactionId) {
      logMsg("error", "Cannot send meter values: No active transaction");
      return;
    }

    // Only send if WebSocket is connected
    if (readyState !== 1) {
      // 1 = OPEN
      logMsg("error", "Cannot send meter values: WebSocket not connected");
      return;
    }

    const id = getRandomId();

    // Update meter count first
    const newMeterCount = meterCount < 100 ? meterCount + 1 : meterCount;
    if (meterCount < 100) {
      setConfig({ ...config, meterCount: newMeterCount });
    }

    // Calculate realistic charging values
    const chargeEffect =
      800 + (Math.floor(Math.random() * 100 + 1) + newMeterCount) * 100;

    let soc = 50 + newMeterCount + 2;
    if (soc > 100) {
      soc = 100;
    }

    // Calculate energy increment based on power and time
    // Assuming 60-second intervals, convert power (W) to energy (kWh)
    const powerInKw = chargeEffect / 1000; // Convert W to kW
    const timeInHours = 60 / 3600; // 60 seconds in hours
    const energyIncrement = powerInKw * timeInHours;

    // Add some small variation (±10%) to make it realistic
    const variation = 1 + (Math.random() - 0.5) * 0.2; // ±10%
    const adjustedIncrement = energyIncrement * variation;

    // Always increment the charge amount (never decrease)
    const currentValue = currentMeterValueRef.current;
    const newChargeAmount = currentValue + Math.max(0.01, adjustedIncrement); // Minimum 0.01 kWh increment

    // Update the ref immediately
    currentMeterValueRef.current = newChargeAmount;

    setConfig({ ...config, meterValue: newChargeAmount });

    const message = JSON.stringify([
      OcppMessageType.Call,
      id,
      OcppRequestType.MeterValues,
      {
        connectorId: 1,
        transactionId: transactionId,
        meterValue: [
          {
            timestamp: new Date().toISOString(),
            sampledValue: [
              {
                value: newChargeAmount.toString(),
                measurand: "Energy.Active.Import.Register",
                unit: "kWh",
              },
              {
                value: chargeEffect.toString(),
                measurand: "Power.Active.Import",
                unit: "W",
              },
              {
                value: soc.toString(),
                measurand: "SoC",
                unit: "Percent",
              },
            ],
          },
        ],
      },
    ]);

    sendMessage(message);
    addPendingMessage(id, OcppRequestType.MeterValues);
    logMsg(
      "outgoing",
      `Meter Values sent: ${newChargeAmount} kWh, ${chargeEffect} W, ${soc}% SoC`
    );
  }, [
    transactionId,
    meterValue,
    meterCount,
    config,
    setConfig,
    readyState,
    sendMessage,
    logMsg,
    actions,
  ]);

  const startMeterInterval = useCallback(
    (intervalMs: number = 60000) => {
      // Clear any existing interval first
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (!transactionId) {
        logMsg("error", "Cannot start meter interval: No active transaction");
        return false;
      }

      if (readyState !== 1) {
        logMsg("error", "Cannot start meter interval: WebSocket not connected");
        return false;
      }

      // Send initial meter value immediately
      sendMeterValues();

      // Set up interval
      intervalRef.current = setInterval(sendMeterValues, intervalMs);
      logMsg(
        "info",
        `Meter value interval started: ${intervalMs / 1000} seconds`
      );
      return true;
    },
    [transactionId, readyState, sendMeterValues, logMsg, actions]
  );

  const stopMeterInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      logMsg("info", "Meter value interval stopped");
    }
  }, [logMsg]);

  const isMeterIntervalActive = useCallback(() => {
    return intervalRef.current !== null;
  }, []);

  return {
    sendMeterValues,
    startMeterInterval,
    stopMeterInterval,
    isMeterIntervalActive,
  };
};
