import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Charger {
  id: string;
  serialNumber: string;
}

type ChargersState = {
  chargers: Charger[];
  addCharger: (serialNumber: string) => void;
  updateCharger: (id: string, serialNumber: string) => void;
  deleteCharger: (id: string) => void;
  getChargerById: (id: string) => Charger | undefined;
};

export const useChargersStore = create<ChargersState>()(
  persist(
    (set, get) => ({
      chargers: [
        { id: "1", serialNumber: "WI2695_8" },
        { id: "2", serialNumber: "WI2695_9" },
        { id: "3", serialNumber: "WI2695_10" },
      ],
      addCharger: (serialNumber: string) => {
        const newCharger: Charger = {
          id: Date.now().toString(),
          serialNumber,
        };
        set((state) => ({
          chargers: [...state.chargers, newCharger],
        }));
      },
      updateCharger: (id: string, serialNumber: string) => {
        set((state) => ({
          chargers: state.chargers.map((charger) =>
            charger.id === id ? { ...charger, serialNumber } : charger
          ),
        }));
      },
      deleteCharger: (id: string) => {
        set((state) => ({
          chargers: state.chargers.filter((charger) => charger.id !== id),
        }));
      },
      getChargerById: (id: string) => {
        return get().chargers.find((charger) => charger.id === id);
      },
    }),
    {
      name: "chargers-storage",
    }
  )
);
