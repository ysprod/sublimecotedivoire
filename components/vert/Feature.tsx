'use client';
import { TREND_CONFIG } from "@/hooks/datakwaba/useVert";
import { AllTrends, TrendData } from "@/lib/libs/interface";
import clsx from "clsx";
import { ZoomIn } from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import CacheLink from "../commons/CacheLink";

const PERIOD_SHORT = {
    day: 'J',
    week: 'S',
    month: 'M',
    year: 'A'
} as const;

const PERIOD_LABELS = {
    day: 'Jour',
    week: 'Sem.',
    month: 'Mois',
    year: 'Année'
} as const;

export const TrendBadge = memo(({
    trend,
    period
}: {
    trend: TrendData;
    period: keyof typeof PERIOD_SHORT;
}) => {
    const config = TREND_CONFIG[trend.direction];
    const Icon = config.icon;

    return (
        <div className={clsx(
            "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium transition-all duration-200",
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

export const TrendIndicator = memo(({ trend, size = 'md' }: { trend: TrendData; size?: 'sm' | 'md' }) => {
    const config = TREND_CONFIG[trend.direction];
    const Icon = config.icon;

    const sizeClasses = size === 'md'
        ? "px-3 py-1.5 text-xs"
        : "px-2 py-1 text-[10px]";

    return (
        <div className="flex flex-col items-center gap-1 mt-2">
            <div className={clsx(
                "flex items-center gap-1.5 rounded-full font-medium transition-all duration-200",
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

export const PeriodGrid = memo(({ trends }: { trends: AllTrends }) => {
    const periods = ['day', 'week', 'month', 'year'] as const;

    return (
        <div className="mt-4 w-full">
            <div className="grid grid-cols-4 gap-2 mx-auto ">
                {periods.map((period) => (
                    <TrendBadge
                        key={period}
                        trend={trends[period]}
                        period={period}
                    />
                ))}
            </div>
            <div className="grid grid-cols-4 gap-2 mx-auto  mt-1">
                {periods.map((period) => (
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

export function CorporateMapImage() {

    return (
        <div className="mt-8 flex w-full justify-center sm:mt-10">
            <div className="relative flex justify-center">
                <div className="absolute inset-0 rounded-full bg-orange-300/20 blur-3xl" aria-hidden="true" />
                <Image
                    src="/carteverte.png"
                    alt="Carte du tourisme en Côte d'Ivoire"
                    width={260}
                    height={260}
                    priority
                    className="relative h-auto w-[240px] drop-shadow-2xl sm:w-[260px] md:w-[300px]"
                />
            </div>
        </div>
    );
}

export function ActionButton() {

    return (
        <div className="text-center mb-16">
            <span className="group relative mt-6 inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-green-800 bg-[length:200%_100%] px-6 py-3 text-base font-bold text-white shadow-xl transition-all duration-300 hover:bg-[position:100%_0] hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] sm:gap-3 sm:px-8 sm:py-3.5 sm:text-lg cursor-pointer">
                <span className="relative z-10 flex items-center gap-2">
                    Consulter les données par région, département et commune
                    <ZoomIn className="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
                </span>
            </span>
        </div>
    );
}

export function Bouton() {

    return (
        <div className="mx-auto max-w-4xl p-2">
            <CacheLink href="/recherche" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-2xl">
                <CorporateMapImage />
                <ActionButton />
            </CacheLink>
        </div>
    );
}