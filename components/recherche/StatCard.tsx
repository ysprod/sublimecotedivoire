// app/recherche/components/StatCard.tsx
'use client';

import { CATEGORY_STYLES, TREND_CONFIG } from "@/hooks/datakwaba/recherche/useVert";
import { AllTrends, MenuItem, TrendData } from "@/lib/libs/interface";
import { PERIOD_SHORT, PERIODS } from "@/lib/libs/constants";
import clsx from "clsx";
import Image from "next/image";
import { memo, useCallback, useMemo } from "react";

// ============ SOUS-COMPOSANTS ============

const TrendBadge = memo(({ trend, period }: { trend: TrendData; period: keyof typeof PERIOD_SHORT }) => {
  const config = TREND_CONFIG[trend.direction];
  const Icon = config.icon;

  return (
    <div className={clsx(
      "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium",
      config.bgColor,
      config.color
    )}>
      <span className="font-bold text-[8px]">{PERIOD_SHORT[period]}</span>
      <Icon size={8} className="stroke-current" />
      <span className="font-semibold">
        {trend.value > 0 ? '+' : ''}{trend.value}%
      </span>
    </div>
  );
});

const TrendIndicator = memo(({ trend, size = 'md' }: { trend: TrendData; size?: 'sm' | 'md' }) => {
  const config = TREND_CONFIG[trend.direction];
  const Icon = config.icon;

  const sizeClasses = size === 'md'
    ? "px-3 py-1.5 text-xs"
    : "px-2 py-1 text-[10px]";

  return (
    <div className="flex flex-col items-center gap-1 mt-2">
      <div className={clsx(
        "flex items-center gap-1.5 rounded-full font-medium",
        sizeClasses,
        config.bgColor,
        config.color
      )}>
        <Icon size={size === 'md' ? 14 : 12} className="stroke-current" />
        <span className="font-semibold">
          {trend.value > 0 ? '+' : ''}{trend.value}%
        </span>
      </div>
      <span className="text-[9px] text-gray-500 uppercase tracking-wider font-medium">
        {trend.label}
      </span>
    </div>
  );
});

const PeriodGrid = memo(({ trends }: { trends: AllTrends }) => {
  const PERIOD_LABELS = {
    day: 'Jour',
    week: 'Sem.',
    month: 'Mois',
    year: 'Année'
  } as const;

  return (
    <div className="mt-4 w-full">
      <div className="grid grid-cols-4 gap-2 mx-auto">
        {PERIODS.map((period) => (
          <TrendBadge key={period} trend={trends[period]} period={period} />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2 mx-auto mt-1">
        {PERIODS.map((period) => (
          <span
            key={`label-${period}`}
            className="text-[6px] text-gray-400 text-center uppercase tracking-wider"
          >
            {PERIOD_LABELS[period]}
          </span>
        ))}
      </div>
    </div>
  );
});

// ============ COMPOSANT PRINCIPAL ============

interface StatCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
  className?: string;
  priority?: boolean;
}

export const StatCard = memo(({
  item,
  onClick,
  className,
  priority = false
}: StatCardProps) => {
  const mainTrend = useMemo<TrendData>(() => item.trends!.week, [item.trends]);
  const style = CATEGORY_STYLES[item.id === "etablissements" ? 'etablissements' : 'clients'];
  const formattedCount = useMemo(() => item.count.toLocaleString("fr-FR"), [item.count]);

  const handleClick = useCallback(() => {
    onClick(item);
  }, [onClick, item]);

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "group relative overflow-hidden bg-white p-6 rounded-2xl",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        "flex flex-col items-center text-center",
        "shadow-sm hover:shadow-xl border border-gray-100",
        className
      )}
      aria-label={`Accéder à ${item.title}`}
    >
      <div
        className={clsx(
          "absolute inset-0 opacity-0 group-hover:opacity-5",
          "bg-gradient-to-br",
          style.gradient
        )}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="flex items-center justify-center">
          <div className={clsx(
            "p-3 rounded-full",
            style.iconContainerBg
          )}>
            <Image
              src={item.iconSrc}
              alt={item.iconAlt || item.title}
              width={80}
              height={80}
              className="w-24 h-24 object-contain"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
              sizes="(max-width: 768px) 80px, 96px"
            />
          </div>
        </div>

        <div className="space-y-2 text-center w-full">
          <div>
            <span className="text-3xl font-black text-gray-900 tabular-nums">
              {formattedCount}
            </span>
          </div>

          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {item.title}
            <br />
            <span className="text-[10px] text-gray-400 font-normal">
              SUR TOUTE L'ETENDUE DU TERRITOIRE
            </span>
          </p>
        </div>

        <TrendIndicator trend={mainTrend} size="md" />
        <PeriodGrid trends={item.trends!} />
      </div>
    </button>
  );
});

StatCard.displayName = "StatCard";