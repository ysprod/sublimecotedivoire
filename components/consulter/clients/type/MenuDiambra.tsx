'use client';
import { memo } from 'react';
import { Building2 } from 'lucide-react';
import Bandeau from '@/components/commons/Bandeau';
import BackButton from '@/components/commons/BackButton';
import Charte from '@/components/charts/Charte';
import { ReportButton } from '@/components/commons/ReportButton';
import { usePrincipale } from '@/hooks/datakwaba/clients/type/usePrincipale';
import { PeriodButtons } from '../../commons/PeriodButtons';
import { InfoStat } from '../../commons/InfoStat';
import StatsCategorySection from '../../commons/StatsCategorySection';

const MenuDiambra = memo(function MenuDiambra() {
  const {
    handleClick, setActivePeriod, handleBack, handleRapportClick,
    activeType, adaptedMainItem, adaptedTypeItems, submenutitems, activePeriod,
  } = usePrincipale();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center space-y-6 p-4">
      <Bandeau />
      <BackButton onClick={handleBack} />

      <h1 className="text-center text-xl font-bold uppercase text-gray-800">
        Statistiques des clients au plan national
      </h1>

      <PeriodButtons activePeriod={activePeriod} onPeriodChange={setActivePeriod} />

      {adaptedMainItem && (
        <div className="flex w-full max-w-md justify-center">
          <InfoStat
            item={adaptedMainItem}
            inverse
            tpsglobal={0}
            onClick={handleClick}
          />
        </div>
      )}

      <StatsCategorySection
        title={`Par Type d'établissement ${activeType ? `- ${activeType.charAt(0).toUpperCase() + activeType.slice(1)}` : ''}`}
        items={adaptedTypeItems}
        tpsglobal={0}
        periodMultiplier={1}
        onClick={handleClick}
        icon={Building2}
        columns={3}
      />

      {submenutitems.length > 0 && (
        <div className="flex w-full max-w-3xl justify-center">
          <Charte menuItems={submenutitems} />
        </div>
      )}

      <ReportButton onClick={handleRapportClick} />
    </div>
  );
});

MenuDiambra.displayName = 'MenuDiambra';

export default MenuDiambra;