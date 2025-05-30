import { create } from 'zustand';

export type Tarifa = 'R' | 'DA' | 'DB' | 'C' | 'CA' | 'CB' | 'I';

interface TarifaState {
  currentTarifa: Tarifa;
  setCurrentTarifa: (tarifa: Tarifa) => void;
}

export const useTarifaStore = create<TarifaState>((set) => ({
  currentTarifa: 'R',
  setCurrentTarifa: (tarifa) => set({ currentTarifa: tarifa }),
}));
