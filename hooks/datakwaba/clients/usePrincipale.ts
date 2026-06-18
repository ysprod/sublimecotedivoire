import { useCallback, useEffect, useMemo, useState } from "react";
import { CartoFiltre, Etablissement, MenuItem } from "@/lib/libs/interface";
import { initialCarto } from "@/lib/libs/constants";
import { useRegionsDepartements } from "../useRegionsDepartements";
import { getRandomCount, valeurEntier } from "@/lib/libs/functions";
import { useSubMenuData } from "../useSubMenuData";
import { useRouter } from "next/navigation";

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

const useMenuData = () => {
  const menuData = useMemo(() => {
    const hommesCount = getRandomCount(2000, 10000);
    const previousHommesCount = Math.floor(hommesCount * (1 + (Math.random() * 0.2 - 0.1)));

    const femmesCount = getRandomCount(2000, 1000);
    const previousFemmesCount = Math.floor(femmesCount * (1 + (Math.random() * 0.2 - 0.1)));

    const clientsCount = hommesCount + femmesCount;
    const previousClientsCount = previousHommesCount + previousFemmesCount;

    const getTrend = (current: number, previous: number) => {
      if (previous === 0) return { value: 0, direction: 'stable' as const };
      const variation = ((current - previous) / previous) * 100;
      return {
        value: Math.abs(Math.round(variation * 10) / 10),
        direction: variation > 0 ? 'up' as const : variation < 0 ? 'down' as const : 'stable' as const
      };
    };

    return {
      MAIN_MENU_ITEMS: [
        {
          ...createMenuItem("CLIENTS", clientsCount, "/icons/lesclients.png", 1, "/icons/lesclients.png"),
          trend: getTrend(clientsCount, previousClientsCount)
        },
      ]
    };
  }, []);

  return { mainmenutitems: menuData };
};

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

export function usePrincipale() {
  const router = useRouter();

  const { loading, errorMessage, regionsData, departementData, regions, regionOptions,
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
    if (item.tpsglobal === 200) {
      router.push(`/consulter/hotels/?tpsglobal=${item.tpsglobal}`);
      return;
    }
    if (item.tpsglobal === 100) {
      router.push(`/consulter/residences/?tpsglobal=${item.tpsglobal}`);
      return;
    }

    router.push(`/consulter/hotes/?tpsglobal=${item.tpsglobal}`);
  }, []);



  const handleBackClick = useCallback(() => {
    window.history.back();
  }, []);


  const mymainMenuItem = useMemo(() => (
    mainmenutitems.MAIN_MENU_ITEMS.find(item => item.tpsglobal === carto.tpsglobal) ?? mainmenutitems.MAIN_MENU_ITEMS[0]
  ), [carto.tpsglobal, mainmenutitems]);

  const { submenutitems } = useSubMenuData(mymainMenuItem.nbetablissements);



  const mainMenuItem = useMemo(() => {
    if (!mymainMenuItem || !submenutitems.length) return null;
    const total = submenutitems.reduce((sum, item) => sum + (item.nbetablissements || 0), 0);
    const textPart = mymainMenuItem.title?.replace(/^\d+\s/, '') || '';

    return { ...mymainMenuItem, nbetablissements: total, title: `${total} ${textPart}` };
  }, [mymainMenuItem, submenutitems]);

  return {
    ...state, loading, errorMessage, regionsData, departementData, regions, regionOptions, carto,
    updateCarto, ...getDepartementsForRegion(carto.regionId || ''),
    setshouldShowDataNavigation: (value: boolean) => setState(prev => ({ ...prev, shouldShowDataNavigation: value })),
    setShowfiltreconsulter: (value: boolean) => setState(prev => ({ ...prev, showfiltreconsulter: value })),
    mainmenutitems,
    selectedMenuItem,
    setSelectedMenuItem,
    handleBackClick,
    submenutitems,
    mymainMenuItem, mainMenuItem,
    handleClick
  };
}
