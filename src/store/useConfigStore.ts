import { create } from "zustand";
import { getRandomId } from "../helpers/helpers";
import type { OcppRequestType, OcppStatusType } from "../constants/enums";

type Configuration = {
  env: "Local" | "Dev";
  serialNumber: string;
  id: string;
  meterCount: number;
  meterValue: number;
  transactionId?: number;
  lastAction?: OcppRequestType;
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

export const useConfigStore = create<ConfigState>((set) => ({
  config: defaultConfig,
  setConfig: (config) => set({ config }),
  clearConfig: () => set({ config: defaultConfig }),
}));
