import { useCallback, useEffect, useMemo, useState } from "react";
import { CartoFiltre, Etablissement, MenuItem, AllTrends } from "@/lib/libs/interface";
import { initialCarto } from "@/lib/libs/constants";
import { useRegionsDepartements } from "../carto/useRegionsDepartements";
import { getRandomCount, valeurEntier } from "@/lib/libs/functions";
import { useSubMenuData } from "../commons/useSubMenuData";

// ============ CONSTANTES ============
const ICONS = {
  HOTELS: "/icons/hotel.png",
  CLIENTS: "/icons/lesclients.png",
  HOMMES: "/icons/client.png",
  FEMMES: "/icons/cliente.png",
  NATIONAUX: "/icons/nationaux.png",
  ETRANGERS: "/icons/etranger.png",
  AGE_18_25: "/icons/age18-25.png",
  AGE_26_35: "/icons/age26-35.png",
  AGE_36_50: "/icons/age36-50.png",
  AGE_50_PLUS: "/icons/age50plus.png",
} as const;

// ============ FONCTIONS DE GÉNÉRATION DE TENDANCES ============
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

// ============ FONCTIONS UTILITAIRES ============
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
    trends, // Ajout des 4 tendances
    trend: {
      value: trends.day.value,
      direction: trends.day.direction,
      label: trends.day.label
    }
  };
};

// ============ GÉNÉRATION DES STATISTIQUES ============
const generateStats = () => {
  const hotelsClients = getRandomCount(5000, 20000);
  const previousHotelsClients = Math.floor(hotelsClients * (1 + (Math.random() * 0.2 - 0.1)));
  
  const totalClients = hotelsClients;
  const previousTotalClients = previousHotelsClients;

  // Par Genre
  const hommesCount = Math.floor(totalClients * getRandomCount(45, 55) / 100);
  const previousHommesCount = Math.floor(previousTotalClients * getRandomCount(45, 55) / 100);
  const femmesCount = totalClients - hommesCount;
  const previousFemmesCount = previousTotalClients - previousHommesCount;

  // Par Nationalité
  const nationauxCount = Math.round(totalClients * getRandomCount(30, 70) / 100);
  const previousNationauxCount = Math.round(previousTotalClients * getRandomCount(30, 70) / 100);
  const etrangersCount = totalClients - nationauxCount;
  const previousEtrangersCount = previousTotalClients - previousNationauxCount;

  // Par Tranches d'âges
  const age18_25 = Math.round(totalClients * getRandomCount(15, 25) / 100);
  const previousAge18_25 = Math.round(previousTotalClients * getRandomCount(15, 25) / 100);
  const age26_35 = Math.round(totalClients * getRandomCount(25, 35) / 100);
  const previousAge26_35 = Math.round(previousTotalClients * getRandomCount(25, 35) / 100);
  const age36_50 = Math.round(totalClients * getRandomCount(20, 30) / 100);
  const previousAge36_50 = Math.round(previousTotalClients * getRandomCount(20, 30) / 100);
  const age50Plus = totalClients - age18_25 - age26_35 - age36_50;
  const previousAge50Plus = previousTotalClients - previousAge18_25 - previousAge26_35 - previousAge36_50;

  return {
    hotelsClients,
    previousHotelsClients,
    totalClients,
    previousTotalClients,
    hommesCount,
    previousHommesCount,
    femmesCount,
    previousFemmesCount,
    nationauxCount,
    previousNationauxCount,
    etrangersCount,
    previousEtrangersCount,
    age18_25,
    previousAge18_25,
    age26_35,
    previousAge26_35,
    age36_50,
    previousAge36_50,
    age50Plus,
    previousAge50Plus,
  };
};

// ============ HOOK MENU DATA ============
const useMenuData = () => {
  const menuData = useMemo(() => {
    const stats = generateStats();

    return {
      MAIN_MENU_ITEMS: [
        // Total clients
        {
          ...createMenuItem("CLIENTS RÉSIDENCES", stats.totalClients, ICONS.CLIENTS, 1, ICONS.CLIENTS),
        },
        // Par Type d'établissement
        {
          ...createMenuItem("HÔTELS", stats.hotelsClients, ICONS.HOTELS, 2, ICONS.HOTELS),
        },
        // Par Genre
        {
          ...createMenuItem("HOMMES", stats.hommesCount, ICONS.HOMMES, 3, ICONS.HOMMES),
        },
        {
          ...createMenuItem("FEMMES", stats.femmesCount, ICONS.FEMMES, 4, ICONS.FEMMES),
        },
        // Par Nationalité
        {
          ...createMenuItem("NATIONAUX", stats.nationauxCount, ICONS.NATIONAUX, 5, ICONS.NATIONAUX),
        },
        {
          ...createMenuItem("ETRANGERS", stats.etrangersCount, ICONS.ETRANGERS, 6, ICONS.ETRANGERS),
        },
        // Par Tranches d'âges
        {
          ...createMenuItem("18-25 ANS", stats.age18_25, ICONS.AGE_18_25, 7, ICONS.AGE_18_25),
        },
        {
          ...createMenuItem("26-35 ANS", stats.age26_35, ICONS.AGE_26_35, 8, ICONS.AGE_26_35),
        },
        {
          ...createMenuItem("36-50 ANS", stats.age36_50, ICONS.AGE_36_50, 9, ICONS.AGE_36_50),
        },
        {
          ...createMenuItem("50+ ANS", stats.age50Plus, ICONS.AGE_50_PLUS, 10, ICONS.AGE_50_PLUS),
        },
      ]
    };
  }, []);

  return { mainmenutitems: menuData };
};

// ============ TYPES ============
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

// ============ HOOK PRINCIPAL ============
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

  const updateCarto = useCallback((updates: Partial<CartoFiltre>) => {
    setCarto(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    loadRegionsAndDepartements();
  }, [loadRegionsAndDepartements]);

  useEffect(() => {
    if (!carto.regionId) return;
    const { departements } = getDepartementsForRegion(carto.regionId);
    const selectedDepartement = departements.find(dep => dep.d === carto.departementId);

    setState(prev => ({
      ...prev,
      selectedRegionLabel: regionsData[carto.regionId!]?.c || '',
      selectedDepartementLabel: selectedDepartement?.a || ''
    }));
  }, [carto.regionId, carto.departementId, regionsData, getDepartementsForRegion]);

  useEffect(() => {
    updateCarto({
      region: state.selectedRegionLabel,
      departement: state.selectedDepartementLabel
    });
  }, [state.selectedRegionLabel, state.selectedDepartementLabel, updateCarto]);

  const { mainmenutitems } = useMenuData();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  const handleBackClick = useCallback(() => {
    window.history.back();
  }, []);

  const tpsglobal = useMemo(() => valeurEntier(carto.tpsglobal), [carto.tpsglobal]);

  const allMenuItems = useMemo(() => {
    return mainmenutitems.MAIN_MENU_ITEMS || [];
  }, [mainmenutitems]);

  const mymainMenuItem = useMemo(() => {
    return allMenuItems[0] || null;
  }, [allMenuItems]);

  const subMenuItems = useMemo(() => {
    return allMenuItems.slice(1);
  }, [allMenuItems]);

  const { submenutitems } = useSubMenuData(mymainMenuItem?.nbetablissements || 10000);

  const mainMenuItem = useMemo(() => {
    if (!mymainMenuItem || !submenutitems.length) return null;
    const total = submenutitems.reduce((sum, item) => sum + (item.nbetablissements || 0), 0);
    const textPart = "CLIENTS RÉSIDENCES";

    return {
      ...mymainMenuItem,
      nbetablissements: total,
      title: `${total} ${textPart}`
    };
  }, [mymainMenuItem, submenutitems]);

  // Filtrage par catégorie
  const genreItems = useMemo(() => {
    return subMenuItems.filter(item =>
      item.title?.includes('HOMMES') ||
      item.title?.includes('FEMMES')
    );
  }, [subMenuItems]);

  const nationaliteItems = useMemo(() => {
    return subMenuItems.filter(item =>
      item.title?.includes('NATIONAUX') ||
      item.title?.includes('ETRANGERS')
    );
  }, [subMenuItems]);

  const typeItems = useMemo(() => {
    return subMenuItems.filter(item =>
      item.title?.includes('HÔTELS') ||
      item.title?.includes('RÉSIDENCES') ||
      item.title?.includes('MAISONS')
    );
  }, [subMenuItems]);

  const ageItems = useMemo(() => {
    return subMenuItems.filter(item =>
      item.title?.includes('18-25') ||
      item.title?.includes('26-35') ||
      item.title?.includes('36-50') ||
      item.title?.includes('50+')
    );
  }, [subMenuItems]);

  return {
    ...state,
    loading,
    errorMessage,
    regionsData,
    departementData,
    regions,
    regionOptions,
    carto,

    updateCarto,
    getDepartementsForRegion: getDepartementsForRegion(carto.regionId || ''),
    setshouldShowDataNavigation: (value: boolean) =>
      setState(prev => ({ ...prev, shouldShowDataNavigation: value })),
    setShowfiltreconsulter: (value: boolean) =>
      setState(prev => ({ ...prev, showfiltreconsulter: value })),

    mainmenutitems,
    selectedMenuItem,
    setSelectedMenuItem,
    handleBackClick,
    submenutitems,
    mymainMenuItem,
    mainMenuItem,
    tpsglobal,
    allMenuItems,
    subMenuItems,
    // Catégories filtrées
    genreItems,
    nationaliteItems,
    typeItems,
    ageItems,
  };
}