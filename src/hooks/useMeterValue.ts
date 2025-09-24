import { useRef, useCallback, useEffect } from "react";
import { OcppMessageType, OcppRequestType } from "../constants/enums";
import { getRandomId } from "../helpers/helpers";
import { useConfigStore } from "../store/useConfigStore";
import { useLoggerStore } from "../store/useLoggerStore";
import { useWebSocketHook } from "../store/WebSocketContext";
import { useActionStore } from "../store/useActionsStore";
import { useMessageTrackingStore } from "../store/useMessageTrackingStore";

// Constants
const WEBSOCKET_OPEN_STATE = 1;
const METER_INTERVAL_MS = 60000; // 60 seconds
const METER_COUNT_MAX = 100;
const BASE_CHARGE_EFFECT = 800;
const CHARGE_EFFECT_MULTIPLIER = 100;
const BASE_SOC = 50;
const SOC_INCREMENT = 2;
const SOC_MAX = 100;
const ENERGY_VARIATION = 0.2; // ±10%
const MIN_ENERGY_INCREMENT = 0.01;
const TIME_INTERVAL_HOURS = 60 / 3600; // 60 seconds in hours

// Types
interface MeterCalculations {
  chargeEffect: number;
  soc: number;
  energyIncrement: number;
  newChargeAmount: number;
}

export const useMeterValue = () => {
  const { sendMessage, readyState } = useWebSocketHook();
  const { logMsg } = useLoggerStore();
  const { config, setConfig, setMeterActive } = useConfigStore();
  const { actions } = useActionStore();
  const { addPendingMessage } = useMessageTrackingStore();
  const { meterCount, meterValue, isMeterActive } = config;
  const { transactionId } = actions;

  // Store interval reference to prevent memory leaks
  const intervalRef = useRef<number | null>(null);
  // Store current meter value to avoid race conditions
  const currentMeterValueRef = useRef<number>(meterValue);

  // Update ref when meterValue changes
  useEffect(() => {
    currentMeterValueRef.current = meterValue;
  }, [meterValue]);

  // Helper function to stop meter interval
  const stopMeterIntervalInternal = useCallback(
    (reason: string) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setMeterActive(false);
        logMsg("info", `Meter interval stopped - ${reason}`);
      } else {
        // Even if no interval is running, ensure meter is marked as inactive
        setMeterActive(false);
        logMsg("info", `Meter marked as inactive - ${reason}`);
      }
    },
    [setMeterActive, logMsg]
  );

  // Helper function to check if meter values can be sent
  const canSendMeterValues = useCallback(() => {
    if (!transactionId) {
      logMsg("error", "Cannot send meter values: No active transaction");
      stopMeterIntervalInternal("no active transaction");
      return false;
    }

    if (readyState !== WEBSOCKET_OPEN_STATE) {
      logMsg(
        "error",
        `Cannot send meter values: WebSocket not connected (state: ${readyState})`
      );
      stopMeterIntervalInternal("WebSocket disconnected");
      return false;
    }

    return true;
  }, [transactionId, readyState, logMsg, stopMeterIntervalInternal]);

  // Helper function to calculate meter values
  const calculateMeterValues = useCallback(
    (newMeterCount: number): MeterCalculations => {
      // Calculate realistic charging values
      const chargeEffect =
        BASE_CHARGE_EFFECT +
        (Math.floor(Math.random() * 100 + 1) + newMeterCount) *
          CHARGE_EFFECT_MULTIPLIER;

      let soc = BASE_SOC + newMeterCount + SOC_INCREMENT;
      if (soc > SOC_MAX) {
        soc = SOC_MAX;
      }

      // Calculate energy increment based on power and time
      const powerInKw = chargeEffect / 1000; // Convert W to kW
      const energyIncrement = powerInKw * TIME_INTERVAL_HOURS;

      // Add some small variation (±10%) to make it realistic
      const variation = 1 + (Math.random() - 0.5) * ENERGY_VARIATION;
      const adjustedIncrement = energyIncrement * variation;

      // Always increment the charge amount (never decrease)
      const currentValue = currentMeterValueRef.current;
      const newChargeAmount =
        currentValue + Math.max(MIN_ENERGY_INCREMENT, adjustedIncrement);

      return {
        chargeEffect,
        soc,
        energyIncrement: adjustedIncrement,
        newChargeAmount,
      };
    },
    []
  );

  // Helper function to create meter value message
  const createMeterValueMessage = useCallback(
    (id: string, calculations: MeterCalculations) => {
      return JSON.stringify([
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
                  value: calculations.newChargeAmount.toString(),
                  measurand: "Energy.Active.Import.Register",
                  unit: "kWh",
                },
                {
                  value: calculations.chargeEffect.toString(),
                  measurand: "Power.Active.Import",
                  unit: "W",
                },
                {
                  value: calculations.soc.toString(),
                  measurand: "SoC",
                  unit: "Percent",
                },
              ],
            },
          ],
        },
      ]);
    },
    [transactionId]
  );

  const sendMeterValues = useCallback(() => {
    if (!canSendMeterValues()) {
      return;
    }

    const id = getRandomId();

    // Update meter count first
    const newMeterCount =
      meterCount < METER_COUNT_MAX ? meterCount + 1 : meterCount;
    if (meterCount < METER_COUNT_MAX) {
      setConfig({ ...config, meterCount: newMeterCount });
    }

    // Calculate meter values
    const calculations = calculateMeterValues(newMeterCount);

    // Update the ref immediately
    currentMeterValueRef.current = calculations.newChargeAmount;
    setConfig({ ...config, meterValue: calculations.newChargeAmount });

    // Create and send message
    const message = createMeterValueMessage(id, calculations);

    // Double-check WebSocket is still connected before sending
    if (readyState !== WEBSOCKET_OPEN_STATE) {
      logMsg("error", "WebSocket disconnected before sending meter values");
      return;
    }

    sendMessage(message);
    addPendingMessage(id, OcppRequestType.MeterValues);
    logMsg(
      "outgoing",
      `Meter Values sent: ${calculations.newChargeAmount} kWh, ${calculations.chargeEffect} W, ${calculations.soc}% SoC`
    );
  }, [
    canSendMeterValues,
    meterCount,
    config,
    setConfig,
    calculateMeterValues,
    createMeterValueMessage,
    readyState,
    sendMessage,
    addPendingMessage,
    logMsg,
  ]);

  const startMeterInterval = useCallback(
    (intervalMs: number = METER_INTERVAL_MS) => {
      // Clear any existing interval first
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (!transactionId) {
        logMsg("error", "Cannot start meter interval: No active transaction");
        return false;
      }

      if (readyState !== WEBSOCKET_OPEN_STATE) {
        logMsg("error", "Cannot start meter interval: WebSocket not connected");
        return false;
      }

      // Send initial meter value immediately
      sendMeterValues();

      // Set up interval
      intervalRef.current = setInterval(sendMeterValues, intervalMs);
      setMeterActive(true);
      logMsg(
        "info",
        `Meter value interval started by user: ${intervalMs / 1000} seconds`
      );
      return true;
    },
    [transactionId, readyState, sendMeterValues, logMsg, setMeterActive]
  );

  const stopMeterInterval = useCallback(() => {
    stopMeterIntervalInternal("user stopped");
  }, [stopMeterIntervalInternal]);

  const isMeterIntervalActive = useCallback(() => {
    return isMeterActive;
  }, [isMeterActive]);

  // Effect to automatically stop meter interval when transaction is cleared
  useEffect(() => {
    if (!transactionId && intervalRef.current) {
      stopMeterIntervalInternal("transaction ended");
    }
  }, [transactionId, stopMeterIntervalInternal]);

  // Effect to monitor WebSocket connection and stop meter interval when disconnected
  useEffect(() => {
    if (readyState !== WEBSOCKET_OPEN_STATE && intervalRef.current) {
      stopMeterIntervalInternal("WebSocket connection lost");
    }
  }, [readyState, stopMeterIntervalInternal]);

  return {
    sendMeterValues,
    startMeterInterval,
    stopMeterInterval,
    isMeterIntervalActive,
    isMeterActive,
  };
};
