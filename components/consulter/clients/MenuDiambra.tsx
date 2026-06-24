'use client';
import { memo } from 'react';
import { Calendar, Globe, Users } from 'lucide-react';
import Bandeau from '@/components/commons/Bandeau';
import BackButton from '@/components/commons/BackButton';
import { ReportButton } from '@/components/commons/ReportButton';
import { usePrincipale } from '@/hooks/datakwaba/clients/usePrincipale';
import { PeriodButtons } from '../commons/PeriodButtons';
import { InfoStat } from '../commons/InfoStat';

const FILTERS = [
  {
    id: 'type',
    label: "Par Type d'établissements",
    icon: Calendar,
    path: '/consulter/clients/type',
  },
  {
    id: 'genre',
    label: 'Par Genre',
    icon: Users,
    path: '/consulter/clients/genre',
  },
  {
    id: 'nationalite',
    label: 'Par Nationalité',
    icon: Globe,
    path: '/consulter/clients/nationalite',
  },
  {
    id: 'age',
    label: "Par Tranches d'âges",
    icon: Calendar,
    path: '/consulter/clients/age',
  },
] as const;

const CategoryFilterButtons = memo(function CategoryFilterButtons() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {FILTERS.map(({ id, label, icon: Icon, path }) => (
        <button
          key={id}
          onClick={() => {
            window.location.href = path;
          }}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          type="button"
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
    </div>
  );
});

const MenuDiambra = memo(function MenuDiambra() {
  const {
    setActivePeriod, handleBack, handleRapportClick,
    periodMultiplier, tpsglobal, mainMenuItem, activePeriod,
  } = usePrincipale();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center space-y-6 p-4">
      <Bandeau />
      <BackButton onClick={handleBack} />

      <h1 className="text-center text-xl font-bold uppercase text-gray-800">
        Statistiques des clients au plan national
      </h1>

      <PeriodButtons activePeriod={activePeriod} onPeriodChange={setActivePeriod} />

      {mainMenuItem && (
        <div className="flex w-full max-w-md justify-center">
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

      <CategoryFilterButtons />

      <ReportButton onClick={handleRapportClick} />
    </div>
  );
});

MenuDiambra.displayName = 'MenuDiambra';

export default MenuDiambra;