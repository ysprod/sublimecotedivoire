'use client';
import Image from "next/image";
import { memo } from "react";

interface NationaliteStatsSectionProps {
  items: any[];
  tpsglobal: number;
  onClick: (item: any) => void;
}

export const NationaliteStatsSection = memo(({
  items,
  onClick
}: NationaliteStatsSectionProps) => {
  if (items.length === 0) return null;

  const topNationalities = items.slice(0, 4);
  const otherNationalities = items.slice(4);

  const renderFlag = (item: any) => {
    const isGlobe = item.id === 'autre' || item.description?.includes('AUTRE');
    const flagUrl = item.iconSrc || item.icon || item.blackicon;

    if (isGlobe) {
          return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4A90D9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
            <path d="M12 2v20" />
          </svg>
        </div>
      );
    }

    if (flagUrl) {
      return (
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm flex-shrink-0 bg-gray-50">
          <Image
            src={flagUrl}
            alt={item.iconAlt || `Drapeau ${item.description}`}
            width={40}
            height={40}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
      );
    }

    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 border-2 border-gray-200">
        <span className="text-xl">🏳️</span>
      </div>
    );
  };

  const CustomInfoStat = ({ item }: { item: any }) => {
    const count = item.nbetablissements || item.count || 0;
    const total = items.reduce((sum, i) => sum + (i.nbetablissements || i.count || 0), 0);
    const percentage = total > 0 ? (count / total) * 100 : 0;
    const isOther = item.id === 'autre' || item.description?.includes('AUTRE');

    return (
      <div
        className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-blue-300 ${isOther ? 'col-span-1' : ''}`}
        onClick={() => onClick(item)}
      >
        <div className="flex items-center gap-3">
          {renderFlag(item)}
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
        <span>🌍</span>
        Par Nationalité
      </h3>

      {/* Top 4 nationalités */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {topNationalities.map((item) => (
          <CustomInfoStat key={item.id || item.title} item={item} />
        ))}
      </div>

      {otherNationalities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-2">
          {otherNationalities.map((item) => (
            <CustomInfoStat key={item.id || item.title} item={item} />
          ))}
        </div>
      )}
    </div>
  );
});

NationaliteStatsSection.displayName = 'NationaliteStatsSection';