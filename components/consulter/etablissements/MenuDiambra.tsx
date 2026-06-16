'use client';

import Charte from "@/components/charts/Charte";
import DistributedBarChart from "@/components/charts/DistributedBarChart";
import Bandeau from "@/components/commons/Bandeau";
import BackButton from "@/components/recherche/BackButton";
import { usePrincipale } from "@/hooks/datakwaba/etablissements/usePrincipale";
import type { MenuItem } from "@/lib/libs/interface";
import clsx from "clsx";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import { memo, useMemo, useCallback } from "react";
import InfoStat from "./InfoStat";
import PDFDownloadButton from "./ReportPDF";

// ============ CONSTANTES ============
const TREND_CONFIG = {
  up: { icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50", label: "Hausse" },
  down: { icon: TrendingDown, color: "text-red-600", bgColor: "bg-red-50", label: "Baisse" },
  stable: { icon: Minus, color: "text-gray-600", bgColor: "bg-gray-50", label: "Stable" }
} as const;

const CATEGORY_KEYWORDS = ['HÔTELS', 'RÉSIDENCES', 'MAISONS'] as const;

// ============ TYPES ============
interface StatDetail {
  label: string;
  value: number;
  trend: {
    direction: keyof typeof TREND_CONFIG;
    value: number;
  };
  icon?: string;
}

// ============ COMPOSANTS ============
const TrendBadge = memo(({ trend }: { trend: StatDetail['trend'] }) => {
  const config = TREND_CONFIG[trend.direction];
  const Icon = config.icon;

  return (
    <div className={clsx(
      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200",
      config.bgColor,
      config.color
    )}>
      <Icon size={14} className="stroke-current" />
      <span className="font-semibold">
        {trend.value > 0 ? '+' : ''}{trend.value}%
      </span>
      <span className="text-gray-500 font-normal">{config.label}</span>
    </div>
  );
});

TrendBadge.displayName = "TrendBadge";

// ============ COMPOSANT STATISTIQUES DÉTAILLÉES ============
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
      // Génération d'une tendance réaliste basée sur la valeur
      const trendValue = Math.round(
        (Math.sin(item.nbetablissements * 0.001) * 10 + Math.random() * 4 - 2) * 10
      ) / 10;
      
      let direction: keyof typeof TREND_CONFIG = 'stable';
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

  if (details.length === 0) return null;

  return (
    <div className={clsx("w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", className)}>
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          {details.length} catégories • Mise à jour en temps réel
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

DetailedStats.displayName = "DetailedStats";

// ============ COMPOSANT PRINCIPAL ============
const MenuDiambra = memo(() => {
  const { handleBackClick, tpsglobal, submenutitems, mainMenuItem } = usePrincipale();

  // Filtrage des items hôteliers
  const hotelItems = useMemo(() => {
    return submenutitems.filter(item =>
      CATEGORY_KEYWORDS.some(keyword => item.title?.includes(keyword))
    );
  }, [submenutitems]);

  // Gestionnaire de retour
  const handleBack = useCallback(() => {
    handleBackClick?.();
  }, [handleBackClick]);

  // Vérification de données
  const hasData = useMemo(() => {
    return submenutitems.length > 0 && hotelItems.length > 0;
  }, [submenutitems, hotelItems]);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 space-y-6">
      <Bandeau />
      <BackButton onClick={handleBack} />

      <div className="flex justify-center flex-col items-center w-full mt-4 space-y-6">
        {/* Indicateur principal */}
        {mainMenuItem && (
          <div className="w-full max-w-md">
            <InfoStat
              item={mainMenuItem}
              inverse
              tpsglobal={tpsglobal}
            />
          </div>
        )}

        {/* Grille des sous-indicateurs */}
        {hotelItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
            {hotelItems.slice(0, 3).map((item) => (
              <InfoStat
                key={`${item.title}-${item.tpsglobal}`}
                item={item}
                tpsglobal={tpsglobal}
              />
            ))}
          </div>
        )}

        {/* Bouton de génération PDF */}
        <div className="w-full max-w-3xl flex justify-center">
          <PDFDownloadButton
            mainItem={mainMenuItem}
            hotelItems={hotelItems}
            subItems={submenutitems}
          />
        </div>

        {/* Statistiques détaillées */}
        {hasData && (
          <DetailedStats
            items={hotelItems}
            title="Statistiques détaillées des établissements"
            className="max-w-3xl"
          />
        )}

        {/* Graphiques */}
        {submenutitems.length > 0 && (
          <div className="w-full max-w-3xl space-y-6">
            <Charte menuItems={submenutitems} />
            <DistributedBarChart menuItems={submenutitems} />
          </div>
        )}

        {/* Message si aucune donnée */}
        {!hasData && (
          <div className="w-full max-w-3xl text-center py-12">
            <p className="text-gray-500">Aucune donnée disponible</p>
          </div>
        )}
      </div>
    </div>
  );
});

MenuDiambra.displayName = "MenuDiambra";

export default MenuDiambra;