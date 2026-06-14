import { api } from "@/lib/api/client";
import type { User } from '@/lib/interfaces';
import { useAuthStore } from "@/lib/store/auth.store";
import { Compass, LucideIcon, Stars } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useStatsDataWithCache } from "../cache/useStatsDataWithCache";
import { useProfilCategories } from "./useProfilCategories";

// ==================== TYPES ====================
export interface HighlightCardType {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  link: string;
  badge?: string;
}

export type ConsultationCardChoice = {
  _id?: string;
  title: string;
  description: string;
};

export interface CategoryType {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  badge: string;
  badgeColor: string;
  description: string;
  link: string;
  stats: string;
  minGradeLevel?: number;
  lockedToastMessage?: string;
}

// ==================== UTILITIES ====================



export const useProfilHighlightCards = (): HighlightCardType[] => [
  {
    id: "carte-du-ciel",
    title: "MA CARTE DU CIEL",
    subtitle: "Positions Planétaires",
    icon: Compass,
    color: "from-blue-500 to-indigo-500",
    gradient: "from-blue-100/80 to-indigo-100/80 dark:from-blue-900/40 dark:to-indigo-900/40",
    link: "/star/carteduciel",
    badge: "Exclusif"
  },
  {
    id: "cinq-portes",
    title: "LES 5 PORTES DE DATAKWABA",
    subtitle: "Forces de DATAKWABA",
    icon: Stars,
    color: "from-red-600 to-red-600",
    gradient: "from-red-100/80 to-red-100/80 dark:from-red-900/40 dark:to-red-900/40",
    link: "/star/cinqportes",
    badge: "Premium"
  }
];
 


export function useProfilUser() {
  const router = useRouter();

  const categories = useProfilCategories();
  const highlightCards = useProfilHighlightCards();
  const { stats, isLoading: statsLoading, error: statsError, refetch: fetchStats } = useStatsDataWithCache();

  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const isAuthenticated = Boolean(user);
  const [loading, setLoading] = useState(true);

  const handleSelect = useCallback(() => {
    router.push('/star/profil/doors');
  }, [router]);

 

 

 

  useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated) {
      setLoading(false);
      return () => { isMounted = false; };
    }

    const fetchUser = async () => {
      try {
        const response = await api.get<User | null>(`/users/me`);
        if (isMounted && response.data) {
          updateUser(response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    void fetchUser();

    return () => { isMounted = false; };
  }, [isAuthenticated, updateUser]);
 

  const isLoading = loading ||   statsLoading;
  const error = statsError  ;

  return {
    fetchStats, handleSelect, loading: isLoading, isPremium: !!user?.premium,
    categories,  highlightCards,   stats, error,
  } as const;
}