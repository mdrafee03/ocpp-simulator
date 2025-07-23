import { create } from "zustand";

type PendingMessage = {
  id: string;
  action: string;
  timestamp: number;
};

type MessageTrackingState = {
  pendingMessages: PendingMessage[];
  addPendingMessage: (id: string, action: string) => void;
  removePendingMessage: (id: string) => PendingMessage | null;
  clearPendingMessages: () => void;
};

export const useMessageTrackingStore = create<MessageTrackingState>(
  (set, get) => ({
    pendingMessages: [],
    addPendingMessage: (id: string, action: string) =>
      set((state) => ({
        pendingMessages: [
          ...state.pendingMessages,
          { id, action, timestamp: Date.now() },
        ],
      })),
    removePendingMessage: (id: string) => {
      const state = get();
      const messageIndex = state.pendingMessages.findIndex(
        (msg) => msg.id === id
      );
      if (messageIndex === -1) return null;

      const message = state.pendingMessages[messageIndex];
      set((state) => ({
        pendingMessages: state.pendingMessages.filter(
          (_, index) => index !== messageIndex
        ),
      }));
      return message;
    },
    clearPendingMessages: () => set({ pendingMessages: [] }),
  })
);
