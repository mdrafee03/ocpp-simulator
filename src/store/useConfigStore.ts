import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getRandomId } from "../helpers/helpers";
import type { OcppStatusType } from "../constants/enums";

type Configuration = {
  serverName: string;
  serialNumber: string;
  id: string;
  meterCount: number;
  meterValue: number;
  transactionId?: number;
  status: OcppStatusType;
  isMeterActive: boolean; // Add meter interval state
};

type ConfigState = {
  config: Configuration;
  setConfig: (config: Configuration) => void;
  clearConfig: () => void;
  setMeterActive: (active: boolean) => void; // Add setter for meter state
};

const defaultConfig: Configuration = {
  serverName: "Dev",
  serialNumber: "WI2695_8",
  id: getRandomId(),
  meterCount: 1,
  meterValue: 10,
  status: "Available",
  isMeterActive: false, // Initialize as false
};

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      config: defaultConfig,
      setConfig: (config) => set({ config }),
      clearConfig: () => set({ config: defaultConfig }),
      setMeterActive: (active) =>
        set((state) => ({
          config: { ...state.config, isMeterActive: active },
        })),
    }),
    {
      name: "config-storage",
    }
  )
);
