import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Server {
  id: string;
  name: string;
  url: string;
}

type ServerState = {
  servers: Server[];
  addServer: (server: Server) => void;
  updateServer: (id: string, name: string, url: string) => void;
  deleteServer: (id: string) => void;
  getServerUrl: (name: string) => string | undefined;
};

export const useServerStore = create<ServerState>()(
  persist(
    (set, get) => ({
      servers: [
        { id: "1", name: "Local", url: "ws://localhost:5001/ocpp/" },
        { id: "2", name: "Dev", url: "wss://watt-appengine-ocpp-api-dev-dot-watt-dev-307411.ey.r.appspot.com/ocpp/" },
      ],
      addServer: (server: Server) => {
        set((state) => ({
          servers: [...state.servers, server],
        }));
      },
      updateServer: (id: string, name: string, url: string) => {
        set((state) => ({
          servers: state.servers.map((server) =>
            server.id === id ? { ...server, name, url } : server
          ),
        }));
      },
      deleteServer: (id: string) => {
        set((state) => ({
          servers: state.servers.filter((server) => server.id !== id),
        }));
      },
      getServerUrl: (name: string) => {
        return get().servers.find((server) => server.name === name)?.url;
      },
    }),
    {
      name: "server-storage",
    }
  )
);
