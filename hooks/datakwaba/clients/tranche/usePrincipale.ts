import { useCallback, useEffect, useMemo, useState } from "react";
import { CartoFiltre, Etablissement, MenuItem, AllTrends } from "@/lib/libs/interface";
import { initialCarto } from "@/lib/libs/constants";
 
import { getRandomCount, valeurEntier } from "@/lib/libs/functions";
 
import { useRouter } from "next/navigation";
import { useRegionsDepartements } from "../../useRegionsDepartements";
import { useSubMenuData } from "../../useSubMenuData";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";

// ============ CONSTANTES ============
const ICONS = {
  CLIENTS: "/icons/lesclients.png",
  HOMMES: "/icons/client.png",
  FEMMES: "/icons/cliente.png",
  NATIONAUX: "/icons/nationaux.png",
  ETRANGERS: "/icons/etranger.png",
  HOTELS: "/icons/hotel.png",
  RESIDENCES: "/icons/residence.png",
  MAISONS: "/icons/maisondhote.png",
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
    trends, // 4 tendances (Jour/Semaine/Mois/Année)
    trend: {
      value: trends.day.value,
      direction: trends.day.direction, // 'croissance' | 'baisse' | 'stable'
      label: trends.day.label
    }
  };
};

// ============ GÉNÉRATION DES STATISTIQUES ============
const generateStats = () => {
  // Total clients
  const hommesCount = getRandomCount(2000, 10000);
  const previousHommesCount = Math.floor(hommesCount * (1 + (Math.random() * 0.2 - 0.1)));
  const femmesCount = getRandomCount(2000, 1000);
  const previousFemmesCount = Math.floor(femmesCount * (1 + (Math.random() * 0.2 - 0.1)));
  const totalClients = hommesCount + femmesCount;
  const previousTotalClients = previousHommesCount + previousFemmesCount;

  // Par Type d'établissement
  const hotelsClients = Math.round(totalClients * 0.45);
  const previousHotelsClients = Math.round(previousTotalClients * 0.45);
  const residencesClients = Math.round(totalClients * 0.30);
  const previousResidencesClients = Math.round(previousTotalClients * 0.30);
  const maisonsClients = Math.round(totalClients * 0.25);
  const previousMaisonsClients = Math.round(previousTotalClients * 0.25);

  // Par Nationalité
  const nationauxCount = Math.round(totalClients * 0.60);
  const previousNationauxCount = Math.round(previousTotalClients * 0.60);
  const etrangersCount = totalClients - nationauxCount;
  const previousEtrangersCount = previousTotalClients - previousNationauxCount;

  // Par Tranches d'âges
  const age18_25 = Math.round(totalClients * 0.20);
  const previousAge18_25 = Math.round(previousTotalClients * 0.20);
  const age26_35 = Math.round(totalClients * 0.30);
  const previousAge26_35 = Math.round(previousTotalClients * 0.30);
  const age36_50 = Math.round(totalClients * 0.25);
  const previousAge36_50 = Math.round(previousTotalClients * 0.25);
  const age50Plus = totalClients - age18_25 - age26_35 - age36_50;
  const previousAge50Plus = previousTotalClients - previousAge18_25 - previousAge26_35 - previousAge36_50;

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
          ...createMenuItem("CLIENTS", stats.totalClients, ICONS.CLIENTS, 1, ICONS.CLIENTS),
        },
        // Par Type d'établissement
        {
          ...createMenuItem("HÔTELS", stats.hotelsClients, ICONS.HOTELS, 2, ICONS.HOTELS),
        },
        {
          ...createMenuItem("RÉSIDENCES", stats.residencesClients, ICONS.RESIDENCES, 3, ICONS.RESIDENCES),
        },
        {
          ...createMenuItem("MAISONS D'HÔTES", stats.maisonsClients, ICONS.MAISONS, 4, ICONS.MAISONS),
        },
        // Par Genre
        {
          ...createMenuItem("HOMMES", stats.hommesCount, ICONS.HOMMES, 5, ICONS.HOMMES),
        },
        {
          ...createMenuItem("FEMMES", stats.femmesCount, ICONS.FEMMES, 6, ICONS.FEMMES),
        },
        // Par Nationalité
        {
          ...createMenuItem("NATIONAUX", stats.nationauxCount, ICONS.NATIONAUX, 7, ICONS.NATIONAUX),
        },
        {
          ...createMenuItem("ETRANGERS", stats.etrangersCount, ICONS.ETRANGERS, 8, ICONS.ETRANGERS),
        },
        // Par Tranches d'âges
        {
          ...createMenuItem("18-25 ANS", stats.age18_25, ICONS.AGE_18_25, 9, ICONS.AGE_18_25),
        },
        {
          ...createMenuItem("26-35 ANS", stats.age26_35, ICONS.AGE_26_35, 10, ICONS.AGE_26_35),
        },
        {
          ...createMenuItem("36-50 ANS", stats.age36_50, ICONS.AGE_36_50, 11, ICONS.AGE_36_50),
        },
        {
          ...createMenuItem("50+ ANS", stats.age50Plus, ICONS.AGE_50_PLUS, 12, ICONS.AGE_50_PLUS),
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
  const router = useRouter();

  const { regionsData, 
    loadRegionsAndDepartements, getDepartementsForRegion } = useRegionsDepartements();

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

  useEffect(() => { loadRegionsAndDepartements(); }, [loadRegionsAndDepartements]);

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
    updateCarto({ region: state.selectedRegionLabel, departement: state.selectedDepartementLabel });
  }, [state.selectedRegionLabel, state.selectedDepartementLabel, updateCarto]);

  const { mainmenutitems } = useMenuData();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

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

  const handleBackClick = useCallback(() => {
    window.history.back();
  }, []);

  const tpsglobal = useMemo(() => valeurEntier(carto.tpsglobal), [carto.tpsglobal]);

  const mymainMenuItem = useMemo(() => (
    mainmenutitems.MAIN_MENU_ITEMS.find(item => item.tpsglobal === carto.tpsglobal) ?? mainmenutitems.MAIN_MENU_ITEMS[0]
  ), [carto.tpsglobal, mainmenutitems]);
  const currentItem = useMonEtoileStore((state) => state.currentItem);
  const { submenutitems } = useSubMenuData(currentItem?.nbetablissements || 0);

  const mainMenuItem = useMemo(() => {
    if (!mymainMenuItem || !submenutitems.length) return null;
    const total = submenutitems.reduce((sum, item) => sum + (item.nbetablissements || 0), 0);
    const textPart = mymainMenuItem.title?.replace(/^\d+\s/, '') || '';

    return { ...mymainMenuItem, nbetablissements: total, title: `${total} ${textPart}` };
  }, [mymainMenuItem, submenutitems]); 

  const typeItems = useMemo(() => {
    return submenutitems.filter(item =>
      item.title?.includes('HÔTELS') ||
      item.title?.includes('RÉSIDENCES') ||
      item.title?.includes('MAISONS')
    );
  }, [submenutitems]);


  return {
    handleBackClick, handleClick,
    submenutitems, tpsglobal, mainMenuItem, typeItems,
  };
}