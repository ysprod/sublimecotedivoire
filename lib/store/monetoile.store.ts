import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem } from '../libs/interface';

interface MenuStore {
  currentItem: MenuItem | null;
  recentItems: MenuItem[];
  favorites: string[];

  setCurrentItem: (item: MenuItem | null) => void;
  updateCurrentItem: (updates: Partial<MenuItem>) => void;
  clearCurrentItem: () => void;

  addToRecent: (item: MenuItem) => void;
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
}

export const useMonEtoileStore = create<MenuStore>()(
  persist(
    (set, get) => ({
      currentItem: null,
      recentItems: [],
      favorites: [],

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
    }),
    {
      name: 'menu-storage',
      partialize: (state) => ({
        currentItem: state.currentItem,
        recentItems: state.recentItems,
        favorites: state.favorites,
      }),
      version: 2,
      // Optionnel: migrer les données d'anciennes versions
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration depuis version 0
          return {
            ...persistedState,
          };
        }
        return persistedState;
      },
    }
  )
); 