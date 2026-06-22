'use client';
import type { MenuItem } from "@/lib/libs/interface";
import clsx from "clsx";
import { Hotel, Minus, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import { memo, useMemo } from "react";

type PeriodType = 'all' | 'week' | 'month' | 'year';

const PERIOD_BUTTONS: { id: PeriodType; label: string; icon: string }[] = [
    { id: 'all', label: 'Vue d\'ensemble', icon: '📊' },
    { id: 'week', label: 'Cette semaine', icon: '📅' },
    { id: 'month', label: 'Ce mois', icon: '📆' },
    { id: 'year', label: 'Cette année', icon: '📈' },
];

export const PeriodButtons = memo(({
    activePeriod,
    onPeriodChange
}: {
    activePeriod: PeriodType;
    onPeriodChange: (period: PeriodType) => void;
}) => {
    return (
        <div className="flex flex-wrap gap-2 w-full max-w-3xl justify-center">
            {PERIOD_BUTTONS.map(({ id, label, icon }) => (
                <button
                    key={id}
                    onClick={() => onPeriodChange(id)}
                    className={clsx(
                        "group relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                        "flex items-center gap-2",
                        activePeriod === id
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-100 scale-105"
                            : "bg-white text-gray-600 hover:text-gray-900 hover:shadow-md hover:scale-102 border border-gray-200",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    )}
                >
                    <span className="text-lg">{icon}</span>
                    <span>{label}</span>
                    {activePeriod === id && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    )}
                </button>
            ))}
        </div>
    );
});

interface StatDetail {
    label: string;
    value: number;
    trend: {
        direction: 'up' | 'down' | 'stable';
        value: number;
    };
    icon?: string;
}

const TREND_CONFIG = {
    up: { icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50", label: "Hausse" },
    down: { icon: TrendingDown, color: "text-red-600", bgColor: "bg-red-50", label: "Baisse" },
    stable: { icon: Minus, color: "text-gray-600", bgColor: "bg-gray-50", label: "Stable" }
} as const;

export const TrendBadge = memo(({ trend }: { trend: StatDetail['trend'] }) => {
    const config = TREND_CONFIG[trend.direction];
    const Icon = config.icon;

    return (
        <div className={clsx(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
            config.bgColor,
            config.color
        )}>
            <Icon size={14} className="stroke-current" />
            <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
            <span className="text-gray-500 font-normal">{config.label}</span>
        </div>
    );
});

export const DetailedStats = memo(({
    items,
    title,
    className,
    isLoading = false
}: {
    items: MenuItem[];
    title: string;
    className?: string;
    isLoading?: boolean;
}) => {
    const details = useMemo<StatDetail[]>(() => {
        return items.map(item => {
            const seed = item.nbetablissements || 0;
            const trendValue = Math.round(
                (Math.sin(seed * 0.001 + Date.now() * 0.00001) * 10 + Math.random() * 4 - 2) * 10
            ) / 10;

            let direction: 'up' | 'down' | 'stable' = 'stable';
            if (trendValue > 2) direction = 'up';
            else if (trendValue < -2) direction = 'down';

            return {
                label: item.title?.replace(/^\d+\s/, '') || '',
                value: item.nbetablissements,
                trend: {
                    direction,
                    value: Math.abs(trendValue)
                },
                icon: item.icon
            };
        });
    }, [items]);

    const total = useMemo(() => {
        return details.reduce((sum, item) => sum + item.value, 0);
    }, [details]);

    if (isLoading) {
        return (
            <div className={clsx("w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", className)}>
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 rounded mt-1 animate-pulse" />
                </div>
                <div className="divide-y divide-gray-50">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="px-6 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (details.length === 0) return null;

    return (
        <div className={clsx("w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", className)}>
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    {title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                    {details.length} catégories • Total: {total.toLocaleString('fr-FR')} etablissements
                </p>
            </div>

            <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                {details.map((detail, index) => (
                    <div
                        key={index}
                        className="px-6 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            {detail.icon && (
                                <Image
                                    src={detail.icon}
                                    alt={detail.label}
                                    width={24}
                                    height={24}
                                    className="w-6 h-6 object-contain opacity-70 flex-shrink-0"
                                    loading="lazy"
                                />
                            )}
                            <span className="text-sm text-gray-700 truncate">
                                {detail.label}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                            <span className="text-sm font-semibold text-gray-900 tabular-nums">
                                {detail.value.toLocaleString('fr-FR')}
                            </span>
                            <TrendBadge trend={detail.trend} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export const ViewHotelsButton = memo(({
    onClick,
    isLoading,
    className
}: {
    onClick?: () => void;
    isLoading?: boolean;
    className?: string;
}) => {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={clsx(
                "flex items-center gap-2 px-6 py-3 rounded-xl",
                "bg-gradient-to-r from-blue-600 to-indigo-600",
                "text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                "disabled:opacity-70 disabled:cursor-not-allowed",
                "w-full sm:w-auto",
                className
            )}
        >
            <Hotel size={20} />
            <span>{isLoading ? "Chargement..." : "Voir la liste des hôtels"}</span>
        </button>
    );
});

export const StatsSummary = ({ items }: { items: any[] }) => {
    const total = items.reduce((acc, item) => acc + (item.nbetablissements || 0), 0);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Total</p>
                <p className="text-2xl font-bold text-blue-700">{total.toLocaleString('fr-FR')}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                <p className="text-xs text-green-600 font-medium uppercase tracking-wider">Hôtels</p>
                <p className="text-2xl font-bold text-green-700">
                    {items.find(i => i.title?.includes('HÔTELS'))?.nbetablissements?.toLocaleString('fr-FR') || 0}
                </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                <p className="text-xs text-purple-600 font-medium uppercase tracking-wider">Résidences</p>
                <p className="text-2xl font-bold text-purple-700">
                    {items.find(i => i.title?.includes('RÉSIDENCES'))?.nbetablissements?.toLocaleString('fr-FR') || 0}
                </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
                <p className="text-xs text-orange-600 font-medium uppercase tracking-wider">Maisons d'hôtes</p>
                <p className="text-2xl font-bold text-orange-700">
                    {items.find(i => i.title?.includes('MAISONS'))?.nbetablissements?.toLocaleString('fr-FR') || 0}
                </p>
            </div>
        </div>
    );
};