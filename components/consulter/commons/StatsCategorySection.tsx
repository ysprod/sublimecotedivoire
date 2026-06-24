'use client';
import { memo } from "react";
import { InfoStat } from "./InfoStat"; 

const StatsCategorySection = memo(({
  title,
  items,
  tpsglobal,
  periodMultiplier,
  onClick,
  icon: Icon,
  columns = 3
}: {
  title: string;
  items: any[];
  tpsglobal: number;
  periodMultiplier: number;
  onClick: (item: any) => void;
  icon: React.ElementType;
  columns?: 3 | 4;
}) => {
  if (items.length === 0) return null;

  const colClasses = columns === 4
    ? "grid-cols-3 sm:grid-cols-4"
    : "grid-cols-3 sm:grid-cols-3";

  return (
    <div className="w-full max-w-3xl bg-white  p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      
      <div className={`grid ${colClasses} gap-4`}>
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

export default StatsCategorySection;