import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Rubrique } from '@/lib/interfaces';

interface MonEtoileStore {
  rubriqueEnCours: Rubrique | null;
  setRubriqueEnCours: (rubrique: Rubrique | null) => void;
}

export const useMonEtoileStore = create<MonEtoileStore>()(
  persist(
    (set) => ({
      rubriqueEnCours: null,
      setRubriqueEnCours: (rubrique) => set({ rubriqueEnCours: rubrique }),
    }),
    {
      name: 'monetoile-store', 
      partialize: (state) => ({
        rubriqueEnCours: state.rubriqueEnCours,
      }),
    }
  )
);