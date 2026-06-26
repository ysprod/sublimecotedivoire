'use client';
import { PeriodType } from "@/lib/libs/interface";
import clsx from "clsx";
import { memo } from "react";

const PERIOD_BUTTONS: { id: PeriodType; label: string; icon: string }[] = [
  { id: 'all', label: 'Toutes périodes', icon: '📊' },
  { id: 'week', label: 'Cette semaine', icon: '📅' },
  { id: 'month', label: 'Ce mois', icon: '📆' },
  { id: 'year', label: 'Cette année', icon: '📈' },
];

export const PeriodButtons = memo(({
  activePeriod,
  onPeriodChange
}: {
  activePeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}) => (
  <div className="flex flex-wrap gap-2 w-full max-w-3xl justify-center">
    {PERIOD_BUTTONS.map(({ id, label, icon }) => (
      <button
        key={id}
        onClick={() => onPeriodChange(id)}
        className={clsx(
          "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
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
));