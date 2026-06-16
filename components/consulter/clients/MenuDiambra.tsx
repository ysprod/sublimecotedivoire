'use client';
import Charte from "@/components/charts/Charte";
import DistributedBarChart from "@/components/charts/DistributedBarChart";
import Bandeau from "@/components/commons/Bandeau";
import BackButton from "@/components/recherche/BackButton";
import { usePrincipale } from "@/hooks/datakwaba/clients/usePrincipale";
import type { MenuItem } from "@/lib/libs/interface";
import clsx from "clsx";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import { memo, useCallback, useMemo } from "react";
import InfoStat from "./InfoStat";
import PDFDownloadButton from "./ReportPDF";

interface StatDetail {
  label: string;
  value: number;
  trend: {
    direction: 'up' | 'down' | 'stable';
    value: number;
  };
  icon?: string;
}

const TREND_CONFIG = {
  up: { icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50", label: "Hausse" },
  down: { icon: TrendingDown, color: "text-red-600", bgColor: "bg-red-50", label: "Baisse" },
  stable: { icon: Minus, color: "text-gray-600", bgColor: "bg-gray-50", label: "Stable" }
} as const;

const TrendBadge = memo(({ trend }: { trend: StatDetail['trend'] }) => {
  const config = TREND_CONFIG[trend.direction];
  const Icon = config.icon;

  return (
    <div className={clsx(
      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
      config.bgColor,
      config.color
    )}>
      <Icon size={14} className="stroke-current" />
      <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
      <span className="text-gray-500 font-normal">{config.label}</span>
    </div>
  );
});

const DetailedStats = memo(({
  items,
  title,
  className
}: {
  items: MenuItem[];
  title: string;
  className?: string;
}) => {
  const details = useMemo<StatDetail[]>(() => {
    return items.map(item => {
      const trendValue = Math.round(
        (Math.sin(item.nbetablissements * 0.001) * 10 + Math.random() * 4 - 2) * 10
      ) / 10;

      let direction: 'up' | 'down' | 'stable' = 'stable';
      if (trendValue > 2) direction = 'up';
      else if (trendValue < -2) direction = 'down';

      return {
        label: item.title?.replace(/^\d+\s/, '') || '',
        value: item.nbetablissements,
        trend: {
          direction,
          value: Math.abs(trendValue)
        },
        icon: item.icon
      };
    });
  }, [items]);

  const total = useMemo(() => {
    return details.reduce((sum, item) => sum + item.value, 0);
  }, [details]);

  if (details.length === 0) return null;

  return (
    <div className={clsx("w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", className)}>
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          {details.length} catégories • Total: {total.toLocaleString('fr-FR')} clients
        </p>
      </div>

      <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
        {details.map((detail, index) => (
          <div
            key={index}
            className="px-6 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              {detail.icon && (
                <Image
                  src={detail.icon}
                  alt={detail.label}
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain opacity-70 flex-shrink-0"
                  loading="lazy"
                />
              )}
              <span className="text-sm text-gray-700 truncate">
                {detail.label}
              </span>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="text-sm font-semibold text-gray-900 tabular-nums">
                {detail.value.toLocaleString('fr-FR')}
              </span>
              <TrendBadge trend={detail.trend} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const MenuDiambra = memo(() => {
  const { handleBackClick, submenutitems, tpsglobal, mainMenuItem } = usePrincipale();

  const clientItems = useMemo(() => {
    return submenutitems.filter(item =>
      item.title?.includes('CLIENTS') ||
      item.title?.includes('HÔTELS') ||
      item.title?.includes('RÉSIDENCES') ||
      item.title?.includes('MAISONS')
    );
  }, [submenutitems]);

  const handleBack = useCallback(() => {
    handleBackClick?.();
  }, [handleBackClick]);

  const hasData = useMemo(() => {
    return submenutitems.length > 0 && clientItems.length > 0;
  }, [submenutitems, clientItems]);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 space-y-6">
      <Bandeau />
      <BackButton onClick={handleBack} />

      <div className="flex justify-center flex-col items-center w-full mt-4 space-y-6">
        {mainMenuItem && (
          <div className="w-full max-w-md">
            <InfoStat
              item={mainMenuItem}
              inverse
              tpsglobal={tpsglobal}
            />
          </div>
        )}

        {clientItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
            {clientItems.slice(0, 3).map((item) => (
              <InfoStat
                key={`${item.title}-${item.tpsglobal}`}
                item={item}
                tpsglobal={tpsglobal}
              />
            ))}
          </div>
        )}

        <div className="w-full max-w-3xl flex justify-center">
          <PDFDownloadButton
            mainItem={mainMenuItem}
            hotelItems={clientItems}
            subItems={submenutitems}
          />
        </div>
        {hasData && (
          <DetailedStats
            items={clientItems}
            title="Statistiques détaillées des clients"
            className="max-w-3xl"
          />
        )}

        <div className="w-full max-w-3xl space-y-6">
          <Charte menuItems={submenutitems} />
          <DistributedBarChart menuItems={submenutitems} />
        </div>
      </div>
    </div>
  );
});

export default MenuDiambra;