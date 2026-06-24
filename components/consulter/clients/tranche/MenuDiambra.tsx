'use client';
import Charte from "@/components/charts/Charte";
import BackButton from "@/components/commons/BackButton";
import Bandeau from "@/components/commons/Bandeau";
import { ReportButton } from "@/components/commons/ReportButton";
import { usePrincipale } from "@/hooks/datakwaba/clients/tranche/usePrincipale";
import { memo } from "react";
import { AgeGroupStatsSection } from "../../commons/AgeGroupStatsSection";
import { MainStatCard } from "../../commons/MainStatCard";
import { PeriodButtons } from "../../commons/PeriodButtons";

const MenuDiambra = memo(() => {
  const {
    setActivePeriod, handleBack, handleRapportClick,
    submenutitems, tpsglobal, adaptedMainItem, adaptedAgeGroupItems, activePeriod,
  } = usePrincipale();

  return (
    <div className="bg-white flex flex-col items-center w-full max-w-8xl mx-auto p-4 space-y-6">
      <Bandeau />
      <BackButton onClick={handleBack} />

      <div className="flex flex-col items-center w-full space-y-6">
        <h1 className="text-xl uppercase font-bold text-gray-800 text-center">
          Statistiques des clients par tranches d'âge
        </h1>

        <PeriodButtons
          activePeriod={activePeriod}
          onPeriodChange={setActivePeriod}
        />

        {adaptedMainItem && (
          <MainStatCard item={adaptedMainItem} tpsglobal={tpsglobal} />
        )}

        <AgeGroupStatsSection
          items={adaptedAgeGroupItems}
          tpsglobal={tpsglobal}
          onClick={() => { }}
        />

        {submenutitems.length > 0 && (
          <div className="w-full max-w-3xl">
            <Charte menuItems={adaptedAgeGroupItems} />
          </div>
        )}
        <ReportButton onClick={handleRapportClick} />
      </div>
    </div>
  );
});

export default MenuDiambra;