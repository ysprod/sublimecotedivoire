'use client';
import { STAT_LABEL_MAP } from "@/lib/libs/constants";
import type { MenuItem } from "@/lib/libs/interface";
import clsx from "clsx";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import { memo, useCallback, useMemo } from "react";

interface InfoStatProps {
  item: MenuItem;
  tpsglobal?: number;
  inverse?: boolean;
  onClick?: (item: MenuItem) => void;
}

interface TrendData {
  direction: 'up' | 'down' | 'stable';
  value: number;
  label: string;
}

const TREND_CONFIG = {
  up: {
    icon: TrendingUp,
    bgColor: "bg-green-100",
    color: "text-green-700",
    label: "en hausse"
  },
  down: {
    icon: TrendingDown,
    bgColor: "bg-red-100",
    color: "text-red-700",
    label: "en baisse"
  },
  stable: {
    icon: Minus,
    bgColor: "bg-gray-100",
    color: "text-gray-700",
    label: "stable"
  }
} as const;

const generateTrend = (baseValue: number): TrendData => {
  const variation = (Math.sin(baseValue * 0.1) * 15) + (Math.random() * 6 - 3);
  const roundedVariation = Math.round(variation * 10) / 10;

  let direction: 'up' | 'down' | 'stable';
  let label: string;

  if (roundedVariation > 3) {
    direction = 'up';
    label = `+${roundedVariation}% par rapport à hier`;
  } else if (roundedVariation < -3) {
    direction = 'down';
    label = `${roundedVariation}% par rapport à hier`;
  } else {
    direction = 'stable';
    label = 'stable par rapport à hier';
  }

  return {
    direction,
    value: Math.abs(roundedVariation),
    label
  };
};

const getCategoryTrend = (title: string, count: number): TrendData | null => {
  const categoryTrends: Record<string, (count: number) => TrendData> = {
    'HÔTELS': (c) => generateTrend(c * 0.7),
    'RÉSIDENCES': (c) => generateTrend(c * 0.5),
    'MAISONS': (c) => generateTrend(c * 0.3),
    'ÉTABLISSEMENTS': (c) => generateTrend(c * 0.6),
    'CLIENTS': (c) => generateTrend(c * 0.8),
    'HOMMES': (c) => generateTrend(c * 0.4),
    'FEMMES': (c) => generateTrend(c * 0.5),
    'NATIONAUX': (c) => generateTrend(c * 0.6),
    'ETRANGERS': (c) => generateTrend(c * 0.9),
  };

  for (const [key, trendFn] of Object.entries(categoryTrends)) {
    if (title.includes(key)) {
      return trendFn(count);
    }
  }

  return null;
};

const TrendIndicator = memo(({ trend, size = 'sm' }: { trend: TrendData; size?: 'sm' | 'md' }) => {
  const config = TREND_CONFIG[trend.direction];
  const Icon = config.icon;

  const sizeClasses = size === 'md'
    ? "px-3 py-1.5 text-xs"
    : "px-2 py-1 text-[10px]";

  return (
    <div className="flex flex-col items-center gap-0.5 mt-1">
      <div className={clsx(
        "flex items-center gap-1 rounded-full font-medium transition-all duration-200",
        sizeClasses,
        config.bgColor,
        config.color
      )}>
        <Icon size={size === 'md' ? 14 : 12} className="stroke-current" />
        <span className="font-semibold">
          {trend.value > 0 ? '+' : ''}{trend.value}%
        </span>
      </div>
      <span className="text-[8px] text-gray-500 uppercase tracking-wider font-medium">
        {trend.label}
      </span>
    </div>
  );
});

const FormattedTitle = memo(({ item, inverse = false, tpsglobal = 1 }: InfoStatProps) => {
  const formattedTitle = useMemo(() => {
    if (!item.title) return null;

    const match = item.title.match(/^(\d+)\s(.+)$/);
    if (!match) return item.title;

    const numberPart = match[1];
    const textPart = match[2];
    const modifiedText = STAT_LABEL_MAP[tpsglobal] || "";

    return (
      <>
        <span className="text-gray-900">{inverse ? numberPart : textPart}</span>
        <br />
        <div>
          <span className="text-blue-600 font-bold">{inverse ? textPart : numberPart}</span>
          {!inverse && modifiedText && (
            <span className="text-blue-600 font-bold"> {modifiedText}</span>
          )}
        </div>
      </>
    );
  }, [item.title, inverse, tpsglobal]);

  return formattedTitle || <span className="text-gray-800">non spécifié</span>;
});

const InfoStat = memo(({
  item,
  inverse = false,
  tpsglobal = 1,
  onClick
}: InfoStatProps) => {

  // Génération des données de tendance
  const trendData = useMemo<TrendData | null>(() => {
    // 1. Si l'item a déjà une tendance, l'utiliser
    if (item.trend) {
      const direction = item.trend.direction === 'up'
        ? 'up'
        : item.trend.direction === 'down'
          ? 'down'
          : 'stable';

      return {
        direction,
        value: item.trend.value,
        label: TREND_CONFIG[direction].label + " par rapport à hier"
      };
    }

    // 2. Générer une tendance basée sur la catégorie
    const title = item.title || '';
    const count = item.nbetablissements || 0;

    const categoryTrend = getCategoryTrend(title, count);
    if (categoryTrend) {
      return categoryTrend;
    }

    // 3. Générer une tendance basée sur le nombre
    if (count > 0) {
      return generateTrend(count);
    }

    // 4. Tendance par défaut
    return {
      direction: 'stable',
      value: 0,
      label: 'stable (données insuffisantes)'
    };
  }, [item]);

  // Générer une tendance alternative (pour comparaison)
  const alternativeTrend = useMemo<TrendData | null>(() => {
    if (!trendData || trendData.direction === 'stable') return null;

    // Simuler une tendance sur 7 jours
    const baseValue = item.nbetablissements || 1000;
    const weeklyVariation = (Math.sin(baseValue * 0.05) * 5) + (Math.random() * 4 - 2);
    const roundedVariation = Math.round(weeklyVariation * 10) / 10;

    let direction: 'up' | 'down' | 'stable';
    if (roundedVariation > 2) {
      direction = 'up';
    } else if (roundedVariation < -2) {
      direction = 'down';
    } else {
      direction = 'stable';
    }

    return {
      direction,
      value: Math.abs(roundedVariation),
      label: `sur 7 jours`
    };
  }, [item.nbetablissements, trendData]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(item);
    }
  }, [onClick, item]);

  return (
    <div className="relative w-full">
      <button
        onClick={handleClick}
        className={clsx(
          "w-full flex flex-col items-center justify-center p-4",
          "bg-white rounded-lg transition-all duration-300 hover:shadow-lg",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "hover:scale-[1.02] cursor-pointer",
          "border border-gray-100"
        )}
        aria-label={`Accéder à ${item.title || "cette information"}`}
      >
        {/* Icône */}
        <div className="flex items-center justify-center mb-2">
          <Image
            src={item.icon || "/icons/batiment.png"}
            alt={item.title || "Information"}
            width={64}
            height={64}
            className="w-16 h-16 object-contain"
            priority={false}
            loading="lazy"
          />
        </div>

        {/* Titre formaté */}
        <div className="text-xs font-semibold text-center whitespace-pre-line">
          <FormattedTitle item={item} inverse={inverse} tpsglobal={tpsglobal} />
        </div>

        {/* Indicateur de tendance principal */}
        {trendData && <TrendIndicator trend={trendData} size="sm" />}

        {/* Indicateur de tendance alternative (optionnel) */}
        {alternativeTrend && (
          <div className="mt-0.5">
            <TrendIndicator trend={alternativeTrend} size="sm" />
          </div>
        )}
      </button>
    </div>
  );
});

InfoStat.displayName = "InfoStat";

export default InfoStat;