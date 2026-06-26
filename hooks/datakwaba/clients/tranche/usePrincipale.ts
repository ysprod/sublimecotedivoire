'use client';
import { MenuItem, PeriodType } from "@/lib/libs/interface";
import { generateAllTrends } from "@/lib/libs/trends";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useSubMenuData } from "../../commons/useSubMenuData";

const PERIOD_MULTIPLIERS: Record<PeriodType, number> = {
  all: 1,
  week: 0.25,
  month: 0.5,
  year: 0.8,
};

const AGE_GROUPS = [
  {
    id: '18-25',
    label: '18-25 ANS',
    icon: '/icons/tranche1.png',
    percentage: 0.20
  },
  {
    id: '26-35',
    label: '26-35 ANS',
    icon: '/icons/tranche2.png',
    percentage: 0.30
  },
  {
    id: '36-50',
    label: '36-50 ANS',
    icon: '/icons/tranche3.png',
    percentage: 0.25
  },
  {
    id: '50+',
    label: '50+ ANS',
    icon: '/icons/tranche4.png',
    percentage: 0.25
  },
] as const;

const AGE_COLORS = {
  '18-25': { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-400' },
  '26-35': { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-400' },
  '36-50': { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-400' },
  '50+': { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-400' },
} as const;

const getAgeColors = (id: string) => {
  return AGE_COLORS[id as keyof typeof AGE_COLORS] || AGE_COLORS['18-25'];
};

const createAgeGroupItem = (
  baseTitle: string,
  count: number,
  tpsglobal: number,
  iconPath: string,
  ageId: string
): MenuItem => {
  const trends = generateAllTrends(count);
  const colors = getAgeColors(ageId);

  return {
    nbetablissements: count,
    title: `${count} ${baseTitle}`,
    icon: iconPath,
    tpsglobal,
    blackicon: iconPath,
    id: baseTitle.toLowerCase().replace(/\s/g, '_'),
    count,
    trendValue: trends.week.value,
    iconSrc: iconPath,
    iconAlt: `Icône ${baseTitle}`,
    color: colors.text,
    bgColor: colors.bg,
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

  const currentItem = useMonEtoileStore((state) => state.clientItem);

  const ageGroupItems = useMemo(() => {
    if (!currentItem) return [];

    const totalClients = currentItem.nbetablissements || 0;

    return AGE_GROUPS.map((ageGroup, index) => {
      const count = Math.round(totalClients * ageGroup.percentage);
      const tpsglobal = 9 + index; // 9, 10, 11, 12

      return createAgeGroupItem(
        ageGroup.label,
        count,
        tpsglobal,
        ageGroup.icon,
        ageGroup.id
      );
    });
  }, [currentItem]);

  const { submenutitems } = useSubMenuData(currentItem?.nbetablissements || 0);

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

  const [activePeriod, setActivePeriod] = useState<PeriodType>('all');

  const handleBack = useCallback(() => {
    window.history.back()
  }, []);

  const handleRapportClick = () => {
    router.push('/consulter/clients/age/rapport');
  };

  const periodMultiplier = PERIOD_MULTIPLIERS[activePeriod];

  const adaptedMainItem = useMemo(() => {
    if (!mainMenuItem) return null;
    const adaptedCount = Math.round(mainMenuItem.nbetablissements * periodMultiplier);

    return {
      ...mainMenuItem,
      nbetablissements: adaptedCount,
      count: adaptedCount,
      title: `${adaptedCount} CLIENTS`,
    };
  }, [mainMenuItem, periodMultiplier]);

  const adaptedAgeGroupItems = useMemo(() =>
    ageGroupItems.map(item => ({
      ...item,
      nbetablissements: Math.round(item.nbetablissements * periodMultiplier),
      count: Math.round(item.count * periodMultiplier),
      title: `${Math.round(item.nbetablissements * periodMultiplier)} ${item.title?.replace(/^\d+\s/, '') || ''}`,
    })),
    [ageGroupItems, periodMultiplier]
  );

  return {
    setActivePeriod, handleBack, handleRapportClick,
    submenutitems, adaptedMainItem, adaptedAgeGroupItems, activePeriod,
  };
};