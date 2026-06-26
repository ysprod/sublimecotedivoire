import { useCallback, useEffect, useState } from "react";
import { CartoFiltre } from "@/lib/libs/interface";
import { initialCarto } from "@/lib/libs/constants";
import { useRegionsDepartements } from "../carto/useRegionsDepartements";

interface AppState {
  tpsglobal: number;
  startDate: string;
  endDate: string;
  selectedRegionLabel: string;
  selectedDepartementLabel: string;
}

export function useEtablissements() {
  const { loading, errorMessage, regionsData, departementData, regions, regionOptions,
    loadRegionsAndDepartements, getDepartementsForRegion } = useRegionsDepartements();

  const [state, setState] = useState<AppState>({
    tpsglobal: 0,
    startDate: '',
    endDate: '',
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
    updateCarto({ region: state.selectedRegionLabel, departement: state.selectedDepartementLabel });
  }, [state.selectedRegionLabel, state.selectedDepartementLabel, updateCarto]);

  return {
    ...state, loading, errorMessage, regionsData, departementData, regions, regionOptions, carto,
    updateCarto, ...getDepartementsForRegion(carto.regionId || ''),
  };
}