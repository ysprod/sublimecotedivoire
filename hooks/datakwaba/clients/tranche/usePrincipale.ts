'use client';
import { initialCarto } from "@/lib/libs/constants";
import { valeurEntier } from "@/lib/libs/functions";
import { MenuItem, PeriodType } from "@/lib/libs/interface";
import { generateAllTrends } from "@/lib/libs/trends";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { useSubMenuData } from "../../commons/useSubMenuData";

const PERIOD_MULTIPLIERS: Record<PeriodType, number> = {
  all: 1,
  week: 0.25,
  month: 0.5,
  year: 0.8,
};

// ✅ Configuration des tranches d'âge avec leurs icônes (images)
const AGE_GROUPS = [
  { 
    id: '18-25', 
    label: '18-25 ANS', 
    icon: '/icons/tranche1.png', // Chemin vers l'image
    percentage: 0.20 
  },
  { 
    id: '26-35', 
    label: '26-35 ANS', 
    icon: '/icons/tranche2.png', 
    percentage: 0.30 
  },
  { 
    id: '36-50', 
    label: '36-50 ANS', 
    icon: '/icons/tranche3.png', 
    percentage: 0.25 
  },
  { 
    id: '50+', 
    label: '50+ ANS', 
    icon: '/icons/tranche4.png', 
    percentage: 0.25 
  },
] as const;

// ✅ Couleurs par tranche d'âge
const AGE_COLORS = {
  '18-25': { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-400' },
  '26-35': { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-400' },
  '36-50': { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-400' },
  '50+': { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-400' },
} as const;

// ✅ Fonction pour obtenir les couleurs
const getAgeColors = (id: string) => {
  return AGE_COLORS[id as keyof typeof AGE_COLORS] || AGE_COLORS['18-25'];
};

const createAgeGroupItem = (
  baseTitle: string,
  count: number,
  tpsglobal: number,
  iconPath: string,
  ageId: string
): MenuItem => {
  const trends = generateAllTrends(count);
  const colors = getAgeColors(ageId);

  return {
    nbetablissements: count,
    title: `${count} ${baseTitle}`,
    icon: iconPath, // Chemin vers l'image
    tpsglobal,
    blackicon: iconPath,
    id: baseTitle.toLowerCase().replace(/\s/g, '_'),
    count,
    trendValue: trends.week.value,
    iconSrc: iconPath, // Chemin vers l'image
    iconAlt: `Icône ${baseTitle}`,
    color: colors.text,
    bgColor: colors.bg,
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
        tpsglobal,
        ageGroup.icon, // ✅ Passer le chemin de l'icône
        ageGroup.id // ✅ Passer l'ID pour les couleurs
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

  const [activePeriod, setActivePeriod] = useState<PeriodType>('all');

  const handleBack = useCallback(() => {
    handleBackClick?.();
  }, [handleBackClick]);

  const handleRapportClick = () => {
    router.push('/consulter/clients/age/rapport');
  };

  const periodMultiplier = PERIOD_MULTIPLIERS[activePeriod];

  // ✅ Adaptation des données selon la période
  const adaptedMainItem = useMemo(() => {
    if (!mainMenuItem) return null;
    const adaptedCount = Math.round(mainMenuItem.nbetablissements * periodMultiplier);
    return {
      ...mainMenuItem,
      nbetablissements: adaptedCount,
      count: adaptedCount,
      title: `${adaptedCount} CLIENTS`,
    };
  }, [mainMenuItem, periodMultiplier]);

  const adaptedAgeGroupItems = useMemo(() =>
    ageGroupItems.map(item => ({
      ...item,
      nbetablissements: Math.round(item.nbetablissements * periodMultiplier),
      count: Math.round(item.count * periodMultiplier),
      title: `${Math.round(item.nbetablissements * periodMultiplier)} ${item.title?.replace(/^\d+\s/, '') || ''}`,
    })),
    [ageGroupItems, periodMultiplier]
  );

  return {
    handleBackClick,
    submenutitems,
    tpsglobal,
    mainMenuItem,
    ageGroupItems,
    isPending,
    adaptedMainItem,
    adaptedAgeGroupItems,
    activePeriod,
    setActivePeriod,
    handleBack,
    handleRapportClick
  };
};