'use client';
import type { PeriodType } from "@/lib/libs/interface";
import clsx from "clsx";
import { Building2, Home, Hotel } from "lucide-react";
import { memo } from "react";

type EtablissementType = 'hotels' | 'residences' | 'maisons' | null;

interface PeriodData {
    label: string;
    value: number;
    trend: {
        direction: 'croissance' | 'baisse' | 'stable';
        value: number;
        label: string;
    };
}

const PERIOD_BUTTONS: { id: PeriodType; label: string; icon: string }[] = [
    { id: 'all', label: 'Toutes périodes', icon: '📊' },
    { id: 'week', label: 'Cette semaine', icon: '📅' },
    { id: 'month', label: 'Ce mois', icon: '📆' },
    { id: 'year', label: 'Cette année', icon: '📈' },
];

const ETABLISSEMENT_BUTTONS = [
    { id: 'hotels', label: 'Hôtels', icon: Hotel, color: 'from-blue-500 to-blue-600' },
    { id: 'residences', label: 'Résidences', icon: Building2, color: 'from-purple-500 to-purple-600' },
    { id: 'maisons', label: 'Maisons d\'hôtes', icon: Home, color: 'from-emerald-500 to-emerald-600' },
] as const;

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
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        activePeriod === id
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                >
                    <span className="mr-1">{icon}</span>
                    {label}
                </button>
            ))}
        </div>
    );
});

export const EtablissementTypeButtons = memo(({
    activeType,
    onTypeChange
}: {
    activeType: EtablissementType;
    onTypeChange: (type: EtablissementType) => void;
}) => {
    return (
        <div className="flex flex-wrap gap-3 w-full max-w-3xl justify-center">
            {ETABLISSEMENT_BUTTONS.map(({ id, label, icon: Icon, color }) => (
                <button
                    key={id}
                    onClick={() => onTypeChange(activeType === id ? null : id)}
                    className={clsx(
                        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        activeType === id
                            ? `bg-gradient-to-r ${color} text-white shadow-md scale-105`
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                    )}
                >
                    <Icon size={18} />
                    {label}
                </button>
            ))}
            {activeType && (
                <button
                    onClick={() => onTypeChange(null)}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                    ✕ Tout voir
                </button>
            )}
        </div>
    );
});

export const PeriodStats = memo(({ data }: { data: PeriodData }) => {
    return (
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{data.label}</span>
                <span className="text-2xl font-bold text-gray-900">
                    {data.value.toLocaleString('fr-FR')}
                </span>
            </div>
            
            <div className="mt-2 flex items-center gap-2">
                <span className={clsx(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    data.trend.direction === 'croissance' ? "text-green-600 bg-green-100" :
                        data.trend.direction === 'baisse' ? "text-red-600 bg-red-100" :
                            "text-gray-600 bg-gray-100"
                )}>
                    {data.trend.direction === 'croissance' ? '↑' : data.trend.direction === 'baisse' ? '↓' : '→'}
                    {data.trend.value}%
                </span>
                <span className="text-xs text-gray-400">{data.trend.label}</span>
            </div>
        </div>
    );
});