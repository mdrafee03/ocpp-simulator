import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getRandomId } from "../helpers/helpers";
import type { OcppStatusType } from "../constants/enums";

type Configuration = {
  env: "Local" | "Dev";
  serialNumber: string;
  id: string;
  meterCount: number;
  meterValue: number;
  transactionId?: number;
  status: OcppStatusType;
};

type ConfigState = {
  config: Configuration;
  setConfig: (config: Configuration) => void;
  clearConfig: () => void;
};

const defaultConfig: Configuration = {
  env: "Dev",
  serialNumber: "WI2695_8",
  id: getRandomId(),
  meterCount: 1,
  meterValue: 10,
  status: "Available",
};

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      config: defaultConfig,
      setConfig: (config) => set({ config }),
      clearConfig: () => set({ config: defaultConfig }),
    }),
    {
      name: "config-storage",
    }
  )
);
