// components/InfoStat.tsx
'use client';
import { STAT_LABEL_MAP } from "@/lib/libs/constants";
import type { MenuItem, TrendData } from "@/lib/libs/interface";
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

const TrendIndicator = memo(({ trend, size = 'sm' }: { trend: TrendData; size?: 'sm' | 'md' }) => {
  const config = TREND_CONFIG[trend.direction];
  const Icon = config.icon;

  const sizeClasses = size === 'md'
    ? "px-3 py-1.5 text-xs"
    : "px-2 py-1 text-[10px]";

  return (
    <div className="flex flex-col items-center gap-0.5 mt-1">
      <div className={clsx(
        "flex items-center gap-1 rounded-full font-medium",
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

const FormattedTitle = memo(({ 
  item, 
  inverse = false, 
  tpsglobal = 1 
}: { 
  item: MenuItem; 
  inverse?: boolean; 
  tpsglobal?: number;
}) => {
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

export const InfoStat = memo(({
  item,
  inverse = false,
  tpsglobal = 1,
  onClick
}: InfoStatProps) => {
  const trendData = useMemo<TrendData | null>(() => {
    if (item.trends) {
      const weekTrend = item.trends.week;
      return {
        direction: weekTrend.direction,
        value: weekTrend.value,
        label: `${TREND_CONFIG[weekTrend.direction].label} par rapport à la semaine dernière`
      };
    }
    if (item.trend) {
      return {
        direction: item.trend.direction,
        value: item.trend.value,
        label: `${TREND_CONFIG[item.trend.direction].label} par rapport à hier`
      };
    }
    return {
      direction: 'stable',
      value: 0,
      label: 'stable (données insuffisantes)'
    };
  }, [item]);

  const alternativeTrend = useMemo<TrendData | null>(() => {
    if (!item.trends) return null;
    const dayTrend = item.trends.day;
    if (dayTrend.direction === 'stable') return null;
    return {
      direction: dayTrend.direction,
      value: dayTrend.value,
      label: `${TREND_CONFIG[dayTrend.direction].label} par rapport à hier`
    };
  }, [item.trends]);

  const handleClick = useCallback(() => {
    if (onClick) onClick(item);
  }, [onClick, item]);

  return (
    <div className="relative w-full">
      <button
        onClick={handleClick}
        className="w-full flex flex-col items-center justify-center p-4 bg-white rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer border border-gray-100"
        aria-label={`Accéder à ${item.title || "cette information"}`}
      >
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

        <div className="text-xs font-semibold text-center whitespace-pre-line">
          <FormattedTitle item={item} inverse={inverse} tpsglobal={tpsglobal} />
        </div>

        {trendData && <TrendIndicator trend={trendData} size="sm" />}
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