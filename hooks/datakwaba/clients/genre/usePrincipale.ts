'use client';
import { initialCarto } from "@/lib/libs/constants";
import { getRandomCount, valeurEntier } from "@/lib/libs/functions";
import { AllTrends, MenuItem } from "@/lib/libs/interface";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useCallback, useMemo } from "react";
import { useSubMenuData } from "../../useSubMenuData";

const ICONS = {
  CLIENTS: "/icons/lesclients.png",
  HOMMES: "/icons/client.png",
  FEMMES: "/icons/cliente.png",
} as const;

const PERIOD_FACTORS = {
  day: { min: -15, max: 15, threshold: 3 },
  week: { min: -25, max: 25, threshold: 5 },
  month: { min: -40, max: 40, threshold: 8 },
  year: { min: -60, max: 60, threshold: 10 }
} as const;

const PERIOD_LABELS = {
  day: 'hier',
  week: 'la semaine dernière',
  month: 'le mois dernier',
  year: 'l\'année dernière'
} as const;


const CATEGORY_FILTERS = {
  genre: ['HOMMES', 'FEMMES'],
} as const;

const generateAllTrends = (baseValue: number): AllTrends => {
  const periods = ['day', 'week', 'month', 'year'] as const;
  const result = {} as AllTrends;

  for (const period of periods) {
    const factor = PERIOD_FACTORS[period];
    const variation = (Math.sin(baseValue * 0.1 + Math.random() * 0.5) * factor.max * 0.5) +
      (Math.random() * (factor.max - factor.min) + factor.min);
    const roundedVariation = Math.round(variation * 10) / 10;

    let direction: 'croissance' | 'baisse' | 'stable';
    if (roundedVariation > factor.threshold) {
      direction = 'croissance';
    } else if (roundedVariation < -factor.threshold) {
      direction = 'baisse';
    } else {
      direction = 'stable';
    }

    result[period] = {
      direction,
      value: Math.abs(roundedVariation),
      label: direction === 'stable'
        ? `stable par rapport à ${PERIOD_LABELS[period]}`
        : `${direction === 'croissance' ? '+' : ''}${roundedVariation}% par rapport à ${PERIOD_LABELS[period]}`
    };
  }

  return result;
};

const createMenuItem = (
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
    trendValue: 0,
    iconSrc: icon,
    iconAlt: `Icône ${baseTitle}`,
    color: "text-black",
    bgColor: "bg-white",
    description: baseTitle,
    trends,
    trend: {
      value: trends.day.value,
      direction: trends.day.direction,
      label: trends.day.label
    }
  };
};

const generateStats = () => {
  const hommesCount = getRandomCount(2000, 10000);
  const previousHommesCount = Math.floor(hommesCount * (1 + (Math.random() * 0.2 - 0.1)));
  const femmesCount = getRandomCount(2000, 1000);
  const previousFemmesCount = Math.floor(femmesCount * (1 + (Math.random() * 0.2 - 0.1)));
  const totalClients = hommesCount + femmesCount;
  const previousTotalClients = previousHommesCount + previousFemmesCount;

  return {
    totalClients, previousTotalClients,
    hommesCount, previousHommesCount,
    femmesCount, previousFemmesCount,
  };
};

const useMenuData = () => {
  return useMemo(() => {
    const stats = generateStats();
    const items = [
      { title: "CLIENTS", count: stats.totalClients, icon: ICONS.CLIENTS, tpsglobal: 1 },
      { title: "HOMMES", count: stats.hommesCount, icon: ICONS.HOMMES, tpsglobal: 5 },
      { title: "FEMMES", count: stats.femmesCount, icon: ICONS.FEMMES, tpsglobal: 6 },
    ];

    return items.map(({ title, count, icon, tpsglobal }) =>
      createMenuItem(title, count, icon, tpsglobal, icon)
    );
  }, []);
}; 

export function usePrincipale() {
  const currentItem = useMonEtoileStore((state) => state.currentItem);
  const mainMenuItems = useMenuData();

  const tpsglobal = useMemo(() => valeurEntier(initialCarto.tpsglobal), []);

  const mymainMenuItem = useMemo(() => {
    return mainMenuItems.find(item => item.tpsglobal === initialCarto.tpsglobal)
      ?? mainMenuItems[0];
  }, [mainMenuItems]);

  // ✅ Récupération des sous-menus avec les données des hommes et femmes
  const { submenutitems } = useSubMenuData(currentItem?.nbetablissements || 0);

  // ✅ Construction du mainMenuItem avec les données agrégées
  const mainMenuItem = useMemo(() => {
    if (!mymainMenuItem || !submenutitems.length) return null;
    const total = submenutitems.reduce((sum, item) => sum + (item.nbetablissements || 0), 0);
    const textPart = mymainMenuItem.title?.replace(/^\d+\s/, '') || '';
    return { ...mymainMenuItem, nbetablissements: total, title: `${total} ${textPart}` };
  }, [mymainMenuItem, submenutitems]);

   const filterByTitle = useCallback((keywords: readonly string[]) => {
    return submenutitems.filter(item =>
      keywords.some(keyword => item.title?.includes(keyword))
    );
  }, [submenutitems]);

   const genreItems = useMemo(() => filterByTitle(CATEGORY_FILTERS.genre), [filterByTitle]);

  const handleBackClick = useCallback(() => {
    window.history.back();
  }, []);

  return {
    handleBackClick, submenutitems, tpsglobal, mainMenuItem, genreItems,
  };
}