import { useCallback, useState } from "react";
import { useCacheData } from "./useCacheData";
import { DepartementDataType, RegionsDataType, Region, Departement, OptionValue } from "@/lib/libs/interface";

interface RegionsDepartementsState {
    loading: boolean;
    errorMessage: string | null;
    regionsData: RegionsDataType;
    departementData: DepartementDataType;
    regions: [string, Region][];
    departements: Departement[];
    regionOptions: OptionValue[];
    departementOptions: OptionValue[];
}

export function useRegionsDepartements() {
    const { cacheData, getCachedData } = useCacheData();
    const [state, setState] = useState<RegionsDepartementsState>({
        loading: false,
        errorMessage: null,
        regionsData: {},
        departementData: {},
        regions: [],
        departements: [],
        regionOptions: [],
        departementOptions: []
    });

    const initializeData = useCallback((regionsData: RegionsDataType, departementData: DepartementDataType) => {
        const regions = Object.entries(regionsData).sort(([, a], [, b]) => a.c.localeCompare(b.c));
        setState(prev => ({
            ...prev, regionsData, departementData, regions,
            regionOptions: regions.map(([id, region]) => ({ value: id, label: region.c || 'Non spécifié' })),
            loading: false
        }));
    }, []);

    const loadRegionsAndDepartements = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, errorMessage: null }));

            const [cachedRegions, cachedDepartements] = await Promise.all([
                getCachedData<RegionsDataType>("regionsData"),
                getCachedData<DepartementDataType>("departementData")
            ]);

            if (cachedRegions && cachedDepartements) {
                initializeData(cachedRegions, cachedDepartements);
                return;
            }

            const response = await fetch('/api/data');
            if (!response.ok) throw new Error(`Erreur API : ${response.statusText}`);

            const { regionsData, departementData } = await response.json();
            initializeData(regionsData, departementData);

            await Promise.all([
                cacheData("regionsData", regionsData),
                cacheData("departementData", departementData)
            ]);
        } catch (error) {
            setState(prev => ({
                ...prev, errorMessage: error instanceof Error ? error.message : "Erreur inconnue",
                loading: false
            }));
        }
    }, [cacheData, getCachedData, initializeData]);

    const getDepartementsForRegion = useCallback((regionId: string) => {
        const departements = regionId
            ? Object.values(state.departementData[regionId] || {})
                .filter((d): d is Departement => !!d?.d && !!d?.a)
            : [];

        return {
            departements,
            departementOptions: departements.map(dep => ({ value: dep.d || '', label: dep.a || 'Non spécifié' }))
        };
    }, [state.departementData]);

    return { ...state, loadRegionsAndDepartements, getDepartementsForRegion };

}