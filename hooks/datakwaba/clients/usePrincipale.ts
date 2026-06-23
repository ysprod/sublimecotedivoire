'use client';
import { initialCarto } from "@/lib/libs/constants";
import { valeurEntier } from "@/lib/libs/functions";
import { PeriodType } from "@/lib/libs/interface";
import { generateAllTrends } from "@/lib/libs/trends";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useCallback, useMemo, useState } from "react";
import { useSubMenuData } from "../useSubMenuData";

const PERIOD_MULTIPLIERS: Record<PeriodType, number> = {
  all: 1,
  week: 0.25,
  month: 0.5,
  year: 0.8,
};

export const usePrincipale = () => {
  const [activePeriod, setActivePeriod] = useState<PeriodType>('all');
  const currentItem = useMonEtoileStore((state) => state.currentItem);

  const mainItem = useMemo(() => {
    if (!currentItem) return null;
    return {
      ...currentItem,
      trends: currentItem.trends || generateAllTrends(currentItem.nbetablissements || 10000),
    };
  }, [currentItem]);

  const { submenutitems } = useSubMenuData(currentItem?.nbetablissements || 0);

  const adaptedMainItem = useMemo(() => {
    if (!mainItem) return null;

    const multiplier = PERIOD_MULTIPLIERS[activePeriod];
    const adaptedCount = Math.round(mainItem.nbetablissements * multiplier);
    const mainTrends = generateAllTrends(adaptedCount);

    return {
      ...mainItem,
      nbetablissements: adaptedCount,
      count: adaptedCount,
      title: `${adaptedCount} CLIENTS`,
      trends: mainTrends,
      trend: {
        value: mainTrends.week.value,
        direction: mainTrends.week.direction,
        label: mainTrends.week.label
      },
      trendValue: mainTrends.week.value,
    };
  }, [mainItem, activePeriod]);

  const periodMultiplier = PERIOD_MULTIPLIERS[activePeriod];
  const tpsglobal = useMemo(() => valeurEntier(initialCarto.tpsglobal), []);

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  return {
    mainMenuItem: adaptedMainItem, setActivePeriod, handleBack,
    periodMultiplier, submenutitems, tpsglobal, activePeriod,
  };
};