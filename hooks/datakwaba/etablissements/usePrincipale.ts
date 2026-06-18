import { initialCarto } from "@/lib/libs/constants";
import { getRandomCount, valeurEntier } from "@/lib/libs/functions";
import { CartoFiltre, MenuItem } from "@/lib/libs/interface";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRegionsDepartements } from "../useRegionsDepartements";
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

export const useMenuData = () => {
  const menuData = useMemo(() => {
    const hotelsCount = getRandomCount(2000, 10000);
    const previousHotelsCount = Math.floor(hotelsCount * (1 + (Math.random() * 0.2 - 0.1)));

    const residencesCount = Math.floor(hotelsCount * getRandomCount(30, 50) / 100);
    const previousResidencesCount = Math.floor(residencesCount * (1 + (Math.random() * 0.2 - 0.1)));

    const maisonsCount = Math.floor(hotelsCount * getRandomCount(10, 20) / 100);
    const previousMaisonsCount = Math.floor(maisonsCount * (1 + (Math.random() * 0.2 - 0.1)));

    const totalEtablissements = hotelsCount + residencesCount + maisonsCount;
    const previousTotalEtablissements = previousHotelsCount + previousResidencesCount + previousMaisonsCount;

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
          ...createMenuItem("ÉTABLISSEMENTS", totalEtablissements, "/icons/batiment.png", 0, "/icons/batiment.png"),
          trend: getTrend(totalEtablissements, previousTotalEtablissements)
        },
        {
          ...createMenuItem("CLIENTS", clientsCount, "/icons/clients.png", 1, "/icons/clients.png"),
          trend: getTrend(clientsCount, previousClientsCount)
        },
        {
          ...createMenuItem("HOMMES", hommesCount, "/icons/client.png", 2, "/icons/client.png"),
          trend: getTrend(hommesCount, previousHommesCount)
        },
        {
          ...createMenuItem("FEMMES", femmesCount, "/icons/cliente.png", 3, "/icons/cliente.png"),
          trend: getTrend(femmesCount, previousFemmesCount)
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
    updateCarto({
      region: state.selectedRegionLabel, departement: state.selectedDepartementLabel,
      tpsglobal: 0
    });
  }, [state.selectedRegionLabel, state.selectedDepartementLabel, updateCarto]);


  const isInitialized = useRef(false);

  const handleBackClick = useCallback(() => {
    window.history.back();
  }, []);

  useEffect(() => {
    if (!isInitialized.current && mainmenutitems.MAIN_MENU_ITEMS.length > 0) {
      isInitialized.current = true;
      const firstItem = mainmenutitems.MAIN_MENU_ITEMS[0];
      updateCarto({ tpsglobal: firstItem.tpsglobal });
    }
  }, [mainmenutitems.MAIN_MENU_ITEMS, updateCarto]);

  useEffect(() => {
    return () => {
      isInitialized.current = false;
    };
  }, []);

  const tpsglobal = useMemo(() => valeurEntier(carto.tpsglobal), [carto.tpsglobal]);

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

  
  const handleClick = useCallback((item: MenuItem) => {

 
    if (item.tpsglobal === 200) {
      router.push(`/consulter/hotels/?tpsglobal=${item.tpsglobal}`);
      return;
    }
    if (item.tpsglobal === 100) {
      router.push(`/consulter/residences/?tpsglobal=${item.tpsglobal}`);
      return;
    }

    router.push(`/consulter/hotes/?tpsglobal=${item.tpsglobal}`);
  }, [router]);


  return { handleBackClick, tpsglobal, submenutitems, mainMenuItem,handleClick };
}