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
 
 
const FLAG_URLS = {
  civ: 'https://flagcdn.com/ci.svg',
  mali: 'https://flagcdn.com/ml.svg',
  senegal: 'https://flagcdn.com/sn.svg',
  guinee: 'https://flagcdn.com/gn.svg',
  autre: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@main/flags/4x3/globe.svg',
};

// Version avec des URLs de flags.io (plus rapide)

const NATIONALITIES = [
  { id: 'civ', label: 'CÔTE D\'IVOIRE', flag: FLAG_URLS.civ, percentage: 0.40 },
  { id: 'mali', label: 'MALI', flag: FLAG_URLS.mali, percentage: 0.15 },
  { id: 'senegal', label: 'SÉNÉGAL', flag: FLAG_URLS.senegal, percentage: 0.12 },
  { id: 'guinee', label: 'GUINÉE', flag: FLAG_URLS.guinee, percentage: 0.10 },
  { id: 'autre', label: 'AUTRE', flag: FLAG_URLS.autre, percentage: 0.23 },
] as const;

const createNationaliteItem = (
  baseTitle: string,
  count: number,
  flagUrl: string,
  tpsglobal: number): MenuItem => {
  const trends = generateAllTrends(count);

  return {
    nbetablissements: count,
    title: `${count} ${baseTitle}`,
    icon: flagUrl, // Utilisation du drapeau
    tpsglobal,
    blackicon: flagUrl, // Utilisation du drapeau
    id: baseTitle.toLowerCase().replace(/\s/g, '_'),
    count,
    trendValue: trends.week.value,
    iconSrc: flagUrl,
    iconAlt: `Drapeau ${baseTitle}`,
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

export const usePrincipale = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentItem = useMonEtoileStore((state) => state.currentItem);

  const tpsglobal = useMemo(() => valeurEntier(initialCarto.tpsglobal), []);

  const nationaliteItems = useMemo(() => {
    if (!currentItem) return [];

    const totalClients = currentItem.nbetablissements || 0;

    return NATIONALITIES.map((nat, index) => {
      const count = Math.round(totalClients * nat.percentage);
      const tpsglobal = 7 + index;
      
      return createNationaliteItem(
        nat.label,
        count,
        nat.flag, // Utilisation du drapeau
        tpsglobal,  
      );
    });
  }, [currentItem]);

  const { submenutitems } = useSubMenuData(currentItem?.nbetablissements || 0);

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
 
  const handleRapportClick = () => {
    router.push('/consulter/clients/nationalite/rapport');
  };
  
  const handleBack = useCallback(() => {
    handleBackClick?.();
  }, [handleBackClick]);

  const periodMultiplier = PERIOD_MULTIPLIERS[activePeriod];

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

  const adaptedNationaliteItems = useMemo(() =>
    nationaliteItems.map(item => ({
      ...item,
      nbetablissements: Math.round(item.nbetablissements * periodMultiplier),
      count: Math.round(item.count * periodMultiplier),
      title: `${Math.round(item.nbetablissements * periodMultiplier)} ${item.title?.replace(/^\d+\s/, '') || ''}`,
    })),
    [nationaliteItems, periodMultiplier]
  );

  return {
    handleBackClick,
    submenutitems,
    tpsglobal,
    mainMenuItem,
    nationaliteItems,
    isPending,
    handleRapportClick,
    handleBack,
    activePeriod,
    setActivePeriod,
    adaptedMainItem,
    adaptedNationaliteItems,
  };
};