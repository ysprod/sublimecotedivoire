"use client";
import Bandeau from "@/components/commons/Bandeau";
import HistoriqueLoader from "@/components/connexions/HistoriqueLoader";
import ConsulterListeEtablissement from "@/components/etablissemts/ConsulterListeEtablissement";
import TabButtonRender from "@/components/etablissemts/TabButtonRender";
import BackButton from "@/components/commons/BackButton";
import { useEtablissementsData } from "@/hooks/datakwaba/hotels/list/useEtablissementsData";
import { DATA_LOADING } from "@/lib/libs/constants";
import { memo } from "react";

const MenuDiambra = memo(() => {
  const {
    handleBackClick, handleTabChange, isLoading, activeTab, label, count, filteredEtablissements,
  } = useEtablissementsData();

  if (isLoading) { return (<HistoriqueLoader texte={DATA_LOADING} />); }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto space-x-4 space-y-4">
      <Bandeau />
      <BackButton onClick={handleBackClick} />
      <TabButtonRender handleTabChange={handleTabChange} activeTab={activeTab} />

      <div className="py-2">
        <p className="text-center mb-1 text-sm font-medium">
          {label} ({count})
        </p>
        <ConsulterListeEtablissement etablissements={filteredEtablissements} key={`etab-list-${activeTab}-${count}`} />
      </div>
    </div>
  );
});

export default MenuDiambra;