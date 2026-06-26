// hooks/datakwaba/hotes/usePrincipale.ts
'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { 
  CartoFiltre, 
  Etablissement, 
  MenuItem, 
  TrendData,
  AllTrends,
  Region,
  Departement,
  RegionsDataType,
  DepartementDataType
} from "@/lib/libs/interface";
import { initialCarto } from "@/lib/libs/constants";
import { useRegionsDepartements } from "../carto/useRegionsDepartements";
import { getRandomCount, valeurEntier } from "@/lib/libs/functions";
import { useSubMenuData } from "../commons/useSubMenuData";

// ============================================================================
// CONSTANTES
// ============================================================================

const ICONS = {
  HOTELS: "/icons/hotel.png",
  CLIENTS: "/icons/lesclients.png",
  HOMMES: "/icons/client.png",
  FEMMES: "/icons/cliente.png",
} as const;

const DEFAULT_COUNT = 10000;

// ============================================================================
// TYPES
// ============================================================================

interface AppState {
  tpsglobal: number;
  startDate: string;
  endDate: string;
  selectedRegionLabel: string;
  selectedDepartementLabel: string;
  shouldShowDataNavigation: boolean;
  etablissements: Etablissement[];
  showfiltreconsulter: boolean;
}

interface StatsData {
  hotelsClients: number;
  previousHotelsClients: number;
  totalClients: number;
  previousTotalClients: number;
  hommesCount: number;
  previousHommesCount: number;
  femmesCount: number;
  previousFemmesCount: number;
}

// ============================================================================
// FONCTIONS DE GÉNÉRATION DE TRENDS
// ============================================================================

const generateTrends = (baseValue: number): AllTrends => {
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

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

const createMenuItem = (
  baseTitle: string,
  count: number,
  icon: string,
  tpsglobal: number,
  blackicon: string,
  trend?: { value: number; direction: 'croissance' | 'baisse' | 'stable' }
): MenuItem => {
  const trends = generateTrends(count);
  
  return {
    id: baseTitle.toLowerCase().replace(/\s/g, '_'),
    title: `${count} ${baseTitle}`,
    count,
    trendValue: trend?.value || 0,
    iconSrc: icon,
    iconAlt: `Icône ${baseTitle}`,
    color: "text-black",
    bgColor: "bg-white",
    description: baseTitle,
    nbetablissements: count,
    icon,
    tpsglobal,
    blackicon,
    trends,
    trend: trend ? {
      value: trend.value,
      direction: trend.direction,
      label: `${trend.value}%`
    } : undefined,
  };
};

const calculateTrend = (current: number, previous: number): { value: number; direction: 'croissance' | 'baisse' | 'stable' } => {
  if (previous === 0) return { value: 0, direction: 'stable' };
  const variation = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(variation * 10) / 10),
    direction: variation > 0 ? 'croissance' : variation < 0 ? 'baisse' : 'stable'
  };
};

const generateStats = (): StatsData => {
  const hotelsClients = getRandomCount(5000, 20000);
  const previousHotelsClients = Math.floor(hotelsClients * (1 + (Math.random() * 0.2 - 0.1)));

  const totalClients = hotelsClients;
  const previousTotalClients = previousHotelsClients;

  const hommesCount = Math.floor(totalClients * getRandomCount(45, 55) / 100);
  const previousHommesCount = Math.floor(previousTotalClients * getRandomCount(45, 55) / 100);
  const femmesCount = totalClients - hommesCount;
  const previousFemmesCount = previousTotalClients - previousHommesCount;

  return {
    hotelsClients,
    previousHotelsClients,
    totalClients,
    previousTotalClients,
    hommesCount,
    previousHommesCount,
    femmesCount,
    previousFemmesCount,
  };
};

// ============================================================================
// HOOK DE DONNÉES DU MENU
// ============================================================================

const useMenuData = () => {
  return useMemo(() => {
    const stats = generateStats();

    return [
      createMenuItem(
        "CLIENTS HÔTELS",
        stats.totalClients,
        ICONS.CLIENTS,
        1,
        ICONS.CLIENTS,
        calculateTrend(stats.totalClients, stats.previousTotalClients)
      ),
      createMenuItem(
        "HOMMES",
        stats.hommesCount,
        ICONS.HOMMES,
        2,
        ICONS.HOMMES,
        calculateTrend(stats.hommesCount, stats.previousHommesCount)
      ),
      createMenuItem(
        "FEMMES",
        stats.femmesCount,
        ICONS.FEMMES,
        3,
        ICONS.FEMMES,
        calculateTrend(stats.femmesCount, stats.previousFemmesCount)
      ),
    ];
  }, []);
};

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function usePrincipale() {
  const {
    loading,
    errorMessage,
    regionsData,
    departementData,
    regions,
    regionOptions,
    loadRegionsAndDepartements,
    getDepartementsForRegion
  } = useRegionsDepartements();

  const [state, setState] = useState<AppState>({
    tpsglobal: 0,
    startDate: '',
    endDate: '',
    selectedRegionLabel: '',
    selectedDepartementLabel: '',
    shouldShowDataNavigation: false,
    etablissements: [],
    showfiltreconsulter: false
  });

  const [carto, setCarto] = useState<CartoFiltre>(initialCarto);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const updateCarto = useCallback((updates: Partial<CartoFiltre>) => {
    setCarto(prev => ({ ...prev, ...updates }));
  }, []);

  const setshouldShowDataNavigation = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, shouldShowDataNavigation: value }));
  }, []);

  const setShowfiltreconsulter = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, showfiltreconsulter: value }));
  }, []);

  const handleBackClick = useCallback(() => {
    window.history.back();
  }, []);

  // ============================================================================
  // EFFETS
  // ============================================================================

  useEffect(() => {
    loadRegionsAndDepartements();
  }, [loadRegionsAndDepartements]);

  useEffect(() => {
    if (!carto.regionId) return;
    const { departements } = getDepartementsForRegion(carto.regionId);
    const selectedDepartement = departements.find((dep: Departement) => dep.d === carto.departementId);

    setState(prev => ({
      ...prev,
      selectedRegionLabel: (regionsData as RegionsDataType)[carto.regionId!]?.c || '',
      selectedDepartementLabel: selectedDepartement?.a || ''
    }));
  }, [carto.regionId, carto.departementId, regionsData, getDepartementsForRegion]);

  useEffect(() => {
    updateCarto({
      region: state.selectedRegionLabel,
      departement: state.selectedDepartementLabel
    });
  }, [state.selectedRegionLabel, state.selectedDepartementLabel, updateCarto]);

  // ============================================================================
  // DONNÉES
  // ============================================================================

  const allMenuItems = useMenuData();

  const mymainMenuItem = useMemo(() => allMenuItems[0] || null, [allMenuItems]);

  const subMenuItems = useMemo(() => allMenuItems.slice(1), [allMenuItems]);

  const { submenutitems } = useSubMenuData(mymainMenuItem?.nbetablissements || DEFAULT_COUNT);

  const mainMenuItem = useMemo(() => {
    if (!mymainMenuItem || !submenutitems.length) return null;
    const total = submenutitems.reduce((sum, item) => sum + (item.nbetablissements || 0), 0);
    return {
      ...mymainMenuItem,
      nbetablissements: total,
      title: `${total} CLIENTS HÔTELS`
    };
  }, [mymainMenuItem, submenutitems]);

  const detailItems = useMemo(() => {
    return submenutitems.filter((item: MenuItem) =>
      item.title?.includes('HOMMES') ||
      item.title?.includes('FEMMES')
    );
  }, [submenutitems]);

  const tpsglobal = useMemo(() => valeurEntier(carto.tpsglobal), [carto.tpsglobal]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // États
    ...state,
    loading,
    errorMessage,
    regionsData: regionsData as RegionsDataType,
    departementData: departementData as DepartementDataType,
    regions,
    regionOptions,
    carto,
    selectedMenuItem,
    tpsglobal,

    // Actions
    updateCarto,
    setshouldShowDataNavigation,
    setShowfiltreconsulter,
    setSelectedMenuItem,
    handleBackClick,

    // Données
    allMenuItems,
    subMenuItems,
    submenutitems,
    mymainMenuItem,
    mainMenuItem,
    detailItems,

    // Utilitaires
    getDepartementsForRegion: getDepartementsForRegion(carto.regionId || ''),
  };
}