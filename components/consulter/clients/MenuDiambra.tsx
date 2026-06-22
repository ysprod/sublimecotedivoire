'use client';
import Bandeau from "@/components/commons/Bandeau";
import BackButton from "@/components/recherche/BackButton";
import { usePrincipale } from "@/hooks/datakwaba/clients/usePrincipale";
import type { PeriodType } from "@/lib/libs/interface";
import clsx from "clsx";
import { Calendar, Globe, Users } from "lucide-react";
import { memo } from "react";
import InfoStat from "./InfoStat";
import PDFDownloadButton from "./ReportPDF";

const PERIOD_BUTTONS: { id: PeriodType; label: string; icon: string }[] = [
  { id: 'all', label: 'Vue d\'ensemble', icon: '📊' },
  { id: 'week', label: 'Cette semaine', icon: '📅' },
  { id: 'month', label: 'Ce mois', icon: '📆' },
  { id: 'year', label: 'Cette année', icon: '📈' },
];

const PeriodButtons = memo(({
  activePeriod,
  onPeriodChange
}: {
  activePeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-2 w-full max-w-3xl justify-center">
      {PERIOD_BUTTONS.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => onPeriodChange(id)}
          className={clsx(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            activePeriod === id
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          <span className="mr-1">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
});

const FILTERS = [
  { id: 'type', label: 'Par Type d\'établissements', icon: Calendar, color: 'from-emerald-500 to-teal-500', path: '/consulter/clients/type' },
  { id: 'genre', label: 'Par Genre', icon: Users, color: 'from-pink-500 to-rose-500', path: '/consulter/clients/genre' },
  { id: 'nationalite', label: 'Par Nationalité', icon: Globe, color: 'from-blue-500 to-indigo-500', path: '/consulter/clients/nationalite' },
  { id: 'age', label: 'Par Tranches d\'âges', icon: Calendar, color: 'from-emerald-500 to-teal-500', path: '/consulter/clients/age' },
] as const;

const CategoryFilterButtons = memo(() => (
  <div className="flex flex-wrap gap-3 justify-center">
    {FILTERS.map(({ id, label, icon: Icon, path }) => (
      <button
        key={id}
        onClick={() => { window.location.href = path; }}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
      >
        <Icon size={18} />
        {label}
      </button>
    ))}
  </div>
));

const MenuDiambra = memo(() => {
  const {
    setActivePeriod, handleBack,
    periodMultiplier, submenutitems, tpsglobal, mainMenuItem, activePeriod,
  } = usePrincipale();

  return (
    <div className="flex flex-col items-center w-full mx-auto max-w-5xl p-4 space-y-6">
      <Bandeau />
      <BackButton onClick={handleBack} />

      <h1 className="text-xl uppercase font-bold text-gray-800 text-center">
        Statistiques des clients au plan national
      </h1>

      <PeriodButtons
        activePeriod={activePeriod}
        onPeriodChange={setActivePeriod}
      />

      {mainMenuItem && (
        <div className="w-full max-w-md flex justify-center">
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

      <div className="w-full max-w-3xl flex justify-center mt-4 mb-4">
        <PDFDownloadButton
          mainItem={mainMenuItem}
          hotelItems={submenutitems}
          subItems={submenutitems}
        />
      </div>
    </div>
  );
});

export default MenuDiambra;