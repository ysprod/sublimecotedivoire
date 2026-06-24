'use client';
import { initialCarto } from "@/lib/libs/constants";
import { valeurEntier } from "@/lib/libs/functions";
import { MenuItem, PeriodType } from "@/lib/libs/interface";
import { generateAllTrends } from "@/lib/libs/trends";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useSubMenuData } from "../../commons/useSubMenuData";


const PERIOD_MULTIPLIERS: Record<PeriodType, number> = {
  all: 1,
  week: 0.25,
  month: 0.5,
  year: 0.8,
};

const ICONS = {
  HOMMES: "/icons/client.png",
  FEMMES: "/icons/cliente.png",
} as const;

const createGenreItem = (
  baseTitle: string,
  count: number,
  icon: string,
  tpsglobal: number,
  blackicon: string
): MenuItem => {
  const trends = generateAllTrends(count);

  return {
    nbetablissements: count,
    title: `${count} ${baseTitle}`,
    icon,
    tpsglobal,
    blackicon,
    id: baseTitle.toLowerCase().replace(/\s/g, '_'),
    count,
    trendValue: trends.week.value,
    iconSrc: icon,
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

export const usePrincipale = () => {
  const router = useRouter();
 // const [isPending, startTransition] = useTransition();
  const currentItem = useMonEtoileStore((state) => state.currentItem);

  const tpsglobal = useMemo(() => valeurEntier(initialCarto.tpsglobal), []);

  const genreItems = useMemo(() => {
    if (!currentItem) return [];

    const totalClients = currentItem.nbetablissements || 0;

    const hommesCount = Math.round(totalClients * 0.55);
    const femmesCount = totalClients - hommesCount;

    return [
      createGenreItem("HOMMES", hommesCount, ICONS.HOMMES, 5, ICONS.HOMMES),
      createGenreItem("FEMMES", femmesCount, ICONS.FEMMES, 6, ICONS.FEMMES),
    ];
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
 
    window.history.back();
   
  }, [ ]);

  const [activePeriod, setActivePeriod] = useState<PeriodType>('all');

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

  const adaptedGenreItems = useMemo(() =>
    genreItems.map(item => ({
      ...item,
      nbetablissements: Math.round(item.nbetablissements * periodMultiplier),
      count: Math.round(item.count * periodMultiplier),
      title: `${Math.round(item.nbetablissements * periodMultiplier)} ${item.title?.replace(/^\d+\s/, '') || ''}`,
    })),
    [genreItems, periodMultiplier]
  );
 
  const handleRapportClick = () => {
    router.push('/consulter/clients/genre/rapport');
  };

  return {
    setActivePeriod, handleBack,handleRapportClick,
    submenutitems, tpsglobal, adaptedMainItem, adaptedGenreItems, activePeriod,
  };
};