import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem } from '../libs/interface';

interface MenuStore {
  currentItem: MenuItem | null;
  recentItems: MenuItem[];
  favorites: string[];
  etablissementItem: MenuItem | null;
  clientItem: MenuItem | null;
  setCurrentItem: (item: MenuItem | null) => void;
  updateCurrentItem: (updates: Partial<MenuItem>) => void;
  clearCurrentItem: () => void;
  addToRecent: (item: MenuItem) => void;
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  setEtablissementItem: (item: MenuItem) => void;
  setClientItem: (item: MenuItem) => void;
  clearEtablissementItem: () => void;
  clearClientItem: () => void;
}

export const useMonEtoileStore = create<MenuStore>()(
  persist(
    (set, get) => ({
      currentItem: null,
      recentItems: [],
      favorites: [],
      etablissementItem: null,
      clientItem: null,
      setCurrentItem: (item) => set({ currentItem: item }),
      updateCurrentItem: (updates) => set((state) => ({
        currentItem: state.currentItem
          ? { ...state.currentItem, ...updates }
          : null
      })),
      clearCurrentItem: () => set({ currentItem: null }),
      addToRecent: (item) => set((state) => {
        const filtered = state.recentItems.filter(i => i.title !== item.title);
        const recent = [item, ...filtered].slice(0, 10);
        return { recentItems: recent };
      }),
      toggleFavorite: (itemId) => set((state) => ({
        favorites: state.favorites.includes(itemId)
          ? state.favorites.filter(id => id !== itemId)
          : [...state.favorites, itemId]
      })),
      isFavorite: (itemId) => get().favorites.includes(itemId),
      setEtablissementItem: (item) => set({ etablissementItem: item }),
      setClientItem: (item) => set({ clientItem: item }),
      clearEtablissementItem: () => set({ etablissementItem: null }),
      clearClientItem: () => set({ clientItem: null }),
    }),
    {
      name: 'menu-storage',
      partialize: (state) => ({
        currentItem: state.currentItem,
        recentItems: state.recentItems,
        favorites: state.favorites,
        etablissementItem: state.etablissementItem,
        clientItem: state.clientItem,
      }),
      version: 3,
      migrate: (persistedState: any, version: number) => {
        if (version < 3) {
          return {
            ...persistedState,
            etablissementItem: null,
            clientItem: null,
          };
        }
        return persistedState;
      },
    }
  )
);