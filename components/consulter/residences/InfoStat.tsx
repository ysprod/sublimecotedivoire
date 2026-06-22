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

interface AllTrends {
  day: TrendData;
  week: TrendData;
  month: TrendData;
  year: TrendData;
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

const PERIOD_CONFIG = {
  day: { label: 'hier', short: 'J', threshold: 3, factor: 1 },
  week: { label: 'la semaine dernière', short: 'S', threshold: 5, factor: 1.5 },
  month: { label: 'le mois dernier', short: 'M', threshold: 8, factor: 2 },
  year: { label: 'l\'année dernière', short: 'A', threshold: 10, factor: 3 }
} as const;

const PERIODS = ['day', 'week', 'month', 'year'] as const;

// ============ FONCTIONS DE GÉNÉRATION DE TENDANCES ============
const generateTrendForPeriod = (
  baseValue: number,
  period: keyof typeof PERIOD_CONFIG
): TrendData => {
  const config = PERIOD_CONFIG[period];
  const variation = (Math.sin(baseValue * 0.1 + Math.random() * 0.5) * 15 + Math.random() * 6 - 3) * config.factor;
  const roundedVariation = Math.round(variation * 10) / 10;

  let direction: 'croissance' | 'baisse' | 'stable';
  let label: string;

  if (roundedVariation > config.threshold) {
    direction = 'croissance';
    label = `+${roundedVariation}% par rapport à ${config.label}`;
  } else if (roundedVariation < -config.threshold) {
    direction = 'baisse';
    label = `${roundedVariation}% par rapport à ${config.label}`;
  } else {
    direction = 'stable';
    label = `stable par rapport à ${config.label}`;
  }

  return {
    direction,
    value: Math.abs(roundedVariation),
    label
  };
};

const generateAllTrends = (baseValue: number): AllTrends => {
  const result = {} as AllTrends;
  for (const period of PERIODS) {
    result[period] = generateTrendForPeriod(baseValue, period);
  }
  return result;
};

const getCategoryTrends = (title: string, count: number): AllTrends => {
  const multipliers: Record<string, number> = {
    'HÔTELS': 0.7,
    'RÉSIDENCES': 0.5,
    'MAISONS': 0.3,
    'ÉTABLISSEMENTS': 0.6,
    'CLIENTS': 0.8,
    'HOMMES': 0.4,
    'FEMMES': 0.5,
    'NATIONAUX': 0.6,
    'ETRANGERS': 0.9,
  };

  let multiplier = 0.6;
  for (const [key, value] of Object.entries(multipliers)) {
    if (title.includes(key)) {
      multiplier = value;
      break;
    }
  }

  return generateAllTrends(count * multiplier);
};

// ============ COMPOSANTS ============
const TrendBadge = memo(({ trend, period }: { trend: TrendData; period: keyof typeof PERIOD_CONFIG }) => {
  const config = TREND_CONFIG[trend.direction];
  const Icon = config.icon;
  const periodInfo = PERIOD_CONFIG[period];

  return (
    <div className={clsx(
      "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium",
      config.bgColor,
      config.color
    )}>
      <span className="font-bold text-[8px]">{periodInfo.short}</span>
      <Icon size={8} className="stroke-current" />
      <span className="font-semibold">
        {trend.value > 0 ? '+' : ''}{trend.value}%
      </span>
    </div>
  );
});

TrendBadge.displayName = "TrendBadge";

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

  // Génération des 4 tendances
  const allTrends = useMemo<AllTrends>(() => {
    // 1. Si l'item a déjà des tendances, les utiliser
    if (item.trends) {
      return item.trends;
    }

    // 2. Générer des tendances basées sur la catégorie
    const title = item.title || '';
    const count = item.nbetablissements || 0;

    if (count > 0) {
      return getCategoryTrends(title, count);
    }

    // 3. Tendance par défaut
    return generateAllTrends(1000);
  }, [item]);

  // Tendance principale (jour)
  const mainTrend = useMemo(() => allTrends.day, [allTrends]);

  // Autres tendances pour l'affichage compact
  const otherTrends = useMemo(() => {
    return {
      week: allTrends.week,
      month: allTrends.month,
      year: allTrends.year
    };
  }, [allTrends]);

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

        {/* Indicateur de tendance principal (Jour) */}
        <TrendIndicator trend={mainTrend} size="sm" />

        {/* Grille des 3 autres tendances (Semaine, Mois, Année) */}
        <div className="mt-2 w-full">
          <div className="grid grid-cols-3 gap-1 max-w-[180px] mx-auto">
            <TrendBadge trend={otherTrends.week} period="week" />
            <TrendBadge trend={otherTrends.month} period="month" />
            <TrendBadge trend={otherTrends.year} period="year" />
          </div>
          <div className="grid grid-cols-3 gap-1 max-w-[180px] mx-auto mt-0.5">
            <span className="text-[6px] text-gray-400 text-center uppercase tracking-wider">Sem.</span>
            <span className="text-[6px] text-gray-400 text-center uppercase tracking-wider">Mois</span>
            <span className="text-[6px] text-gray-400 text-center uppercase tracking-wider">Ann.</span>
          </div>
        </div>
      </button>
    </div>
  );
});

InfoStat.displayName = "InfoStat";

export default InfoStat;