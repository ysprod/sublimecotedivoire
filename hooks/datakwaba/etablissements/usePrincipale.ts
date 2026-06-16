import { useCallback, useEffect, useState } from "react";
import { CartoFiltre, Etablissement } from "@/lib/libs/interface";
import { initialCarto } from "@/lib/libs/constants";
import { useRegionsDepartements } from "../useRegionsDepartements";
 

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
    updateCarto({ region: state.selectedRegionLabel, departement: state.selectedDepartementLabel,
      tpsglobal: 0
     });
  }, [state.selectedRegionLabel, state.selectedDepartementLabel, updateCarto]);

  return {
    ...state, loading, errorMessage, regionsData, departementData, regions, regionOptions, carto,
    updateCarto, ...getDepartementsForRegion(carto.regionId || ''),
    setshouldShowDataNavigation: (value: boolean) => setState(prev => ({ ...prev, shouldShowDataNavigation: value })),
    setShowfiltreconsulter: (value: boolean) => setState(prev => ({ ...prev, showfiltreconsulter: value })),
  };
}
