import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Environment {
  name: string;
  url: string;
}

type EnvironmentState = {
  environments: Environment[];
  updateEnvironment: (name: string, url: string) => void;
  getEnvironmentUrl: (name: string) => string | undefined;
};

export const useEnvironmentStore = create<EnvironmentState>()(
  persist(
    (set, get) => ({
      environments: [
        { name: "Local", url: "ws://localhost:8080" },
        { name: "Dev", url: "wss://dev.example.com" },
      ],
      updateEnvironment: (name: string, url: string) => {
        set((state) => ({
          environments: state.environments.map((env) =>
            env.name === name ? { ...env, url } : env
          ),
        }));
      },
      getEnvironmentUrl: (name: string) => {
        return get().environments.find((env) => env.name === name)?.url;
      },
    }),
    {
      name: "environment-storage",
    }
  )
);
