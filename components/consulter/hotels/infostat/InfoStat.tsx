// components/datakwaba/InfoStat.tsx
'use client';

import React, { useMemo } from "react";
import Image from "next/image";
import type { AllTrends } from "@/lib/libs/interface";
import type { InfoStatProps } from "./InfoStat.types";
import { TrendBadge, TrendIndicator, FormattedTitle } from "./InfoStatComponents";
import { generateAllTrends } from "@/lib/libs/trends";

export default function InfoStat({
  item,
  inverse = false,
  tpsglobal = 1,
  onClick
}: InfoStatProps) {

  // ✅ Utiliser les trends déjà générées dans le hook
  const allTrends = useMemo<AllTrends>(() => {
    // Si l'item a déjà des trends, les utiliser
    if (item.trends) {
      return item.trends;
    }
    
    // Fallback: génération statique (ne devrait pas arriver normalement)
    return generateAllTrends(item.nbetablissements || 1000);
  }, [item]);

  const mainTrend = allTrends.day;

  const handleAction = () => {
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAction}
      disabled={!onClick}
      className="w-full flex flex-col items-center justify-between p-5 bg-white border border-gray-200 rounded-xl shadow-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-default"
      aria-label={`Statistiques pour ${item.title || "cet élément"}`}
    >
      <div className="mb-3 flex items-center justify-center">
        <Image
          src={item.icon || "/icons/batiment.png"}
          alt=""
          width={56}
          height={56}
          className="w-14 h-14 object-contain"
          priority={false}
          loading="lazy"
        />
      </div>

      <div className="w-full min-h-[44px] flex flex-col justify-center">
        <FormattedTitle item={item} inverse={inverse} tpsglobal={tpsglobal} />
      </div>

      <div className="w-full mt-4 pt-3 border-t border-gray-100 flex flex-col items-center">
        <TrendIndicator trend={mainTrend} />

        <div className="mt-4 w-full max-w-[200px]">
          <div className="grid grid-cols-3 gap-1.5">
            <TrendBadge trend={allTrends.week} period="week" />
            <TrendBadge trend={allTrends.month} period="month" />
            <TrendBadge trend={allTrends.year} period="year" />
          </div>
          <div className="grid grid-cols-3 gap-1.5 mt-1 text-center">
            <span className="text-[7px] text-gray-400 uppercase font-bold tracking-wider">Sem.</span>
            <span className="text-[7px] text-gray-400 uppercase font-bold tracking-wider">Mois</span>
            <span className="text-[7px] text-gray-400 uppercase font-bold tracking-wider">Ann.</span>
          </div>
        </div>
      </div>
    </button>
  );
}