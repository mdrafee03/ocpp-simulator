import { create } from "zustand";
import { persist } from "zustand/middleware";

type Actions = {
  transactionId?: number;
};

type ActionState = {
  actions: Actions;
  setActions: (config: Actions) => void;
};

const defaultValues: Actions = {};

export const useActionStore = create<ActionState>()(
  persist(
    (set) => ({
      actions: defaultValues,
      setActions: (config) => set({ actions: config }),
    }),
    {
      name: "actions-storage",
    }
  )
);
