// components/NationaliteStatsSection.tsx
'use client';

import { memo } from "react";
import { InfoStat } from "./InfoStat";

interface NationaliteStatsSectionProps {
  items: any[];
  tpsglobal: number;
  onClick: (item: any) => void;
}

export const NationaliteStatsSection = memo(({
  items,
  tpsglobal,
  onClick
}: NationaliteStatsSectionProps) => {
  if (items.length === 0) return null;

  // ✅ Séparer les 4 premières nationalités + Autre
  const topNationalities = items.slice(0, 4);
  const otherNationalities = items.slice(4);

  return (
    <div className="w-full max-w-3xl p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
        Par Nationalité
      </h3>
      
      {/* Top 4 nationalités */}
      <div className="grid grid-cols-4 gap-4">
        {topNationalities.map((item) => (
          <InfoStat
            key={`${item.title}-${item.tpsglobal}`}
            item={item}
            tpsglobal={tpsglobal}
            onClick={onClick}
          />
        ))}
      </div>

      {/* Autre nationalité */}
      {otherNationalities.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mt-2">
          {otherNationalities.map((item) => (
            <InfoStat
              key={`${item.title}-${item.tpsglobal}`}
              item={item}
              tpsglobal={tpsglobal}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
});

NationaliteStatsSection.displayName = 'NationaliteStatsSection';