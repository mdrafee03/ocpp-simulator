import { create } from "zustand";
import type { OcppRequestType } from "../constants/enums";

type Actions = {
  lastAction?: OcppRequestType;
  transactionId?: number;
};

type ActionState = {
  actions: Actions;
  setActions: (config: Actions) => void;
};

const defaultValues: Actions = {};

export const useActionStore = create<ActionState>((set) => ({
  actions: defaultValues,
  setActions: (config) => set({ actions: config }),
}));
