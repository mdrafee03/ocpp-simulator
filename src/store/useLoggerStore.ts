import { create } from "zustand";

export interface Message {
  message: string;
  type: "incoming" | "outgoing" | "info" | "error";
}

type LoggerState = {
  messages: Message[];
  logMsg: (type: Message["type"], msg: Message["message"]) => void;
  clear: () => void;
};

export const useLoggerStore = create<LoggerState>((set) => ({
  messages: [],
  logMsg: (type, message) =>
    set((state) => ({ messages: [...state.messages, { type, message }] })),
  clear: () => set({ messages: [] }),
}));
