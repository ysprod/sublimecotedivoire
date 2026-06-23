// hooks/datakwaba/clients/tranche/usePrincipale.ts
'use client';

import { initialCarto } from "@/lib/libs/constants";
import { valeurEntier } from "@/lib/libs/functions";
import { MenuItem } from "@/lib/libs/interface";
import { generateAllTrends } from "@/lib/libs/trends";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { useSubMenuData } from "../../useSubMenuData";
import { UserRound, Briefcase, Users, UserCog } from "lucide-react";

// ============================================================================
// CONSTANTES
// ============================================================================

const AGE_GROUPS = [
  { id: '18-25', label: '18-25 ANS', icon: UserRound, percentage: 0.20 },
  { id: '26-35', label: '26-35 ANS', icon: Briefcase, percentage: 0.30 },
  { id: '36-50', label: '36-50 ANS', icon: Users, percentage: 0.25 },
  { id: '50+', label: '50+ ANS', icon: UserCog, percentage: 0.25 },
] as const;

// ============================================================================
// CRÉATION DES ITEMS TRANCHE D'ÂGE AVEC TRENDS
// ============================================================================

const createAgeGroupItem = (
  baseTitle: string,
  count: number,
  tpsglobal: number
): MenuItem => {
  const trends = generateAllTrends(count);
  // Trouver l'icône correspondante
  const ageGroup = AGE_GROUPS.find(g => g.label === baseTitle);
  const icon = ageGroup?.icon || UserRound;

  return {
    nbetablissements: count,
    title: `${count} ${baseTitle}`,
    icon: '',
    tpsglobal,
    blackicon: '',
    id: baseTitle.toLowerCase().replace(/\s/g, '_'),
    count,
    trendValue: trends.week.value,
    iconSrc: '',
    iconAlt: `Icône ${baseTitle}`,
    color: "text-black",
    bgColor: "bg-white",
    description: baseTitle,
    trends,
    trend: {
      value: trends.week.value,
      direction: trends.week.direction,
      label: trends.week.label
    }
  };
};

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export const usePrincipale = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ✅ currentItem contient le nombre total de clients
  const currentItem = useMonEtoileStore((state) => state.currentItem);

  const tpsglobal = useMemo(() => valeurEntier(initialCarto.tpsglobal), []);

  // ✅ Génération des items par tranche d'âge à partir du total
  const ageGroupItems = useMemo(() => {
    if (!currentItem) return [];

    const totalClients = currentItem.nbetablissements || 0;

    return AGE_GROUPS.map((ageGroup, index) => {
      const count = Math.round(totalClients * ageGroup.percentage);
      const tpsglobal = 9 + index; // 9, 10, 11, 12
      
      return createAgeGroupItem(
        ageGroup.label,
        count,
        tpsglobal
      );
    });
  }, [currentItem]);

  const { submenutitems } = useSubMenuData(currentItem?.nbetablissements || 0);

  // ✅ Construction du mainMenuItem
  const mainMenuItem = useMemo(() => {
    if (!currentItem) return null;
    
    const total = currentItem.nbetablissements || 0;
    const mainTrends = generateAllTrends(total);

    return {
      ...currentItem,
      nbetablissements: total,
      count: total,
      title: `${total} CLIENTS`,
      trends: mainTrends,
      trend: {
        value: mainTrends.week.value,
        direction: mainTrends.week.direction,
        label: mainTrends.week.label
      },
      trendValue: mainTrends.week.value,
    };
  }, [currentItem]);

  const handleBackClick = useCallback(() => {
    startTransition(() => {
      router.back();
    });
  }, [router]);

  return {
    handleBackClick,
    submenutitems,
    tpsglobal,
    mainMenuItem,
    ageGroupItems,
    isPending,
  };
};