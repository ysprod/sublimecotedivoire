'use client';
import { PeriodType } from "@/lib/libs/interface";
import { generateAllTrends } from "@/lib/libs/trends";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useSubMenuData } from "../commons/useSubMenuData";

const PERIOD_MULTIPLIERS: Record<PeriodType, number> = {
  all: 1,
  week: 0.25,
  month: 0.5,
  year: 0.8,
};

export const usePrincipale = () => {
  const router = useRouter();

  const [activePeriod, setActivePeriod] = useState<PeriodType>('all');

  const clientItem = useMonEtoileStore((state) => state.clientItem);

  const mainItem = useMemo(() => {
    if (!clientItem) return null;
    return {
      ...clientItem,
      trends: clientItem.trends || generateAllTrends(clientItem.nbetablissements || 10000),
    };
  }, [clientItem]);

  const { submenutitems } = useSubMenuData(clientItem?.nbetablissements || 0);

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
        label: mainTrends.week.label,
      },
      trendValue: mainTrends.week.value,
    };
  }, [mainItem, activePeriod]);

  const periodMultiplier = PERIOD_MULTIPLIERS[activePeriod];

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleRapportClick = useCallback(() => {
    router.push('/consulter/clients/rapport');
  }, [router]);

  return {
    activePeriod, setActivePeriod, mainMenuItem: adaptedMainItem,
    submenutitems, handleBack, handleRapportClick, periodMultiplier, tpsglobal: 0,
  };
};