import { AdaptedIndicators, MenuItem, PeriodType } from "@/lib/libs/interface";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useSubMenuData } from "./useSubMenuData";

const PERIOD_MULTIPLIERS: Record<PeriodType, number> = {
  all: 1,
  week: 0.25,
  month: 0.5,
  year: 0.8,
};

const ICONS = {
  ETABLISSEMENTS: "/icons/batiment.png",
  HOTELS: "/icons/hotel.png",
  RESIDENCES: "/icons/residence.png",
  MAISONS: "/icons/maisondhote.png",
} as const;

const createMenuItem = (
  baseTitle: string,
  count: number,
  icon: string,
  tpsglobal: number,
  blackicon?: string
): MenuItem => ({
  nbetablissements: count,
  title: `${count} ${baseTitle}`,
  icon,
  tpsglobal,
  blackicon: blackicon || icon,
  id: baseTitle.toLowerCase().replace(/\s/g, '_'),
  count,
  trendValue: 0,
  iconSrc: icon,
  iconAlt: `Icône ${baseTitle}`,
  color: "text-black",
  bgColor: "bg-white",
  description: baseTitle,
  trend: {
    value: 0,
    direction: 'stable' as const,
    label: 'stable'
  }
});

export const useAdaptedIndicators = (
  mainItem: MenuItem | null,
  subItems: MenuItem[],
  activePeriod: PeriodType
): AdaptedIndicators => {
  return useMemo(() => {
    const multiplier = PERIOD_MULTIPLIERS[activePeriod];

    if (!mainItem || !subItems.length) {
      return { mainItem: null, subItems: [] };
    }

    const adaptedSubItems = subItems.map(item => {
      const adaptedCount = Math.round(item.nbetablissements * multiplier);
      const titleParts = item.title?.split(' ') || [];
      const typeLabel = titleParts.slice(1).join(' ');

      return {
        ...item,
        nbetablissements: adaptedCount,
        title: `${adaptedCount} ${typeLabel}`,
        count: adaptedCount,
      };
    });

    const totalSubItemsSum = adaptedSubItems.reduce(
      (sum, item) => sum + (item.nbetablissements || 0),
      0
    );

    const adaptedMainItem: MenuItem = {
      ...mainItem,
      nbetablissements: totalSubItemsSum,
      title: `${totalSubItemsSum} ÉTABLISSEMENTS`,
      count: totalSubItemsSum,
    };

    return {
      mainItem: adaptedMainItem,
      subItems: adaptedSubItems,
    };
  }, [activePeriod, mainItem, subItems]);
};

export const usePrincipale = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activePeriod, setActivePeriod] = useState<PeriodType>('all');

  const currentItem = useMonEtoileStore((state) => state.currentItem);

  const [baseItems, setBaseItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const mainItem = createMenuItem(
      "ÉTABLISSEMENTS",
      (currentItem?.nbetablissements || 10000),
      ICONS.ETABLISSEMENTS, 1
    );
    setBaseItems([mainItem]);
  }, [currentItem?.nbetablissements]);

  const { submenutitems } = useSubMenuData(currentItem?.nbetablissements || 10000);

  const adaptedIndicators = useAdaptedIndicators(
    baseItems[0] || null,
    submenutitems,
    activePeriod
  );

  const handleBack = useCallback(() => {
    startTransition(() => {
      router.back();
    });
  }, [router]);

  const handleViewHotels = useCallback(() => {
    startTransition(() => {
      router.push(`/consulter/hotels/list?nbetablissements=${currentItem?.nbetablissements}`);
    });
  }, [currentItem?.nbetablissements, router]);

  return {
    handleBack, setActivePeriod, handleViewHotels,
    isViewHotelsLoading: isPending, adaptedIndicators, activePeriod,
  };
};