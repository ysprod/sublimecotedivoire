'use client';
import { CATEGORY_STYLES, generateAllTrends } from "@/hooks/datakwaba/useVert";
import { AllTrends, MenuItem, TrendData } from "@/lib/libs/interface";
import clsx from "clsx";
import Image from "next/image";
import { memo, useCallback, useMemo } from "react";
import { PeriodGrid, TrendIndicator } from "./Feature";

interface StatCardProps {
    item: MenuItem;
    onClick: (item: MenuItem) => void;
    className?: string;
    priority?: boolean;
}

const StatCard = memo(({
    item,
    onClick,
    className,
    priority = false
}: StatCardProps) => {
    const allTrends = useMemo<AllTrends>(() => {
        if (item.trends) {
            return item.trends;
        }
        return generateAllTrends(item.count || 1000);
    }, [item]);

    const mainTrend = useMemo<TrendData>(() => allTrends.week, [allTrends]);

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
                "group relative overflow-hidden bg-white p-6 rounded-2xl",
                "hover:scale-[1.02] transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                "flex flex-col items-center text-center",
                "shadow-sm hover:shadow-xl border border-gray-100",
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

                <TrendIndicator trend={mainTrend} size="md" />

                <PeriodGrid trends={allTrends} />
            </div>
        </button>
    );
});

export default StatCard;