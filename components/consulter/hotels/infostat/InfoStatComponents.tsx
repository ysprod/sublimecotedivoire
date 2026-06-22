'use client';
import { ETAB_STAT_LABEL_MAP } from "@/lib/libs/constants";
import type { MenuItem, TrendData } from "@/lib/libs/interface";
import { useMemo } from "react";
import { PERIOD_CONFIG, TREND_CONFIG } from "./InfoStat.types";

interface TrendBadgeProps {
  trend: TrendData;
  period: keyof typeof PERIOD_CONFIG;
}

export const TrendBadge = ({ trend, period }: TrendBadgeProps) => {
  const config = TREND_CONFIG[trend.direction];
  const periodInfo = PERIOD_CONFIG[period];

  return (
    <div className={`flex items-center justify-center gap-1 px-1 py-0.5 rounded border border-gray-100 text-[9px] font-medium ${config.bgColor} ${config.color}`}>
      <span className="font-bold text-[8px] opacity-70">{periodInfo.short}</span>
      <span className="font-semibold">
        {trend.direction === 'croissance' ? '+' : ''}{trend.value}%
      </span>
    </div>
  );
};

interface TrendIndicatorProps {
  trend: TrendData;
}

export const TrendIndicator = ({ trend }: TrendIndicatorProps) => {
  const config = TREND_CONFIG[trend.direction];

  return (
    <div className="flex flex-col items-center gap-1 mt-2">
      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${config.bgColor} ${config.color}`}>
        <span>{trend.direction === 'croissance' ? '▲' : trend.direction === 'baisse' ? '▼' : '■'}</span>
        <span>{trend.direction === 'croissance' ? '+' : ''}{trend.value}%</span>
      </div>

      <span className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold">
        {trend.label}
      </span>
    </div>
  );
};

interface FormattedTitleProps {
  item: MenuItem;
  inverse?: boolean;
  tpsglobal?: number;
}

export const FormattedTitle = ({ item, inverse = false, tpsglobal = 1 }: FormattedTitleProps) => {
  const formattedContent = useMemo(() => {
    if (!item.title) return null;

    const match = item.title.match(/^(\d+)\s(.+)$/);
    if (!match) return <span className="text-gray-900">{item.title}</span>;

    const numberPart = match[1];
    const textPart = match[2];
    const modifiedText = ETAB_STAT_LABEL_MAP[tpsglobal] || "";

    return (
      <>
        <span className="text-gray-600 block text-[11px] font-medium uppercase tracking-wide">
          {inverse ? numberPart : textPart}
        </span>
        <span className="text-blue-600 font-extrabold text-lg block mt-0.5">
          {inverse ? textPart : numberPart}
          {!inverse && modifiedText && ` ${modifiedText}`}
        </span>
      </>
    );
  }, [item.title, inverse, tpsglobal]);

  return formattedContent;
};