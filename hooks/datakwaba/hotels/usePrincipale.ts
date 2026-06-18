import { useCallback, useEffect, useMemo, useState } from "react";
import { CartoFiltre, Etablissement, MenuItem } from "@/lib/libs/interface";
import { initialCarto } from "@/lib/libs/constants";
import { useRegionsDepartements } from "../useRegionsDepartements";
import { getRandomCount, valeurEntier } from "@/lib/libs/functions";
import { useSubMenuData } from "../useSubMenuData";

// ============ CONSTANTES ============
const ICONS = {
  HOTELS: "/icons/hotel.png",
  CLIENTS: "/icons/lesclients.png",
  HOMMES: "/icons/client.png",
  FEMMES: "/icons/cliente.png",
} as const;

// ============ FONCTIONS UTILITAIRES ============
const createMenuItem = (
  baseTitle: string,
  count: number,
  icon: string,
  tpsglobal: number,
  blackicon: string
): MenuItem => ({
  nbetablissements: count,
  title: `${count} ${baseTitle}`,
  icon,
  tpsglobal,
  blackicon
});

const calculateTrend = (current: number, previous: number) => {
  if (previous === 0) return { value: 0, direction: 'stable' as const };
  const variation = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(variation * 10) / 10),
    direction: variation > 0 ? 'up' as const : variation < 0 ? 'down' as const : 'stable' as const
  };
};

const generateStats = () => {
  // Total des clients dans les hôtels
  const hotelsClients = getRandomCount(5000, 20000);
  const previousHotelsClients = Math.floor(hotelsClients * (1 + (Math.random() * 0.2 - 0.1)));
  
  const totalClients = hotelsClients;
  const previousTotalClients = previousHotelsClients;

  // Répartition par genre
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

// ============ HOOK MENU DATA ============
const useMenuData = () => {
  const menuData = useMemo(() => {
    const stats = generateStats();

    return {
      MAIN_MENU_ITEMS: [
        // Total des clients dans les hôtels (indicateur principal)
        {
          ...createMenuItem("CLIENTS HÔTELS", stats.totalClients, ICONS.CLIENTS, 1, ICONS.CLIENTS),
          trend: calculateTrend(stats.totalClients, stats.previousTotalClients)
        },
        // Détail : Clients hommes
        {
          ...createMenuItem("HOMMES", stats.hommesCount, ICONS.HOMMES, 2, ICONS.HOMMES),
          trend: calculateTrend(stats.hommesCount, stats.previousHommesCount)
        },
        // Détail : Clients femmes
        {
          ...createMenuItem("FEMMES", stats.femmesCount, ICONS.FEMMES, 3, ICONS.FEMMES),
          trend: calculateTrend(stats.femmesCount, stats.previousFemmesCount)
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

  // Chargement des régions/départements
  useEffect(() => {
    loadRegionsAndDepartements();
  }, [loadRegionsAndDepartements]);

  // Mise à jour des labels
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

  // Synchronisation carto
  useEffect(() => {
    updateCarto({
      region: state.selectedRegionLabel,
      departement: state.selectedDepartementLabel
    });
  }, [state.selectedRegionLabel, state.selectedDepartementLabel, updateCarto]);

  // Données du menu
  const { mainmenutitems } = useMenuData();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  // Gestion du retour
  const handleBackClick = useCallback(() => {
    window.history.back();
  }, []);

  // Tpsglobal
  const tpsglobal = useMemo(() => valeurEntier(carto.tpsglobal), [carto.tpsglobal]);

  // Récupération de tous les items du menu
  const allMenuItems = useMemo(() => {
    return mainmenutitems.MAIN_MENU_ITEMS || [];
  }, [mainmenutitems]);

  // Item principal : Total des clients dans les hôtels (premier item)
  const mymainMenuItem = useMemo(() => {
    return allMenuItems[0] || null;
  }, [allMenuItems]);

  // Sous-items : Hommes, Femmes, 
  const subMenuItems = useMemo(() => {
    return allMenuItems.slice(1);
  }, [allMenuItems]);

  // Utilisation de useSubMenuData avec le nombre de clients total
  const { submenutitems } = useSubMenuData(mymainMenuItem?.nbetablissements || 10000);

  // Item principal enrichi avec le total des sous-items
  const mainMenuItem = useMemo(() => {
    if (!mymainMenuItem || !submenutitems.length) return null;
    const total = submenutitems.reduce((sum, item) => sum + (item.nbetablissements || 0), 0);
    const textPart = "CLIENTS HÔTELS";

    return {
      ...mymainMenuItem,
      nbetablissements: total,
      title: `${total} ${textPart}`
    };
  }, [mymainMenuItem, submenutitems]);

  // Filtrage des items pour l'affichage (Hommes, Femmes, 
  const detailItems = useMemo(() => {
    return submenutitems.filter(item =>
      item.title?.includes('HOMMES') ||
      item.title?.includes('FEMMES')  
    );
  }, [submenutitems]);

  return {
    ...state,
    loading,
    errorMessage,
    regionsData,
    departementData,
    regions,
    regionOptions,
    carto,

    // Actions
    updateCarto,
    getDepartementsForRegion: getDepartementsForRegion(carto.regionId || ''),
    setshouldShowDataNavigation: (value: boolean) =>
      setState(prev => ({ ...prev, shouldShowDataNavigation: value })),
    setShowfiltreconsulter: (value: boolean) =>
      setState(prev => ({ ...prev, showfiltreconsulter: value })),

    // Données
    mainmenutitems,
    selectedMenuItem,
    setSelectedMenuItem,
    handleBackClick,
    submenutitems,
    mymainMenuItem,
    mainMenuItem,
    detailItems,
    tpsglobal,
    allMenuItems,
    subMenuItems
  };
}