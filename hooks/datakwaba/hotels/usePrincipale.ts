'use client';
import { AdaptedIndicators, MenuItem, PeriodType } from "@/lib/libs/interface";
import { generateAllTrends } from "@/lib/libs/trends";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";

const ICONS = {
  ETABLISSEMENTS: "/icons/batiment.png",
  HOTELS: "/icons/hotel.png",
  RESIDENCES: "/icons/residence.png",
  MAISONS: "/icons/maisondhote.png",
} as const;

const ETABLISSEMENT_TYPES = [
  {
    type: "HÔTELS",
    icon: ICONS.HOTELS,
    blackicon: "/icons/hotel-black.png",
    tpsglobal: 200,
    minRatio: 0.6,
    maxRatio: 0.7
  },
  {
    type: "RÉSIDENCES",
    icon: ICONS.RESIDENCES,
    blackicon: "/icons/residence-black.png",
    tpsglobal: 100,
    minRatio: 0.2,
    maxRatio: 0.3
  },
  {
    type: "MAISONS D'HÔTES",
    icon: ICONS.MAISONS,
    blackicon: "/icons/maisondhote-black.png",
    tpsglobal: 46,
    minRatio: 0.05,
    maxRatio: 0.15
  }
] as const;

const PERIOD_MULTIPLIERS: Record<PeriodType, number> = {
  all: 1,
  week: 0.25,
  month: 0.5,
  year: 0.8,
};

const DEFAULT_ITEM_COUNT = 10000;

const createMenuItem = (
  baseTitle: string,
  count: number,
  icon: string,
  tpsglobal: number,
  blackicon?: string
): MenuItem => ({
  nbetablissements: count,
  title: `${count} ${baseTitle}`,
  icon,
  tpsglobal,
  blackicon: blackicon || icon,
  id: baseTitle.toLowerCase().replace(/\s/g, '_'),
  count,
  trendValue: 0,
  iconSrc: icon,
  iconAlt: `Icône ${baseTitle}`,
  color: "text-black",
  bgColor: "bg-white",
  description: baseTitle
});

const createSubMenuItem = (
  type: string,
  count: number,
  icon: string,
  tpsglobal: number,
  blackicon: string
): MenuItem => ({
  ...createMenuItem(type, count, icon, tpsglobal, blackicon),
});

const useSubMenuData = (totalEtablissements: number) => {
  const [subMenuItems, setSubMenuItems] = useState<MenuItem[]>(() =>
    generateSubMenuItems(totalEtablissements)
  );

  const refreshMenuData = useCallback(() => {
    const newItems = generateSubMenuItems(totalEtablissements);
    setSubMenuItems(newItems);
    return newItems;
  }, [totalEtablissements]);

  return { submenutitems: subMenuItems, refreshMenuData };
};

const generateSubMenuItems = (totalEtablissements: number): MenuItem[] => {
  let remaining = totalEtablissements;
  const items: MenuItem[] = [];

  for (let i = 0; i < ETABLISSEMENT_TYPES.length; i++) {
    const config = ETABLISSEMENT_TYPES[i];
    let count: number;

    if (i === ETABLISSEMENT_TYPES.length - 1) {
      count = Math.max(0, remaining);
    } else {
      const ratio = config.minRatio + Math.random() * (config.maxRatio - config.minRatio);
      count = Math.floor(totalEtablissements * ratio);
      remaining = Math.max(0, remaining - count);
    }

    items.push(createSubMenuItem(config.type, count, config.icon, config.tpsglobal, config.blackicon));
  }

  return items;
};

export const useAdaptedIndicators = (
  mainItem: MenuItem | null,
  subItems: MenuItem[],
  activePeriod: PeriodType
): AdaptedIndicators => {
  return useMemo(() => {
    const multiplier = PERIOD_MULTIPLIERS[activePeriod];

    if (!mainItem || !subItems.length) {
      return { mainItem: null, subItems: [] };
    }

    const adaptedSubItems = subItems.map(item => {
      const adaptedCount = Math.round(item.nbetablissements * multiplier);
      const titleParts = item.title?.split(' ') || [];
      const typeLabel = titleParts.slice(1).join(' ');

      return {
        ...item,
        nbetablissements: adaptedCount,
        title: `${adaptedCount} ${typeLabel}`,
        count: adaptedCount,
      };
    });

    const totalSubItemsSum = adaptedSubItems.reduce(
      (sum, item) => sum + (item.nbetablissements || 0),
      0
    );

    const mainTrends = generateAllTrends(totalSubItemsSum);

    const adaptedMainItem: MenuItem = {
      ...mainItem,
      nbetablissements: totalSubItemsSum,
      title: `${totalSubItemsSum} ÉTABLISSEMENTS`,
      count: totalSubItemsSum,
      trends: mainTrends,
      trend: {
        value: mainTrends.week.value,
        direction: mainTrends.week.direction,
        label: mainTrends.week.label
      },
      trendValue: mainTrends.week.value,
    };

    return {
      mainItem: adaptedMainItem,
      subItems: adaptedSubItems,
    };
  }, [activePeriod, mainItem, subItems]);
};

export const usePrincipale = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activePeriod, setActivePeriod] = useState<PeriodType>('all');

  const etablissementItem = useMonEtoileStore((state) => state.etablissementItem);

  const count = etablissementItem?.nbetablissements || DEFAULT_ITEM_COUNT;
  const { submenutitems } = useSubMenuData(count);

  const adaptedIndicators = useAdaptedIndicators(
    etablissementItem || null,
    submenutitems,
    activePeriod
  );

  const handleRapportClick = useCallback(() => {
    router.push('/consulter/hotels/rapport');
  }, [router]);

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleViewHotels = useCallback(() => {
    startTransition(() => {
      router.push("/consulter/hotels/list");
    });
  }, [router]);

  return {
    handleRapportClick, handleBack, setActivePeriod, handleViewHotels,
    isViewHotelsLoading: isPending, adaptedIndicators, activePeriod,
  };
};