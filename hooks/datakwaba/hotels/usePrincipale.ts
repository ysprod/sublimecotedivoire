'use client';
import { AdaptedIndicators, MenuItem, PeriodType } from "@/lib/libs/interface";
import { generateAllTrends } from "@/lib/libs/trends";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { useSubMenuData } from "./useSubMenuData";

const PERIOD_MULTIPLIERS: Record<PeriodType, number> = {
  all: 1,
  week: 0.25,
  month: 0.5,
  year: 0.8,
};

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

    const mainTrends = generateAllTrends(totalSubItemsSum);

    const adaptedMainItem: MenuItem = {
      ...mainItem,
      nbetablissements: totalSubItemsSum,
      title: `${totalSubItemsSum} ÉTABLISSEMENTS`,
      count: totalSubItemsSum,
      trends: mainTrends,
      trend: {
        value: mainTrends.week.value,
        direction: mainTrends.week.direction,
        label: mainTrends.week.label
      },
      trendValue: mainTrends.week.value,
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
  const { submenutitems } = useSubMenuData(currentItem?.nbetablissements || 10000);

  const adaptedIndicators = useAdaptedIndicators(
    currentItem || null,
    submenutitems,
    activePeriod
  );

  const handleRapportClick = useCallback(() => {
    router.push('/consulter/hotels/rapport');
  }, [router]);

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
    handleBack, setActivePeriod, handleViewHotels, isViewHotelsLoading: isPending,
     adaptedIndicators, activePeriod,handleRapportClick,
  };
};