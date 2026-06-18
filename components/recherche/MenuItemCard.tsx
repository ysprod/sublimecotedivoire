'use client';

import { TITLE_SPLIT_REGEX } from "@/lib/libs/constants";
import type { MenuItem } from "@/lib/libs/interface";
import clsx from "clsx";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { memo, useCallback, useMemo } from "react";

// ============ TYPES ============
interface MenuItemCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
  className?: string;
  iconSize?: number;
  showTrend?: boolean;
}

interface TrendData {
  direction: 'up' | 'down' | 'stable';
  value: number;
  label: string;
}

// ============ CONSTANTES ============
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

// ============ FONCTIONS DE GÉNÉRATION DE TENDANCES ============
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
  };

  for (const [key, trendFn] of Object.entries(categoryTrends)) {
    if (title.includes(key)) {
      return trendFn(count);
    }
  }

  return null;
};

// ============ COMPOSANT TREND INDICATOR ============
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

// ============ COMPOSANT PRINCIPAL ============
const MenuItemCard = memo(({ 
  item, 
  onClick, 
  className, 
  iconSize = 80,
  showTrend = true 
}: MenuItemCardProps) => {
  
  // Génération des données de tendance (comme dans InfoStat)
  const trendData = useMemo<TrendData | null>(() => {
    if (!showTrend) return null;

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
      label: 'stable'
    };
  }, [item, showTrend]);

  // Tendance alternative (pour comparaison)
  const alternativeTrend = useMemo<TrendData | null>(() => {
    if (!trendData || trendData.direction === 'stable' || !showTrend) return null;

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
  }, [item.nbetablissements, trendData, showTrend]);

  // Rendu du titre formaté
  const defaultRenderTitle = useCallback((title: string) => {
    const [numberPart, ...textParts] = title.split(TITLE_SPLIT_REGEX);

    return (
      <div className="flex flex-col items-center justify-center text-center">
        <span className="text-blue-600 font-bold text-lg">
          {parseInt(numberPart)?.toLocaleString('fr-FR') || numberPart}
        </span>
        {textParts.length > 0 && (
          <span className="text-gray-700 text-xs font-medium">
            {textParts.join(' ')}
          </span>
        )}
      </div>
    );
  }, []);

  const handleClick = useCallback(() => { 
    onClick(item); 
  }, [item, onClick]);

  return (
    <motion.button
      onClick={handleClick}
      className={clsx(
        "p-4 flex flex-col items-center justify-center transition-all duration-300",
        "bg-white rounded-xl shadow-md hover:shadow-xl focus:outline-none",
        "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "border border-gray-100 hover:border-blue-200",
        className
      )}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`Accéder à ${item.title}`}
    >
      {/* Icône */}
      {item.icon && (
        <div className="relative mb-2">
          <Image 
            src={item.icon} 
            alt={item.title || "Menu item"} 
            width={iconSize} 
            height={iconSize}
            className="w-24 h-24 object-contain transition-transform duration-300 group-hover:scale-105" 
            priority={false}
            loading="lazy"
          />
        </div>
      )}

      {/* Titre et statistique */}
      {item.title && (
        <div className="text-center min-h-[50px] flex items-center justify-center">
          {defaultRenderTitle(item.title)}
        </div>
      )}

      {/* Indicateur de tendance principal */}
      {trendData && <TrendIndicator trend={trendData} size="sm" />}

      {/* Indicateur de tendance alternative (optionnel) */}
      {alternativeTrend && (
        <div className="mt-0.5">
          <TrendIndicator trend={alternativeTrend} size="sm" />
        </div>
      )}
    </motion.button>
  );
});

MenuItemCard.displayName = "MenuItemCard";

export default MenuItemCard;