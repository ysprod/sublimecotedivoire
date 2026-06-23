'use client';
import Bandeau from "@/components/commons/Bandeau";
import BackButton from "@/components/recherche/BackButton";
import { usePrincipale } from "@/hooks/datakwaba/clients/usePrincipale";
import { STAT_LABEL_MAP } from "@/lib/libs/constants";
import type { MenuItem, PeriodType, TrendData } from "@/lib/libs/interface";
import clsx from "clsx";
import { Calendar, Globe, Minus, TrendingDown, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import { memo, useCallback, useMemo } from "react";
import PDFDownloadButton from "./ReportPDF";

interface InfoStatProps {
  item: MenuItem;
  tpsglobal?: number;
  inverse?: boolean;
  onClick?: (item: MenuItem) => void;
  trendPeriod?: 'day' | 'week' | 'month' | 'year';
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

const PERIOD_LABELS = {
  day: 'hier',
  week: 'la semaine dernière',
  month: 'le mois dernier',
  year: 'l\'année dernière'
} as const;

const TrendIndicator = memo(({ trend, size = 'sm' }: { trend: TrendData; size?: 'sm' | 'md' }) => {
  const config = TREND_CONFIG[trend.direction];
  const Icon = config.icon;

  const sizeClasses = size === 'md'
    ? "px-3 py-1.5 text-xs"
    : "px-2 py-1 text-[10px]";

  return (
    <div className="flex flex-col items-center gap-0.5 mt-1">
      <div className={clsx(
        "flex items-center gap-1 rounded-full font-medium",
        sizeClasses,
        config.bgColor,
        config.color
      )}>
        <Icon size={size === 'md' ? 14 : 12} className="stroke-current" />
        <span className="font-semibold">
          {trend.value > 0 ? '+' : ''}{trend.value}%
        </span>
      </div>
      <span className="text-[8px] text-gray-500 uppercase tracking-wider font-medium">
        {trend.label}
      </span>
    </div>
  );
});

const FormattedTitle = memo(({
  item,
  inverse = false,
  tpsglobal = 1
}: {
  item: MenuItem;
  inverse?: boolean;
  tpsglobal?: number;
}) => {
  const formattedTitle = useMemo(() => {
    if (!item.title) return null;

    const match = item.title.match(/^(\d+)\s(.+)$/);
    if (!match) return item.title;

    const numberPart = match[1];
    const textPart = match[2];
    const modifiedText = STAT_LABEL_MAP[tpsglobal] || "";

    return (
      <>
        <span className="text-gray-900">{inverse ? numberPart : textPart}</span>
        <br />
        <div>
          <span className="text-blue-600 font-bold">{inverse ? textPart : numberPart}</span>
          {!inverse && modifiedText && (
            <span className="text-blue-600 font-bold"> {modifiedText}</span>
          )}
        </div>
      </>
    );
  }, [item.title, inverse, tpsglobal]);

  return formattedTitle || <span className="text-gray-800">non spécifié</span>;
});

const InfoStat = memo(({
  item,
  inverse = false,
  tpsglobal = 1,
  onClick,
  trendPeriod = 'day'
}: InfoStatProps) => {
  const trendData = useMemo<TrendData | null>(() => {
    if (item.trends) {
      const period = trendPeriod as keyof typeof item.trends;
      const trend = item.trends[period];

      if (trend) {
        return {
          direction: trend.direction,
          value: trend.value,
          label: `${TREND_CONFIG[trend.direction].label} par rapport à ${PERIOD_LABELS[period]}`
        };
      }
    }

    if (item.trend) {
      return {
        direction: item.trend.direction,
        value: item.trend.value,
        label: `${TREND_CONFIG[item.trend.direction].label} par rapport à ${PERIOD_LABELS[trendPeriod]}`
      };
    }

    return {
      direction: 'stable',
      value: 0,
      label: 'stable (données insuffisantes)'
    };
  }, [item, trendPeriod]);

  const alternativeTrends = useMemo<{ period: string; trend: TrendData }[]>(() => {
    if (!item.trends) return [];

    const periods: ('day' | 'week' | 'month' | 'year')[] = ['day', 'week', 'month', 'year'];
    const currentPeriod = trendPeriod as keyof typeof item.trends;

    return periods
      .filter(p => p !== currentPeriod)
      .map(p => {
        const trend = item.trends![p];
        const periodLabels: Record<string, string> = {
          day: 'hier',
          week: '7 jours',
          month: '30 jours',
          year: '365 jours'
        };

        return {
          period: p,
          trend: {
            ...trend,
            label: `${TREND_CONFIG[trend.direction].label} sur ${periodLabels[p]}`
          }
        };
      });
  }, [item, trendPeriod]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(item);
    }
  }, [onClick, item]);

  return (
    <div className="relative w-full">
      <button
        onClick={handleClick}
        className={clsx(
          "w-full flex flex-col items-center justify-center p-4 bg-white ",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "cursor-pointer "
        )}
        aria-label={`Accéder à ${item.title || "cette information"}`}
      >
        <div className="flex items-center justify-center mb-2">
          <Image
            src={item.icon || "/icons/batiment.png"}
            alt={item.title || "Information"}
            width={64}
            height={64}
            className="w-16 h-16 object-contain"
            priority={false}
            loading="lazy"
          />
        </div>

        <div className="text-xs font-semibold text-center whitespace-pre-line">
          <FormattedTitle item={item} inverse={inverse} tpsglobal={tpsglobal} />
        </div>

        {trendData && (
          <div className="mt-1">
            <TrendIndicator trend={trendData} size="sm" />
          </div>
        )}

        {alternativeTrends.length > 0 && (
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            {alternativeTrends.slice(0, 2).map(({ period, trend }) => (
              <div key={period} className="scale-90">
                <TrendIndicator trend={trend} size="sm" />
              </div>
            ))}
          </div>
        )}
      </button>
    </div>
  );
});

const PERIOD_BUTTONS: { id: PeriodType; label: string; icon: string }[] = [
  { id: 'all', label: 'Vue d\'ensemble', icon: '📊' },
  { id: 'week', label: 'Cette semaine', icon: '📅' },
  { id: 'month', label: 'Ce mois', icon: '📆' },
  { id: 'year', label: 'Cette année', icon: '📈' },
];

const FILTERS = [
  { id: 'type', label: 'Par Type d\'établissements', icon: Calendar, color: 'from-emerald-500 to-teal-500', path: '/consulter/clients/type' },
  { id: 'genre', label: 'Par Genre', icon: Users, color: 'from-pink-500 to-rose-500', path: '/consulter/clients/genre' },
  { id: 'nationalite', label: 'Par Nationalité', icon: Globe, color: 'from-blue-500 to-indigo-500', path: '/consulter/clients/nationalite' },
  { id: 'age', label: 'Par Tranches d\'âges', icon: Calendar, color: 'from-emerald-500 to-teal-500', path: '/consulter/clients/age' },
] as const;

const PeriodButtons = memo(({
  activePeriod,
  onPeriodChange
}: {
  activePeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}) => (
  <div className="flex flex-wrap gap-2 w-full max-w-3xl justify-center">
    {PERIOD_BUTTONS.map(({ id, label, icon }) => (
      <button
        key={id}
        onClick={() => onPeriodChange(id)}
        className={clsx(
          "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
          activePeriod === id
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        <span className="mr-1">{icon}</span>
        {label}
      </button>
    ))}
  </div>
));

const CategoryFilterButtons = memo(() => (
  <div className="flex flex-wrap gap-3 justify-center">
    {FILTERS.map(({ id, label, icon: Icon, path }) => (
      <button
        key={id}
        onClick={() => { window.location.href = path; }}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
      >
        <Icon size={18} />
        {label}
      </button>
    ))}
  </div>
));

const MenuDiambra = memo(() => {
  const {
    setActivePeriod, handleBack, periodMultiplier, submenutitems, tpsglobal, mainMenuItem, activePeriod,
  } = usePrincipale();

  return (
    <div className="flex flex-col items-center w-full mx-auto max-w-5xl p-4 space-y-6">
      <Bandeau />
      <BackButton onClick={handleBack} />

      <h1 className="text-xl uppercase font-bold text-gray-800 text-center">
        Statistiques des clients au plan national
      </h1>

      <PeriodButtons
        activePeriod={activePeriod}
        onPeriodChange={setActivePeriod}
      />

      {mainMenuItem && (
        <div className="w-full max-w-md flex justify-center">
          <InfoStat
            item={{
              ...mainMenuItem,
              nbetablissements: Math.round(mainMenuItem.nbetablissements * periodMultiplier),
            }}
            inverse
            tpsglobal={tpsglobal}
            onClick={() => { }}
          />
        </div>
      )}

      <CategoryFilterButtons />

      <div className="w-full max-w-3xl flex justify-center mt-4 mb-4">
        <PDFDownloadButton
          mainItem={mainMenuItem}
          hotelItems={submenutitems}
          subItems={submenutitems}
        />
      </div>
    </div>
  );
});

export default MenuDiambra;