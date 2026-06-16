'use client';
import { MenuItem } from "@/hooks/datakwaba/useVert";
import clsx from "clsx";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import { memo, useCallback, useMemo } from "react";

interface StatCardProps {
    item: MenuItem;
    onClick: (item: MenuItem) => void;
    className?: string;
    priority?: boolean;
}

interface TrendData {
    direction: 'croissance' | 'baisse' | 'stable';
    value: number;
    label: string;
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

const CATEGORY_STYLES = {
    etablissements: {
        color: "text-blue-600",
        bgColor: "bg-white",
        borderColor: "border-blue-200",
        iconContainerBg: "bg-white",
        gradient: "from-blue-500 via-purple-500 to-pink-500"
    },
    clients: {
        color: "text-purple-600",
        bgColor: "bg-white",
        borderColor: "border-purple-200",
        iconContainerBg: "bg-white",
        gradient: "from-purple-500 via-pink-500 to-rose-500"
    }
} as const;

const TrendIndicator = memo(({ trend }: { trend: TrendData }) => {
    const config = TREND_CONFIG[trend.direction];
    const Icon = config.icon;

    return (
        <div className="flex flex-col items-center gap-1 mt-2">
            <div className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                config.bgColor,
                config.color
            )}>
                <Icon size={14} className="stroke-current" />
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

const StatCard = memo(({
    item,
    onClick,
    className,
    priority = false
}: StatCardProps) => {

    const trendData = useMemo<TrendData>(() => {
        const direction = item.trend === "croissance"
            ? "croissance"
            : item.trend === "baisse"
                ? "baisse"
                : "stable";

        const label = TREND_CONFIG[direction].label;

        return {
            direction,
            value: item.trendValue,
            label: `${label} par rapport à hier`
        };
    }, [item.trend, item.trendValue]);

    const style = useMemo(() => {
        return item.id === "etablissements"
            ? CATEGORY_STYLES.etablissements
            : CATEGORY_STYLES.clients;
    }, [item.id]);

    const handleClick = useCallback(() => {
        onClick(item);
    }, [onClick, item]);

    const formattedCount = useMemo(() => {
        return item.count.toLocaleString("fr-FR");
    }, [item.count]);

    return (
        <button
            onClick={handleClick}
            className={clsx(
                "group relative overflow-hidden bg-white p-6",
                "hover:scale-[1.02] transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                "flex flex-col items-center text-center",
                className
            )}
            aria-label={`Accéder à ${item.title}`}
        >
            <div
                className={clsx(
                    "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300",
                    "bg-gradient-to-br",
                    style.gradient
                )}
                aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center w-full">
                <div className="flex items-center justify-center">
                    <div className={clsx(
                        "p-3 rounded-full transition-all duration-300 group-hover:scale-105",
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
                <TrendIndicator trend={trendData} />
            </div>
        </button>
    );
});

export default StatCard;