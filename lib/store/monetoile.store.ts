import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem } from '../libs/interface';

 

 

interface MenuStore {
  // État
  currentItem: MenuItem | null;
  recentItems: MenuItem[]; // Optionnel: historique des items récents
  favorites: string[]; // Optionnel: IDs des favoris
  
  // Actions
  setCurrentItem: (item: MenuItem | null) => void;
  updateCurrentItem: (updates: Partial<MenuItem>) => void;
  clearCurrentItem: () => void;
  
  // Actions optionnelles
  addToRecent: (item: MenuItem) => void;
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
}

// Store principal
export const useMonEtoileStore = create<MenuStore>()(
  persist(
    (set, get) => ({
      // État initial
      currentItem: null,
      recentItems: [],
      favorites: [],

      // Actions principales
      setCurrentItem: (item) => set({ currentItem: item }),
      
      updateCurrentItem: (updates) => set((state) => ({
        currentItem: state.currentItem 
          ? { ...state.currentItem, ...updates }
          : null
      })),
      
      clearCurrentItem: () => set({ currentItem: null }),
      
      // Actions optionnelles
      addToRecent: (item) => set((state) => {
        // Éviter les doublons
        const filtered = state.recentItems.filter(i => i.title !== item.title);
        // Garder seulement les 10 derniers
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
      name: 'menu-storage', // Nom dans localStorage
      partialize: (state) => ({
        // Ne persister que les données nécessaires
        currentItem: state.currentItem,
        recentItems: state.recentItems,
        favorites: state.favorites,
      }),
      // Optionnel: versionner le stockage
      version: 1,
      // Optionnel: migrer les données d'anciennes versions
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration depuis version 0
          return {
            ...persistedState,
            // Ajouter les nouveaux champs
          };
        }
        return persistedState;
      },
    }
  )
);

// Hook personnalisé pour faciliter l'utilisation
export const useCurrentMenuItem = () => {
  const currentItem = useMonEtoileStore((state) => state.currentItem);
  const setCurrentItem = useMonEtoileStore((state) => state.setCurrentItem);
  const updateCurrentItem = useMonEtoileStore((state) => state.updateCurrentItem);
  const clearCurrentItem = useMonEtoileStore((state) => state.clearCurrentItem);
  const addToRecent = useMonEtoileStore((state) => state.addToRecent);
  
  return {
    currentItem,
    setCurrentItem,
    updateCurrentItem,
    clearCurrentItem,
    addToRecent,
  };
};

// Exemple d'utilisation dans un composant
// const { currentItem, setCurrentItem, updateCurrentItem } = useCurrentMenuItem();