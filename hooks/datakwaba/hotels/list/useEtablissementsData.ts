'use client';
import { TAB_ETAB_CONFIG } from "@/lib/libs/constants";
import { fetchData } from "@/lib/libs/functions";
import { Etablissement, TabType } from "@/lib/libs/interface";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useEtablissementsData() {
  const etablissementItem = useMonEtoileStore((state) => state.etablissementItem);

  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const fetchDataetablissemnts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchData<Etablissement[]>(
        `/api/etablissements?nbetablissements=${etablissementItem?.nbetablissements}`
      );
      setEtablissements(response);
    } catch {
      setEtablissements([]);
    } finally {
      setIsLoading(false);
    }
  }, [etablissementItem?.nbetablissements]);

  useEffect(() => {
    fetchDataetablissemnts();
  }, [fetchDataetablissemnts]);


  const filterByStatus = useCallback((etab: Etablissement) => {
    if (activeTab === 'upToDate') return etab.cotisation === 'À jour';
    if (activeTab === 'notUpToDate') return etab.cotisation === 'Pas à jour';
    return true;
  }, [activeTab]);

  const filteredEtablissements = useMemo(() =>
    etablissements.filter(
      etab => filterByStatus(etab)
    ),
    [etablissements, filterByStatus]
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