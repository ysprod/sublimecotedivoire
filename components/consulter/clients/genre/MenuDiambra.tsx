'use client';
import Charte from '@/components/charts/Charte';
import BackButton from '@/components/commons/BackButton';
import Bandeau from '@/components/commons/Bandeau';
import { usePrincipale } from '@/hooks/datakwaba/clients/genre/usePrincipale';
import { memo } from 'react';
import { ReportButton } from '../../../commons/ReportButton';
import { GenreStatsSection } from '../../commons/GenreStatsSection';
import { MainStatCard } from '../../commons/MainStatCard';
import { PeriodButtons } from '../../commons/PeriodButtons';

const MenuDiambra = memo(function MenuDiambra() {
  const {
    setActivePeriod, handleBack, handleRapportClick,
    adaptedMainItem, adaptedGenreItems, activePeriod, tpsglobal,
  } = usePrincipale();

  return (
    <div className="mx-auto flex w-full max-w-8xl flex-col items-center space-y-6 bg-white p-4 mb-16">
      <Bandeau />
      <BackButton onClick={handleBack} />

      <div className="flex w-full flex-col items-center space-y-6">
        <div className="flex w-full max-w-3xl items-center justify-between">
          <h1 className="flex-1 text-center text-xl font-bold uppercase text-gray-800">
            Statistiques des clients au plan national
          </h1>
        </div>

        <PeriodButtons
          activePeriod={activePeriod}
          onPeriodChange={setActivePeriod}
        />

        {adaptedMainItem && (
          <MainStatCard item={adaptedMainItem} tpsglobal={tpsglobal} />
        )}

        <GenreStatsSection
          items={adaptedGenreItems}
          tpsglobal={tpsglobal}
          onClick={() => { }}
        />
        {adaptedGenreItems.length > 0 && (
          <div className="w-full max-w-3xl">
            <Charte menuItems={adaptedGenreItems} />
          </div>
        )}

        <ReportButton onClick={handleRapportClick} />
      </div>
    </div>
  );
});

export default MenuDiambra;