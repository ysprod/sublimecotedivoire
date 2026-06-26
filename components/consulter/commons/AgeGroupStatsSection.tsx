'use client';
import Image from "next/image";
import { memo } from "react";

interface AgeGroupStatsSectionProps {
  items: any[];
  tpsglobal: number;
  onClick: (item: any) => void;
}

export const AgeGroupStatsSection = memo(({
  items,
  onClick
}: AgeGroupStatsSectionProps) => {
  if (items.length === 0) return null;

  // ✅ Composant pour afficher l'icône de la tranche d'âge
  const AgeIcon = ({ item }: { item: any }) => {
    const iconPath = item.iconSrc || item.icon || item.blackicon;

    if (iconPath) {
      return (
        <div className="w-24 h-24   flex items-center justify-center">
          <Image
            src={iconPath}
            alt={item.iconAlt || `Icône ${item.description}`}
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
      );
    }

    return (
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 border-2 border-gray-200">
        <span className="text-2xl">👤</span>
      </div>
    );
  };


  const CustomInfoStat = ({ item }: { item: any }) => {
    const count = item.nbetablissements || item.count || 0;
    const total = items.reduce((sum, i) => sum + (i.nbetablissements || i.count || 0), 0);
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
      <div
        className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-blue-300`}
        onClick={() => onClick(item)}
      >
        <AgeIcon item={item} />
        <div className="flex items-center gap-3">

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {item.description || item.title?.replace(/^\d+\s/, '') || 'Inconnu'}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold text-blue-600">
                {count.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">
                ({percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
        <span>📊</span>
        Par Tranche d'Âge
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <CustomInfoStat key={item.id || item.title} item={item} />
        ))}
      </div>
    </div>
  );
});

AgeGroupStatsSection.displayName = 'AgeGroupStatsSection';