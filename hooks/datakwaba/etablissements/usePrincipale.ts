import { initialCarto } from "@/lib/libs/constants";
import { getRandomCount, valeurEntier } from "@/lib/libs/functions";
import { CartoFiltre, MenuItem } from "@/lib/libs/interface";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRegionsDepartements } from "../useRegionsDepartements";
import { useSubMenuData } from "../useSubMenuData";

const CATEGORY_KEYWORDS = ['HÔTELS', 'RÉSIDENCES', 'MAISONS'] as const;

const ICONS = {
  ETABLISSEMENTS: "/icons/batiment.png",
  CLIENTS: "/icons/clients.png",
  HOMMES: "/icons/client.png",
  FEMMES: "/icons/cliente.png",
} as const;

const ROUTES = {
  ETABLISSEMENTS: '/consulter/etablissements/etabs',
  HOTELS: '/consulter/hotels',
  RESIDENCES: '/consulter/residences',
  HOTES: '/consulter/hotes',
} as const;

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
  blackicon,
   id: baseTitle.toLowerCase().replace(/\s/g, '_'),
  count,
  trendValue: 0,
  iconSrc: icon,
  iconAlt: `Icône ${baseTitle}`,
  color: "text-black",
  bgColor: "bg-white",
  description: baseTitle
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
  const hotelsCount = getRandomCount(2000, 10000);
  const previousHotelsCount = Math.floor(hotelsCount * (1 + (Math.random() * 0.2 - 0.1)));
  const residencesCount = Math.floor(hotelsCount * getRandomCount(30, 50) / 100);
  const previousResidencesCount = Math.floor(residencesCount * (1 + (Math.random() * 0.2 - 0.1)));
  const maisonsCount = Math.floor(hotelsCount * getRandomCount(10, 20) / 100);
  const previousMaisonsCount = Math.floor(maisonsCount * (1 + (Math.random() * 0.2 - 0.1)));
  const totalEtablissements = hotelsCount + residencesCount + maisonsCount;
  const previousTotalEtablissements = previousHotelsCount + previousResidencesCount + previousMaisonsCount;

  return { totalEtablissements, previousTotalEtablissements, };
};

export const useMenuData = () => {
  const menuData = useMemo(() => {
    const stats = generateStats();

    return {
      MAIN_MENU_ITEMS: [
        {
          ...createMenuItem("ÉTABLISSEMENTS", stats.totalEtablissements, ICONS.ETABLISSEMENTS, 0, ICONS.ETABLISSEMENTS),
          trend: calculateTrend(stats.totalEtablissements, stats.previousTotalEtablissements)
        },
      ]
    };
  }, []);

  return { mainmenutitems: menuData };
};

interface AppState {
  tpsglobal: number;
  selectedRegionLabel: string;
  selectedDepartementLabel: string;
}

export function usePrincipale() {
  const router = useRouter();
  const { mainmenutitems } = useMenuData();
  const { regionsData, loadRegionsAndDepartements, getDepartementsForRegion } = useRegionsDepartements();

  const [state, setState] = useState<AppState>({
    tpsglobal: 0,
    selectedRegionLabel: '',
    selectedDepartementLabel: '',
  });

  const [carto, setCarto] = useState<CartoFiltre>(initialCarto);
  const isInitialized = useRef(false);

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
      departement: state.selectedDepartementLabel,
      tpsglobal: 0
    });
  }, [state.selectedRegionLabel, state.selectedDepartementLabel, updateCarto]);

  useEffect(() => {
    const items = mainmenutitems.MAIN_MENU_ITEMS;
    if (!isInitialized.current && items.length > 0) {
      isInitialized.current = true;
      updateCarto({ tpsglobal: items[0].tpsglobal });
    }
  }, [mainmenutitems.MAIN_MENU_ITEMS, updateCarto]);

  useEffect(() => {
    return () => {
      isInitialized.current = false;
    };
  }, []);

  const tpsglobal = useMemo(() => valeurEntier(carto.tpsglobal), [carto.tpsglobal]);

  const mymainMenuItem = useMemo(() => {
    const items = mainmenutitems.MAIN_MENU_ITEMS;
    return items.find(item => item.tpsglobal === carto.tpsglobal) ?? items[0];
  }, [carto.tpsglobal, mainmenutitems]);

  const { submenutitems } = useSubMenuData(mymainMenuItem?.nbetablissements || 0);

  const mainMenuItem = useMemo(() => {
    if (!mymainMenuItem || !submenutitems.length) return null;
    const total = submenutitems.reduce((sum, item) => sum + (item.nbetablissements || 0), 0);
    const textPart = mymainMenuItem.title?.replace(/^\d+\s/, '') || '';
    return { ...mymainMenuItem, nbetablissements: total, title: `${total} ${textPart}` };
  }, [mymainMenuItem, submenutitems]);

  const hotelItems = useMemo(() => {
    return submenutitems.filter(item =>
      CATEGORY_KEYWORDS.some(keyword => item.title?.includes(keyword))
    );
  }, [submenutitems]);

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleClick = useCallback((item: MenuItem) => {
    const routeMap: Record<number, string> = {
      0: ROUTES.ETABLISSEMENTS,
      200: ROUTES.HOTELS,
      100: ROUTES.RESIDENCES,
    };

    const route = routeMap[item.tpsglobal ?? -1] ?? ROUTES.HOTES;
    router.push(`${route}?tpsglobal=${item.tpsglobal}`);
  }, [router]);

  return {
    hotelItems, tpsglobal, mainMenuItem, handleClick, handleBack,
  };
}