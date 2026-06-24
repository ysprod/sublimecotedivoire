// hooks/datakwaba/clients/type/usePrincipale.ts
'use client';

import { initialCarto } from "@/lib/libs/constants";
import { getRandomCount, valeurEntier } from "@/lib/libs/functions";
import { EtablissementType, MenuItem, PeriodType } from "@/lib/libs/interface";
import { generateAllTrends } from "@/lib/libs/trends";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useSubMenuData } from "../../commons/useSubMenuData";

// ============================================================================
// CONSTANTES
// ============================================================================

const ICONS = {
  CLIENTS: "/icons/lesclients.png",
  HOTELS: "/icons/hotel.png",
  RESIDENCES: "/icons/residence.png",
  MAISONS: "/icons/maisondhote.png",
} as const;

const PERIOD_MULTIPLIERS: Record<PeriodType, number> = {
  all: 1,
  week: 0.25,
  month: 0.5,
  year: 0.8,
};

// ============================================================================
// CRÉATION DES ITEMS AVEC TRENDS
// ============================================================================

const createMenuItemWithTrends = (
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

// ============================================================================
// GÉNÉRATION DES STATISTIQUES
// ============================================================================

const generateStats = () => {
  const hommesCount = getRandomCount(2000, 10000);
  const femmesCount = getRandomCount(2000, 1000);
  const totalClients = hommesCount + femmesCount;

  const hotelsClients = Math.round(totalClients * 0.45);
  const residencesClients = Math.round(totalClients * 0.30);
  const maisonsClients = Math.round(totalClients * 0.25);

  return {
    totalClients,
    hotelsClients,
    residencesClients,
    maisonsClients,
  };
};

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function usePrincipale() {
  const router = useRouter();
  const [activePeriod, setActivePeriod] = useState<PeriodType>('all');
  const [activeType, setActiveType] = useState<EtablissementType>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  // ✅ Génération des données de base avec trends
  const baseMenuItems = useMemo(() => {
    const stats = generateStats();
    return [
      createMenuItemWithTrends("CLIENTS", stats.totalClients, ICONS.CLIENTS, 1, ICONS.CLIENTS),
      createMenuItemWithTrends("HÔTELS", stats.hotelsClients, ICONS.HOTELS, 2, ICONS.HOTELS),
      createMenuItemWithTrends("RÉSIDENCES", stats.residencesClients, ICONS.RESIDENCES, 3, ICONS.RESIDENCES),
      createMenuItemWithTrends("MAISONS D'HÔTES", stats.maisonsClients, ICONS.MAISONS, 4, ICONS.MAISONS),
    ];
  }, []);

  const tpsglobal = useMemo(() => valeurEntier(initialCarto.tpsglobal), []);

  // ✅ Élément principal adapté
  const mymainMenuItem = useMemo(() => {
    return baseMenuItems.find(item => item.tpsglobal === initialCarto.tpsglobal) ?? baseMenuItems[0];
  }, [baseMenuItems]);

  const { submenutitems } = useSubMenuData(mymainMenuItem?.nbetablissements || 0);

  // ✅ Construction du mainMenuItem avec trends
  const mainMenuItem = useMemo(() => {
    if (!mymainMenuItem || !submenutitems.length) return null;
    const total = submenutitems.reduce((sum, item) => sum + (item.nbetablissements || 0), 0);
    const textPart = mymainMenuItem.title?.replace(/^\d+\s/, '') || '';
    const trends = generateAllTrends(total);

    return {
      ...mymainMenuItem,
      nbetablissements: total,
      count: total,
      title: `${total} ${textPart}`,
      trends,
      trend: {
        value: trends.week.value,
        direction: trends.week.direction,
        label: trends.week.label
      },
      trendValue: trends.week.value,
    };
  }, [mymainMenuItem, submenutitems]);

  const periodMultiplier = PERIOD_MULTIPLIERS[activePeriod];

  // ✅ Adaptation du main item avec la période
  const adaptedMainItem = useMemo(() => {
    if (!mainMenuItem) return null;
    const adaptedCount = Math.round(mainMenuItem.nbetablissements * periodMultiplier);
    const trends = generateAllTrends(adaptedCount);

    return {
      ...mainMenuItem,
      nbetablissements: adaptedCount,
      count: adaptedCount,
      title: `${adaptedCount} ÉTABLISSEMENTS`,
      trends,
      trend: {
        value: trends.week.value,
        direction: trends.week.direction,
        label: trends.week.label
      },
      trendValue: trends.week.value,
    };
  }, [mainMenuItem, periodMultiplier]);

  // ✅ Filtrage par type d'établissement
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

  // ✅ Adaptation des items de type avec la période
  const adaptedTypeItems = useMemo(() => {
    return filteredTypeItems.map(item => {
      const adaptedCount = Math.round(item.nbetablissements * periodMultiplier);
      const trends = generateAllTrends(adaptedCount);
      const titleParts = item.title?.split(' ') || [];
      const typeLabel = titleParts.slice(1).join(' ');

      return {
        ...item,
        nbetablissements: adaptedCount,
        count: adaptedCount,
        title: `${adaptedCount} ${typeLabel}`,
        trends,
        trend: {
          value: trends.week.value,
          direction: trends.week.direction,
          label: trends.week.label
        },
        trendValue: trends.week.value,
      };
    });
  }, [filteredTypeItems, periodMultiplier]);

  // ✅ Handlers
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

  const handleRapportClick = () => {
    router.push('/consulter/clients/type/rapport');
  };

  return {
    // États
    activePeriod,
    setActivePeriod,
    activeType,
    setActiveType,
    selectedMenuItem,
    setSelectedMenuItem,
    // Données adaptées
    adaptedMainItem,
    adaptedTypeItems,
    submenutitems,
    // Handlers
    handleClick,
    handleBack,
    handleRapportClick,
    // Utilitaires
    tpsglobal,
    periodMultiplier,
    // Legacy (pour compatibilité)
    mainMenuItem: adaptedMainItem,
    filteredTypeItems: adaptedTypeItems,
  };
}