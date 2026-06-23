'use client';
import Bandeau from "@/components/commons/Bandeau";
import BackButton from "@/components/recherche/BackButton";
import { usePrincipale } from "@/hooks/datakwaba/clients/genre/usePrincipale";
import type { PeriodType } from "@/lib/libs/interface";
import { memo, useCallback, useMemo, useState } from "react";
import PDFDownloadButton from "./ReportPDF";
import Charte from "@/components/charts/Charte";
import { PeriodButtons } from "../../commons/PeriodButtons";
import { MainStatCard } from "../../commons/MainStatCard";
import { GenreStatsSection } from "../../commons/GenreStatsSection";

const PERIOD_MULTIPLIERS: Record<PeriodType, number> = {
  all: 1,
  week: 0.25,
  month: 0.5,
  year: 0.8,
};

const MenuDiambra = memo(() => {
  const { handleBackClick, submenutitems, tpsglobal, mainMenuItem, genreItems } = usePrincipale();

  const [activePeriod, setActivePeriod] = useState<PeriodType>('all');

  const handleBack = useCallback(() => {
    handleBackClick?.();
  }, [handleBackClick]);

  const periodMultiplier = PERIOD_MULTIPLIERS[activePeriod];

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

  const adaptedGenreItems = useMemo(() =>
    genreItems.map(item => ({
      ...item,
      nbetablissements: Math.round(item.nbetablissements * periodMultiplier),
      count: Math.round(item.count * periodMultiplier),
      title: `${Math.round(item.nbetablissements * periodMultiplier)} ${item.title?.replace(/^\d+\s/, '') || ''}`,
    })),
    [genreItems, periodMultiplier]
  );

  return (
    <div className="bg-white flex flex-col items-center w-full max-w-8xl mx-auto p-4 space-y-6">
      <Bandeau />
      <BackButton onClick={handleBack} />

      <div className="flex flex-col items-center w-full space-y-6">
        <h1 className="text-xl uppercase font-bold text-gray-800 text-center">
          Statistiques des clients au plan national
        </h1>

        <PeriodButtons
          activePeriod={activePeriod}
          onPeriodChange={setActivePeriod}
        />

        {adaptedMainItem && (
          <MainStatCard
            item={adaptedMainItem}
            tpsglobal={tpsglobal}
          />
        )}

        <GenreStatsSection
          items={adaptedGenreItems}
          tpsglobal={tpsglobal}
          onClick={() => { }}
        />
        
        {submenutitems.length > 0 && (
          <div className="w-full max-w-3xl">
            <Charte menuItems={adaptedGenreItems} />
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