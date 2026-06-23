'use client';
import { initialCarto } from "@/lib/libs/constants";
import { valeurEntier } from "@/lib/libs/functions";
import { MenuItem } from "@/lib/libs/interface";
import { generateAllTrends } from "@/lib/libs/trends";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";
import { useSubMenuData } from "../../useSubMenuData";

const NATIONALITIES = [
  { id: 'civ', label: 'CÔTE D\'IVOIRE', icon: '/icons/nationaux.png', percentage: 0.40 },
  { id: 'mali', label: 'MALI', icon: '/icons/etranger.png', percentage: 0.15 },
  { id: 'senegal', label: 'SÉNÉGAL', icon: '/icons/etranger.png', percentage: 0.12 },
  { id: 'guinee', label: 'GUINÉE', icon: '/icons/etranger.png', percentage: 0.10 },
  { id: 'autre', label: 'AUTRE', icon: '/icons/lesclients.png', percentage: 0.23 },
] as const;

const createNationaliteItem = (
  baseTitle: string,
  count: number,
  icon: string,
  tpsglobal: number,
  blackicon: string
): MenuItem => {
  const trends = generateAllTrends(count);

  return {
    nbetablissements: count,
    title: `${count} ${baseTitle}`,
    icon,
    tpsglobal,
    blackicon,
    id: baseTitle.toLowerCase().replace(/\s/g, '_'),
    count,
    trendValue: trends.week.value,
    iconSrc: icon,
    iconAlt: `Icône ${baseTitle}`,
    color: "text-black",
    bgColor: "bg-white",
    description: baseTitle,
    trends,
    trend: {
      value: trends.week.value,
      direction: trends.week.direction,
      label: trends.week.label
    }
  };
};

export const usePrincipale = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentItem = useMonEtoileStore((state) => state.currentItem);

  const tpsglobal = useMemo(() => valeurEntier(initialCarto.tpsglobal), []);

  const nationaliteItems = useMemo(() => {
    if (!currentItem) return [];

    const totalClients = currentItem.nbetablissements || 0;

    return NATIONALITIES.map((nat, index) => {
      const count = Math.round(totalClients * nat.percentage);
      const tpsglobal = 7 + index; // 7, 8, 9, 10, 11
      
      return createNationaliteItem(
        nat.label,
        count,
        nat.icon,
        tpsglobal,
        nat.icon
      );
    });
  }, [currentItem]);

  const { submenutitems } = useSubMenuData(currentItem?.nbetablissements || 0);

  // ✅ Construction du mainMenuItem
  const mainMenuItem = useMemo(() => {
    if (!currentItem) return null;
    
    const total = currentItem.nbetablissements || 0;
    const mainTrends = generateAllTrends(total);

    return {
      ...currentItem,
      nbetablissements: total,
      count: total,
      title: `${total} CLIENTS`,
      trends: mainTrends,
      trend: {
        value: mainTrends.week.value,
        direction: mainTrends.week.direction,
        label: mainTrends.week.label
      },
      trendValue: mainTrends.week.value,
    };
  }, [currentItem]);

  const handleBackClick = useCallback(() => {
    startTransition(() => {
      router.back();
    });
  }, [router]);

  return {
    handleBackClick,
    submenutitems,
    tpsglobal,
    mainMenuItem,
    nationaliteItems,
    isPending,
  };
};