import { initialCarto } from "@/lib/libs/constants";
import { getRandomCount, valeurEntier } from "@/lib/libs/functions";
import { AllTrends, EtablissementType, MenuItem, PeriodType } from "@/lib/libs/interface";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useSubMenuData } from "../../commons/useSubMenuData";

const ICONS = {
  CLIENTS: "/icons/lesclients.png",
  HOTELS: "/icons/hotel.png",
  RESIDENCES: "/icons/residence.png",
  MAISONS: "/icons/maisondhote.png",
} as const;

const generateAllTrends = (baseValue: number): AllTrends => {
  const periods = ['day', 'week', 'month', 'year'] as const;
  const periodFactors = {
    day: { min: -15, max: 15, threshold: 3 },
    week: { min: -25, max: 25, threshold: 5 },
    month: { min: -40, max: 40, threshold: 8 },
    year: { min: -60, max: 60, threshold: 10 }
  };
  const periodLabels = {
    day: 'hier',
    week: 'la semaine dernière',
    month: 'le mois dernier',
    year: 'l\'année dernière'
  };

  const result = {} as AllTrends;

  for (const period of periods) {
    const factor = periodFactors[period];
    const variation = (Math.sin(baseValue * 0.1 + Math.random() * 0.5) * factor.max * 0.5) +
      (Math.random() * (factor.max - factor.min) + factor.min);
    const roundedVariation = Math.round(variation * 10) / 10;

    let direction: 'croissance' | 'baisse' | 'stable';
    let label: string;

    if (roundedVariation > factor.threshold) {
      direction = 'croissance';
      label = `+${roundedVariation}% par rapport à ${periodLabels[period]}`;
    } else if (roundedVariation < -factor.threshold) {
      direction = 'baisse';
      label = `${roundedVariation}% par rapport à ${periodLabels[period]}`;
    } else {
      direction = 'stable';
      label = `stable par rapport à ${periodLabels[period]}`;
    }

    result[period] = {
      direction,
      value: Math.abs(roundedVariation),
      label
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

  const hotelsClients = Math.round(totalClients * 0.45);
  const previousHotelsClients = Math.round(previousTotalClients * 0.45);
  const residencesClients = Math.round(totalClients * 0.30);
  const previousResidencesClients = Math.round(previousTotalClients * 0.30);
  const maisonsClients = Math.round(totalClients * 0.25);
  const previousMaisonsClients = Math.round(previousTotalClients * 0.25);

  return {
    totalClients,
    previousTotalClients,
    hommesCount,
    previousHommesCount,
    femmesCount,
    previousFemmesCount,
    hotelsClients,
    previousHotelsClients,
    residencesClients,
    previousResidencesClients,
    maisonsClients,
    previousMaisonsClients,
  };
};

const useMenuData = () => {
  const menuData = useMemo(() => {
    const stats = generateStats();

    return {
      MAIN_MENU_ITEMS: [
        {
          ...createMenuItem("CLIENTS", stats.totalClients, ICONS.CLIENTS, 1, ICONS.CLIENTS),
        },
        {
          ...createMenuItem("HÔTELS", stats.hotelsClients, ICONS.HOTELS, 2, ICONS.HOTELS),
        },
        {
          ...createMenuItem("RÉSIDENCES", stats.residencesClients, ICONS.RESIDENCES, 3, ICONS.RESIDENCES),
        },
        {
          ...createMenuItem("MAISONS D'HÔTES", stats.maisonsClients, ICONS.MAISONS, 4, ICONS.MAISONS),
        },
      ]
    };
  }, []);

  return { mainmenutitems: menuData };
};

const PERIOD_MULTIPLIERS: Record<PeriodType, number> = {
  all: 1,
  week: 0.25,
  month: 0.5,
  year: 0.8,
};

// ============ HOOK PRINCIPAL ============
export function usePrincipale() {
  const router = useRouter();
  const { mainmenutitems } = useMenuData();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [activePeriod, setActivePeriod] = useState<PeriodType>('all');
  const [activeType, setActiveType] = useState<EtablissementType>(null);

  const handleClick = useCallback((item: MenuItem) => {
    setSelectedMenuItem(item);
    const routeMap: Record<number, string> = {
      2: '/consulter/hotels',
      3: '/consulter/residences',
      4: '/consulter/hotes',
    };
    const basePath = routeMap[item.tpsglobal ?? 0] || '/consulter';
    router.push(`${basePath}?tpsglobal=${item.tpsglobal}`);
  }, [router]);

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const tpsglobal = useMemo(() => valeurEntier(initialCarto.tpsglobal), []);

  const mymainMenuItem = useMemo(() => (
    mainmenutitems.MAIN_MENU_ITEMS.find(item => item.tpsglobal === initialCarto.tpsglobal) ?? mainmenutitems.MAIN_MENU_ITEMS[0]
  ), [mainmenutitems]);

  const { submenutitems } = useSubMenuData(mymainMenuItem?.nbetablissements || 0);

  const mainMenuItem = useMemo(() => {
    if (!mymainMenuItem || !submenutitems.length) return null;
    const total = submenutitems.reduce((sum, item) => sum + (item.nbetablissements || 0), 0);
    const textPart = mymainMenuItem.title?.replace(/^\d+\s/, '') || '';

    return { ...mymainMenuItem, nbetablissements: total, title: `${total} ${textPart}` };
  }, [mymainMenuItem, submenutitems]);

  const periodMultiplier = PERIOD_MULTIPLIERS[activePeriod];

  const typeItems = useMemo(() => {
    return submenutitems.filter(item =>
      item.title?.includes('HÔTELS') ||
      item.title?.includes('RÉSIDENCES') ||
      item.title?.includes('MAISONS')
    );
  }, [submenutitems]);

  const filteredTypeItems = useMemo(() => {
    if (!activeType) return typeItems;

    const typeMap = {
      hotels: 'HÔTELS',
      residences: 'RÉSIDENCES',
      maisons: 'MAISONS'
    };

    return typeItems.filter(item =>
      item.title?.includes(typeMap[activeType])
    );
  }, [typeItems, activeType]);

  return {
    handleClick, setActivePeriod, handleBack, activeType,
    periodMultiplier, submenutitems, tpsglobal, mainMenuItem, filteredTypeItems, activePeriod,
  };
}