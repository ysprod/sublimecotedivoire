'use client';
import Charte from "@/components/charts/Charte";
import Bandeau from "@/components/commons/Bandeau";
import BackButton from "@/components/recherche/BackButton";
import { usePrincipale } from "@/hooks/datakwaba/clients/tranche/usePrincipale";
import type { EtablissementType, PeriodData, PeriodType } from "@/lib/libs/interface";
import { memo, useCallback, useMemo, useState } from "react";
import { EtablissementTypeButtons, PeriodButtons, PeriodStats } from "./Feature";
import InfoStat from "./InfoStat";
import PDFDownloadButton from "./ReportPDF";

const PERIOD_MULTIPLIERS: Record<PeriodType, number> = {
  all: 1,
  week: 0.25,
  month: 0.5,
  year: 0.8,
};





const MenuDiambra = memo(() => {
  const {
    handleBackClick, handleClick,
    submenutitems, tpsglobal, mainMenuItem, typeItems,
  } = usePrincipale();

  const [activePeriod, setActivePeriod] = useState<PeriodType>('all');
  const [activeType, setActiveType] = useState<EtablissementType>(null);

  // Données par période
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
    <div className="flex flex-col w-full max-w-5xl mx-auto p-4 space-y-6">
      <Bandeau />
      <BackButton onClick={handleBack} />

      <div className="flex justify-center flex-col items-center w-full mt-4 space-y-6">
        {/* Titre principal */}
        <h1 className="text-xl uppercase font-bold text-gray-800 text-center">
          statistiques des clients   au plan national
        </h1>

        {/* Indicateur principal avec tendances */}
        {mainMenuItem && (
          <div className="w-full max-w-md">
            <InfoStat
              item={{
                ...mainMenuItem,
                nbetablissements: Math.round(mainMenuItem.nbetablissements * periodMultiplier),
              }}
              inverse
              tpsglobal={tpsglobal}
              onClick={handleClick}
            />
          </div>
        )}

        {/* Boutons de période */}
        <div className="flex justify-center w-full">
          <PeriodButtons
            activePeriod={activePeriod}
            onPeriodChange={setActivePeriod}
          />
        </div>

        



        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Par Tranches d'âges
          </h3>

        </div>

        {/* Bouton PDF */}
        <div className="w-full max-w-3xl flex justify-center">
          <PDFDownloadButton
            mainItem={mainMenuItem}
            hotelItems={submenutitems}
            subItems={submenutitems}
          />
        </div>

        {/* Graphique */}
        {submenutitems.length > 0 && (
          <div className="w-full max-w-3xl space-y-6">
            <Charte menuItems={submenutitems} />
          </div>
        )}
      </div>
    </div>
  );
});

export default MenuDiambra;