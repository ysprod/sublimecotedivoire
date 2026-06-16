'use client';
import { useCallback, useMemo } from "react";
import { getRandomCount, getRandomTrendSimple, TrendType } from "@/lib/libs/functions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export interface MenuItem {
    id: string;
    title: string;
    count: number;
    trend: TrendType;
    trendValue: number;
    iconSrc: string;
    iconAlt: string;
    color: string;
    bgColor: string;
    description: string;
}

const MENU_ITEMS_CONFIG = {
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

const generateStats = () => {
    const hotelsCount = getRandomCount(2000, 20000);
    const residencesCount = Math.floor(hotelsCount * getRandomCount(30, 50) / 100);
    const maisonsCount = Math.floor(hotelsCount * getRandomCount(10, 20) / 100);
    const totalEtablissements = hotelsCount + residencesCount + maisonsCount;

    const hommesCount = getRandomCount(2000, 10000);
    const femmesCount = getRandomCount(1000, 8000);
    const clientsCount = hommesCount + femmesCount;

    return { totalEtablissements, clientsCount };
};

export const useVert = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const dashboardData = useMemo(() => {
        const { totalEtablissements, clientsCount } = generateStats();

        const etablissementsTrend = getRandomTrendSimple();
        const clientsTrend = getRandomTrendSimple();

        return [
            {
                ...MENU_ITEMS_CONFIG.ETABLISSEMENTS,
                count: totalEtablissements,
                trend: etablissementsTrend.trend,
                trendValue: etablissementsTrend.value,
            },
            {
                ...MENU_ITEMS_CONFIG.CLIENTS,
                count: clientsCount,
                trend: clientsTrend.trend,
                trendValue: clientsTrend.value,
            }
        ];
    }, []);

    const handleCardClick = useCallback((item: MenuItem) => {
        startTransition(() => {
            const searchParams = new URLSearchParams({
                tpsglobal: item.id,
                ...(item.id === "etablissements" && { type: "etablissements" })
            });

            const basePath = item.id === "etablissements"
                ? "/consulter/etablissements"
                : "/consulter";

            router.push(`${basePath}?${searchParams.toString()}`);
        });
    }, [router]);

    return { handleCardClick, dashboardData, isPending, };
}; 