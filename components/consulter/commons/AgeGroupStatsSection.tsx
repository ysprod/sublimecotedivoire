// components/AgeGroupStatsSection.tsx
'use client';

import { memo } from "react";
import Image from "next/image";
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

  // ✅ Composant pour afficher l'icône de la tranche d'âge
  const AgeIcon = ({ item }: { item: any }) => {
    const iconPath = item.iconSrc || item.icon || item.blackicon;
    
    if (iconPath) {
      return (
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-gray-200 shadow-sm flex items-center justify-center">
          <Image
            src={iconPath}
            alt={item.iconAlt || `Icône ${item.description}`}
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
      );
    }

    // Fallback : emoji
    return (
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 border-2 border-gray-200">
        <span className="text-2xl">👤</span>
      </div>
    );
  };

  // ✅ InfoStat personnalisé avec l'icône d'âge
  const CustomInfoStat = ({ item }: { item: any }) => {
    const count = item.nbetablissements || item.count || 0;
    const total = items.reduce((sum, i) => sum + (i.nbetablissements || i.count || 0), 0);
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
      <div
        className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-blue-300`}
        onClick={() => onClick(item)}
      >
        <div className="flex items-center gap-3">
          <AgeIcon item={item} />
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
          {/* Barre de progression */}
          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
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