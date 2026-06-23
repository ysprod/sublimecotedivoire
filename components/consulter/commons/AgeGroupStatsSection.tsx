// components/AgeGroupStatsSection.tsx
'use client';

import { memo } from "react";
import { InfoStat } from "./InfoStat";

interface AgeGroupStatsSectionProps {
  items: any[];
  tpsglobal: number;
  onClick: (item: any) => void;
}

export const AgeGroupStatsSection = memo(({
  items,
  tpsglobal,
  onClick
}: AgeGroupStatsSectionProps) => {
  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-3xl p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
        Par Tranches d'Âges
      </h3>
      <div className="grid grid-cols-4 gap-4">
        {items.map((item) => (
          <InfoStat
            key={`${item.title}-${item.tpsglobal}`}
            item={item}
            tpsglobal={tpsglobal}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
});

AgeGroupStatsSection.displayName = 'AgeGroupStatsSection';