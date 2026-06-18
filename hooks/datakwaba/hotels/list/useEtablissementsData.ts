'use client';
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TAB_ETAB_CONFIG } from "@/lib/libs/constants";
import { fetchData } from "@/lib/libs/functions";
import { Etablissement, TabType } from "@/lib/libs/interface";

const DEFAULT_COUNT = 10000;

export function useEtablissementsData() {
  const searchParams = useSearchParams();

  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const nbetablissements = useMemo(() => {
    const param = searchParams?.get('nbetablissements');
    if (!param) return DEFAULT_COUNT;
    const parsed = parseInt(param, 10);
    return isNaN(parsed) ? DEFAULT_COUNT : parsed;
  }, [searchParams]);

  const fetchDataetablissemnts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchData<Etablissement[]>(
        `/api/etablissements?nbetablissements=${nbetablissements}`
      );
      setEtablissements(response);
    } catch {
      setEtablissements([]);
    } finally {
      setIsLoading(false);
    }
  }, [nbetablissements]);

  useEffect(() => {
    fetchDataetablissemnts();
  }, [fetchDataetablissemnts]);

  const filterByLocation = useCallback((etab: Etablissement) =>
    etab.type === 'Hôtel',
    []);

  const filterByStatus = useCallback((etab: Etablissement) => {
    if (activeTab === 'upToDate') return etab.cotisation === 'À jour';
    if (activeTab === 'notUpToDate') return etab.cotisation === 'Pas à jour';
    return true;
  }, [activeTab]);

  const filteredEtablissements = useMemo(() =>
    etablissements.filter(
      etab => filterByLocation(etab) && filterByStatus(etab)
    ),
    [etablissements, filterByLocation, filterByStatus]
  );

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  const handleBackClick = useCallback(() => {
    window.history.back();
  }, []);

  const { label } = TAB_ETAB_CONFIG[activeTab];

  return {
    isLoading, activeTab, label, count: filteredEtablissements.length, filteredEtablissements,
    handleBackClick, handleTabChange,
  };
}