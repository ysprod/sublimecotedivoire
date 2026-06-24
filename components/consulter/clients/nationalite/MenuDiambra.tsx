'use client';
import Charte from "@/components/charts/Charte";
import BackButton from "@/components/commons/BackButton";
import Bandeau from "@/components/commons/Bandeau";
import { ReportButton } from "@/components/commons/ReportButton";
import { usePrincipale } from "@/hooks/datakwaba/clients/nationalite/usePrincipale";
import { memo } from "react";
import { MainStatCard } from "../../commons/MainStatCard";
import { NationaliteStatsSection } from "../../commons/NationaliteStatsSection.tsxNationaliteStatsSection";
import { PeriodButtons } from "../../commons/PeriodButtons";

const MenuDiambra = memo(() => {
  const {
    handleRapportClick, setActivePeriod, handleBack,
    submenutitems, tpsglobal, activePeriod, adaptedMainItem, adaptedNationaliteItems,
  } = usePrincipale();

  return (
    <div className="bg-white flex flex-col items-center w-full max-w-8xl mx-auto p-4 space-y-6">
      <Bandeau />
      <BackButton onClick={handleBack} />

      <div className="flex flex-col items-center w-full space-y-6">
        <h1 className="text-xl uppercase font-bold text-gray-800 text-center">
          Statistiques des clients par nationalité
        </h1>

        <PeriodButtons
          activePeriod={activePeriod}
          onPeriodChange={setActivePeriod}
        />

        {adaptedMainItem && (
          <MainStatCard item={adaptedMainItem} tpsglobal={tpsglobal} />
        )}

        <NationaliteStatsSection
          items={adaptedNationaliteItems}
          tpsglobal={tpsglobal}
          onClick={() => { }}
        />
        {submenutitems.length > 0 && (
          <div className="w-full max-w-3xl">
            <Charte menuItems={adaptedNationaliteItems} />
          </div>
        )}

        <ReportButton onClick={handleRapportClick} />
      </div>
    </div>
  );
});

export default MenuDiambra;