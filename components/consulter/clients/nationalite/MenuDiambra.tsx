'use client';
import Charte from "@/components/charts/Charte";
import Bandeau from "@/components/commons/Bandeau";
import BackButton from "@/components/commons/BackButton";
import { usePrincipale } from "@/hooks/datakwaba/clients/nationalite/usePrincipale";
import type { PeriodType } from "@/lib/libs/interface";
import { memo, useCallback, useMemo, useState } from "react"; 
import PDFDownloadButton from "./ReportPDF";
import { PeriodButtons } from "../../commons/PeriodButtons";
import { MainStatCard } from "../../commons/MainStatCard";
import { NationaliteStatsSection } from "../../commons/NationaliteStatsSection.tsxNationaliteStatsSection";

const PERIOD_MULTIPLIERS: Record<PeriodType, number> = {
  all: 1,
  week: 0.25,
  month: 0.5,
  year: 0.8,
};

const MenuDiambra = memo(() => {
  const {
    handleBackClick,
    submenutitems,
    tpsglobal,
    mainMenuItem,
    nationaliteItems  } = usePrincipale();

  const [activePeriod, setActivePeriod] = useState<PeriodType>('all');

  const handleBack = useCallback(() => {
    handleBackClick?.();
  }, [handleBackClick]);

  const periodMultiplier = PERIOD_MULTIPLIERS[activePeriod];

  // ✅ Adaptation des données selon la période
  const adaptedMainItem = useMemo(() => {
    if (!mainMenuItem) return null;
    const adaptedCount = Math.round(mainMenuItem.nbetablissements * periodMultiplier);
    return {
      ...mainMenuItem,
      nbetablissements: adaptedCount,
      count: adaptedCount,
      title: `${adaptedCount} CLIENTS`,
    };
  }, [mainMenuItem, periodMultiplier]);

  const adaptedNationaliteItems = useMemo(() =>
    nationaliteItems.map(item => ({
      ...item,
      nbetablissements: Math.round(item.nbetablissements * periodMultiplier),
      count: Math.round(item.count * periodMultiplier),
      title: `${Math.round(item.nbetablissements * periodMultiplier)} ${item.title?.replace(/^\d+\s/, '') || ''}`,
    })),
    [nationaliteItems, periodMultiplier]
  );

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
          onClick={() => {}}
        />
        {submenutitems.length > 0 && (
          <div className="w-full max-w-3xl">
            <Charte menuItems={adaptedNationaliteItems} />
          </div>
        )}

        <div className="w-full max-w-3xl flex justify-center">
          <PDFDownloadButton
            mainItem={adaptedMainItem}
            hotelItems={submenutitems}
            subItems={submenutitems}
          />
        </div>
      </div>
    </div>
  );
});

export default MenuDiambra;