'use client';
import Charte from "@/components/charts/Charte";
import Bandeau from "@/components/commons/Bandeau";
import BackButton from "@/components/recherche/BackButton";
import { usePrincipale } from "@/hooks/datakwaba/clients/genre/usePrincipale";
import type { PeriodData, PeriodType } from "@/lib/libs/interface";
import { memo, useCallback, useMemo, useState } from "react";
import { PeriodButtons, PeriodStats } from "./Feature";
import InfoStat from "./InfoStat";
import PDFDownloadButton from "./ReportPDF";

const PERIOD_MULTIPLIERS: Record<PeriodType, number> = {
  all: 1,
  week: 0.25,
  month: 0.5,
  year: 0.8,
};

const GenreStatsSection = memo(({
  items,
  tpsglobal,
  periodMultiplier,
  onClick
}: {
  items: any[];
  tpsglobal: number;
  periodMultiplier: number;
  onClick: (item: any) => void;
}) => {
  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
        Par Genre
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <InfoStat
            key={`${item.title}-${item.tpsglobal}`}
            item={{
              ...item,
              nbetablissements: Math.round(item.nbetablissements * periodMultiplier),
            }}
            tpsglobal={tpsglobal}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
});

const MenuDiambra = memo(() => {
  const { handleBackClick, submenutitems, tpsglobal, mainMenuItem, genreItems, } = usePrincipale();

  const [activePeriod, setActivePeriod] = useState<PeriodType>('all');

  const periodData = useMemo<PeriodData>(() => {
    const baseValue = mainMenuItem?.nbetablissements || 0;
    const multiplier = PERIOD_MULTIPLIERS[activePeriod];
    const value = Math.round(baseValue * multiplier);

    const variation = (Math.sin(baseValue * 0.1) * 10 + Math.random() * 6 - 3) * multiplier;
    const roundedVariation = Math.round(variation * 10) / 10;

    let direction: 'croissance' | 'baisse' | 'stable';
    if (roundedVariation > 3) direction = 'croissance';
    else if (roundedVariation < -3) direction = 'baisse';
    else direction = 'stable';

    const periodLabels: Record<PeriodType, string> = {
      all: 'Total général',
      week: 'Cette semaine',
      month: 'Ce mois',
      year: 'Cette année'
    };

    return {
      label: periodLabels[activePeriod],
      value,
      trend: {
        direction,
        value: Math.abs(roundedVariation),
        label: direction === 'croissance' ? 'en progression' :
          direction === 'baisse' ? 'en baisse' : 'stable'
      }
    };
  }, [mainMenuItem, activePeriod]);

  const handleBack = useCallback(() => {
    handleBackClick?.();
  }, [handleBackClick]);

  const periodMultiplier = PERIOD_MULTIPLIERS[activePeriod];

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto p-4 space-y-6">
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
        {mainMenuItem && (
          <div className="w-full max-w-md">
            <InfoStat
              item={{
                ...mainMenuItem,
                nbetablissements: Math.round(mainMenuItem.nbetablissements * periodMultiplier),
              }}
              inverse
              tpsglobal={tpsglobal}
              onClick={() => { }}
            />
          </div>
        )}
 
        <GenreStatsSection
          items={submenutitems}
          tpsglobal={tpsglobal}
          periodMultiplier={periodMultiplier}
          onClick={() => { }}
        />


        {submenutitems.length > 0 && (
          <div className="w-full max-w-3xl">
            <Charte menuItems={submenutitems} />
          </div>
        )}

        <div className="w-full max-w-3xl flex justify-center">
          <PDFDownloadButton
            mainItem={mainMenuItem}
            hotelItems={submenutitems}
            subItems={submenutitems}
          />
        </div>

      </div>
    </div>
  );
});

export default MenuDiambra;