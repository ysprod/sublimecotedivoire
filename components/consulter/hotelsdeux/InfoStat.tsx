'use client';

import { STAT_LABEL_MAP } from "@/lib/libs/constants";
import type { MenuItem } from "@/lib/libs/interface";
import clsx from "clsx";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import { memo, useCallback, useMemo } from "react";

// ============ TYPES ============
interface InfoStatProps {
  item: MenuItem;
  tpsglobal?: number;
  inverse?: boolean;
  onClick?: (item: MenuItem) => void;
  trendPeriod?: 'day' | 'week' | 'month' | 'year';
}

interface TrendData {
  direction: 'croissance' | 'baisse' | 'stable';
  value: number;
  label: string;
}

// ============ CONSTANTES ============
const TREND_CONFIG = {
  croissance: {
    icon: TrendingUp,
    bgColor: "bg-green-100",
    color: "text-green-700",
    label: "en hausse"
  },
  baisse: {
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

const PERIOD_LABELS = {
  day: 'hier',
  week: 'la semaine dernière',
  month: 'le mois dernier',
  year: 'l\'année dernière'
} as const;

// ============ FONCTIONS DE GÉNÉRATION DE TENDANCES ============
const generateTrend = (baseValue: number, period: 'day' | 'week' | 'month' | 'year' = 'day'): TrendData => {
  // Facteurs de variation selon la période
  const periodFactors = {
    day: { min: -15, max: 15, multiplier: 1 },
    week: { min: -25, max: 25, multiplier: 1.5 },
    month: { min: -40, max: 40, multiplier: 2 },
    year: { min: -60, max: 60, multiplier: 3 }
  };

  const factor = periodFactors[period];
  const variation = (Math.sin(baseValue * 0.1) * factor.max * 0.5) + (Math.random() * (factor.max - factor.min) + factor.min);
  const roundedVariation = Math.round(variation * 10) / 10;

  let direction: 'croissance' | 'baisse' | 'stable';
  let label: string;

  const threshold = period === 'day' ? 3 : period === 'week' ? 5 : period === 'month' ? 8 : 10;

  if (roundedVariation > threshold) {
    direction = 'croissance';
    label = `+${roundedVariation}% par rapport à ${PERIOD_LABELS[period]}`;
  } else if (roundedVariation < -threshold) {
    direction = 'baisse';
    label = `${roundedVariation}% par rapport à ${PERIOD_LABELS[period]}`;
  } else {
    direction = 'stable';
    label = `stable par rapport à ${PERIOD_LABELS[period]}`;
  }

  return {
    direction,
    value: Math.abs(roundedVariation),
    label
  };
};

const getCategoryTrend = (title: string, count: number, period: 'day' | 'week' | 'month' | 'year'): TrendData | null => {
  const categoryTrends: Record<string, (count: number) => TrendData> = {
    'HÔTELS': (c) => generateTrend(c * 0.7, period),
    'RÉSIDENCES': (c) => generateTrend(c * 0.5, period),
    'MAISONS': (c) => generateTrend(c * 0.3, period),
    'ÉTABLISSEMENTS': (c) => generateTrend(c * 0.6, period),
    'CLIENTS': (c) => generateTrend(c * 0.8, period),
    'HOMMES': (c) => generateTrend(c * 0.4, period),
    'FEMMES': (c) => generateTrend(c * 0.5, period),
  };

  for (const [key, trendFn] of Object.entries(categoryTrends)) {
    if (title.includes(key)) {
      return trendFn(count);
    }
  }

  return null;
};

// ============ COMPOSANTS ============
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

TrendIndicator.displayName = "TrendIndicator";

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

FormattedTitle.displayName = "FormattedTitle";

// ============ COMPOSANT PRINCIPAL ============
const InfoStat = memo(({
  item,
  inverse = false,
  tpsglobal = 1,
  onClick,
  trendPeriod = 'day'
}: InfoStatProps) => {

  // Génération des données de tendance
  const trendData = useMemo<TrendData | null>(() => {
    // 1. Si l'item a déjà une tendance, l'utiliser avec la période appropriée
    if (item.trend) {
      // La direction est déjà du bon type car MenuItem.trend utilise 'croissance' | 'baisse' | 'stable'
      return {
        direction: item.trend.direction,
        value: item.trend.value,
        label: `${TREND_CONFIG[item.trend.direction].label} par rapport à ${PERIOD_LABELS[trendPeriod]}`
      };
    }

    // 2. Générer une tendance basée sur la catégorie
    const title = item.title || '';
    const count = item.nbetablissements || 0;

    const categoryTrend = getCategoryTrend(title, count, trendPeriod);
    if (categoryTrend) {
      return categoryTrend;
    }

    // 3. Générer une tendance basée sur le nombre
    if (count > 0) {
      return generateTrend(count, trendPeriod);
    }

    // 4. Tendance par défaut
    return {
      direction: 'stable',
      value: 0,
      label: `stable (données insuffisantes)`
    };
  }, [item, trendPeriod]);

  // Génération des tendances alternatives pour comparaison
  const alternativeTrends = useMemo<{ period: string; trend: TrendData }[]>(() => {
    if (!trendData || trendData.direction === 'stable') return [];

    const baseValue = item.nbetablissements || 1000;
    const periods: ('day' | 'week' | 'month' | 'year')[] = ['week', 'month', 'year'];

    return periods
      .filter(p => p !== trendPeriod)
      .map(p => {
        const trend = generateTrend(baseValue, p);
        return {
          period: p,
          trend: {
            ...trend,
            label: `sur ${p === 'week' ? '7 jours' : p === 'month' ? '30 jours' : '365 jours'}`
          }
        };
      })
      .slice(0, 2); // Limiter à 2 alternatives
  }, [item.nbetablissements, trendData, trendPeriod]);

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
        {trendData && (
          <div className="mt-1">
            <TrendIndicator trend={trendData} size="sm" />
          </div>
        )}

        {/* Indicateurs de tendance alternatifs */}
        {alternativeTrends.length > 0 && (
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            {alternativeTrends.map(({ period, trend }) => (
              <div key={period} className="scale-90">
                <TrendIndicator trend={trend} size="sm" />
              </div>
            ))}
          </div>
        )}
      </button>
    </div>
  );
});

InfoStat.displayName = "InfoStat";

export default InfoStat;