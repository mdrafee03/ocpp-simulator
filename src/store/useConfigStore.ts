import { create } from "zustand";
import { getRandomId } from "../helpers/helpers";

type Configuration = {
  env: "Local" | "Dev";
  serialNumber: string;
  id: string;
  meterCount: number;
};

type ConfigState = {
  config: Configuration;
  setConfig: (config: Configuration) => void;
  clearConfig: () => void;
};

const defaultConfig: Configuration = {
  env: "Local",
  serialNumber: "WI2695_8",
  id: getRandomId(),
  meterCount: 1,
};

export const useConfigStore = create<ConfigState>((set) => ({
  config: defaultConfig,
  setConfig: (config) => set({ config }),
  clearConfig: () => set({ config: defaultConfig }),
}));
