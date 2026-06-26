'use client';
import { PERIOD_LABELS, PERIODS } from "@/lib/libs/constants";
import { getRandomCount } from "@/lib/libs/functions";
import type { AllTrends, CategoryStyle, MenuItem, TrendConfig, TrendDirection } from "@/lib/libs/interface";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";

export const TREND_CONFIG: Record<TrendDirection, TrendConfig> = {
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

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
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

const PERIOD_CONFIG = {
    day: { min: -15, max: 15, threshold: 3 },
    week: { min: -25, max: 25, threshold: 5 },
    month: { min: -40, max: 40, threshold: 8 },
    year: { min: -60, max: 60, threshold: 10 }
} as const;

const ROUTE_MAP: Record<string, string> = {
    etablissements: '/consulter/hotels',
    clients: '/consulter/clients',
};

interface MenuItemConfig {
    id: string;
    title: string;
    iconSrc: string;
    iconAlt: string;
    color: string;
    bgColor: string;
    description: string;
}

const MENU_ITEMS_CONFIG: Record<string, MenuItemConfig> = {
    ETABLISSEMENTS: {
        id: "etablissements",
        title: "ÉTABLISSEMENTS",
        iconSrc: "/icons/batiment.png",
        iconAlt: "Icône établissements",
        color: "text-black",
        bgColor: "bg-white",
        description: "Hôtels, résidences et maisons d'hôtes"
    },
    CLIENTS: {
        id: "clients",
        title: "CLIENTS",
        iconSrc: "/icons/lesclients.png",
        iconAlt: "Icône clients",
        color: "text-black",
        bgColor: "bg-white",
        description: "Touristes et visiteurs"
    }
} as const;

interface Stats {
    totalEtablissements: number;
    clientsCount: number;
}

const generateStats = (): Stats => {
    const hotelsCount = getRandomCount(10000, 40000);
    const residencesCount = Math.floor(hotelsCount * getRandomCount(30, 50) / 100);
    const maisonsCount = Math.floor(hotelsCount * getRandomCount(10, 20) / 100);
    const totalEtablissements = hotelsCount + residencesCount + maisonsCount;

    const hommesCount = getRandomCount(200000, 1000000);
    const femmesCount = getRandomCount(100000, 800000);
    const clientsCount = hommesCount + femmesCount;

    return { totalEtablissements, clientsCount };
};

export const generateTrendValue = (
    baseValue: number,
    period: keyof typeof PERIOD_CONFIG
): number => {
    const factor = PERIOD_CONFIG[period];
    const variation = (Math.sin(baseValue * 0.1 + Math.random() * 0.5) * factor.max * 0.5) +
        (Math.random() * (factor.max - factor.min) + factor.min);
    return Math.round(variation * 10) / 10;
};

export const getTrendDirection = (
    value: number,
    period: keyof typeof PERIOD_CONFIG
): TrendDirection => {
    const threshold = PERIOD_CONFIG[period].threshold;

    if (value > threshold) return 'croissance';
    if (value < -threshold) return 'baisse';
    return 'stable';
};

export const generateAllTrends = (baseValue: number): AllTrends => {
    const result = {} as AllTrends;

    for (const period of PERIODS) {
        const value = generateTrendValue(baseValue, period);
        const direction = getTrendDirection(value, period);
        const absValue = Math.abs(value);
        const sign = direction === 'croissance' ? '+' : '';

        result[period] = {
            direction,
            value: absValue,
            label: `${sign}${absValue}% ${PERIOD_LABELS[period]}`
        };
    }

    return result;
};

interface BuildMenuItemParams {
    config: MenuItemConfig;
    count: number;
    trends: AllTrends;
}

const buildMenuItem = ({ config, count, trends }: BuildMenuItemParams): MenuItem => ({
    ...config,
    count,
    nbetablissements: count,
    trends,
    trend: {
        value: trends.week.value,
        direction: trends.week.direction,
        label: trends.week.label
    },
    trendValue: trends.week.value,
    icon: config.iconSrc,
});

export const useVert = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const setCurrentItem = useMonEtoileStore((state) => state.setCurrentItem);
    const setEtablissementItem = useMonEtoileStore((state) => state.setEtablissementItem);
    const setClientItem = useMonEtoileStore((state) => state.setClientItem);

    const dashboardData = useMemo<MenuItem[]>(() => {
        const { totalEtablissements, clientsCount } = generateStats();

        const etablissementsTrends = generateAllTrends(totalEtablissements);
        const clientsTrends = generateAllTrends(clientsCount);

        const etablissementMenuItem = buildMenuItem({
            config: MENU_ITEMS_CONFIG.ETABLISSEMENTS,
            count: totalEtablissements,
            trends: etablissementsTrends,
        });

        const clientMenuItem = buildMenuItem({
            config: MENU_ITEMS_CONFIG.CLIENTS,
            count: clientsCount,
            trends: clientsTrends,
        });

        setEtablissementItem(etablissementMenuItem);
        setClientItem(clientMenuItem);

        return [
            etablissementMenuItem,
            clientMenuItem
        ];
    }, [setEtablissementItem, setClientItem]);

    const handleCardClick = useCallback((item: MenuItem) => {
        startTransition(() => {
            setCurrentItem(item);

            const basePath = ROUTE_MAP[item.id] || '/consulter';
            router.push(basePath);
        });
    }, [router, setCurrentItem]);

    return {
        handleCardClick,
        dashboardData,
        isPending,
    };
};

export const getPeriodLabel = (period: keyof typeof PERIOD_LABELS): string => {
    return PERIOD_LABELS[period];
};

export const getPeriodShortLabel = (period: keyof typeof PERIOD_LABELS): string => {
    const shortLabels = {
        day: 'J',
        week: 'S',
        month: 'M',
        year: 'A'
    };
    return shortLabels[period];
};

export const getTrendIcon = (direction: TrendDirection) => {
    return TREND_CONFIG[direction].icon;
};

export const getTrendColor = (direction: TrendDirection) => {
    return TREND_CONFIG[direction].color;
};

export const getTrendBgColor = (direction: TrendDirection) => {
    return TREND_CONFIG[direction].bgColor;
};

export const getTrendLabel = (direction: TrendDirection) => {
    return TREND_CONFIG[direction].label;
};