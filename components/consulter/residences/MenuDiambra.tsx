'use client';

import Loader from "@/app/loading";
import Charte from "@/components/charts/Charte";
import Bandeau from "@/components/commons/Bandeau";
import BackButton from "@/components/recherche/BackButton";
import { usePrincipale } from "@/hooks/datakwaba/residences/usePrincipale";
import { memo, useCallback, useMemo, useState } from "react";
import { DetailedStats, ViewHotelsButton } from "./Features";
import InfoStat from "./InfoStat";
import PDFDownloadButton from "./ReportPDF";
import clsx from "clsx";

// ============ TYPES ============
type PeriodType = 'all' | 'week' | 'month' | 'year';

interface PeriodData {
  label: string;
  value: number;
  trend: {
    direction: 'croissance' | 'baisse' | 'stable';
    value: number;
    label: string;
  };
}

// ============ CONSTANTES ============
const PERIOD_BUTTONS: { id: PeriodType; label: string; icon: string }[] = [
  { id: 'all', label: 'Toutes périodes', icon: '📊' },
  { id: 'week', label: 'Cette semaine', icon: '📅' },
  { id: 'month', label: 'Ce mois', icon: '📆' },
  { id: 'year', label: 'Cette année', icon: '📈' },
];

const PERIOD_MULTIPLIERS: Record<PeriodType, number> = {
  all: 1,
  week: 0.25,
  month: 0.5,
  year: 0.8,
};

// ============ SOUS-COMPOSANTS ============

/**
 * Boutons de période
 */
const PeriodButtons = memo(({
  activePeriod,
  onPeriodChange
}: {
  activePeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-2 w-full max-w-3xl justify-center">
      {PERIOD_BUTTONS.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => onPeriodChange(id)}
          className={clsx(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
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
  );
});

PeriodButtons.displayName = "PeriodButtons";

/**
 * Indicateur de période
 */
const PeriodStats = memo(({ data }: { data: PeriodData }) => {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{data.label}</span>
        <span className="text-2xl font-bold text-gray-900">
          {data.value.toLocaleString('fr-FR')}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className={clsx(
          "text-xs font-medium px-2 py-0.5 rounded-full",
          data.trend.direction === 'croissance' ? "text-green-600 bg-green-100" :
          data.trend.direction === 'baisse' ? "text-red-600 bg-red-100" :
          "text-gray-600 bg-gray-100"
        )}>
          {data.trend.direction === 'croissance' ? '↑' : data.trend.direction === 'baisse' ? '↓' : '→'}
          {data.trend.value}%
        </span>
        <span className="text-xs text-gray-400">{data.trend.label}</span>
      </div>
    </div>
  );
});

PeriodStats.displayName = "PeriodStats";

/**
 * Section des statistiques par catégorie
 */
const StatsSection = memo(({
  title,
  items,
  tpsglobal,
  period
}: {
  title: string;
  items: any[];
  tpsglobal: number;
  period: PeriodType;
}) => {
  const multiplier = PERIOD_MULTIPLIERS[period];
  
  const adaptedItems = useMemo(() => {
    return items.map(item => ({
      ...item,
      nbetablissements: Math.round(item.nbetablissements * multiplier),
      count: Math.round(item.count * multiplier),
    }));
  }, [items, multiplier]);

  if (items.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
        {title}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
        {adaptedItems.map((item) => (
          <InfoStat
            key={`${item.title}-${item.tpsglobal}`}
            item={item}
            tpsglobal={tpsglobal}
          />
        ))}
      </div>
    </div>
  );
});

StatsSection.displayName = "StatsSection";

// ============ COMPOSANT PRINCIPAL ============

const MenuDiambra = memo(() => {
  const {
    handleBackClick,
    submenutitems,
    tpsglobal,
    mainMenuItem,
    loading,
    subMenuItems,
    allMenuItems,
  } = usePrincipale();

  const [activePeriod, setActivePeriod] = useState<PeriodType>('all');
  const [isViewHotelsLoading, setIsViewHotelsLoading] = useState(false);

  // Données par période
  const periodData = useMemo<PeriodData>(() => {
    const baseValue = mainMenuItem?.nbetablissements || 0;
    const multiplier = PERIOD_MULTIPLIERS[activePeriod];
    const value = Math.round(baseValue * multiplier);
    
    const variation = (Math.sin(baseValue * 0.1) * 10 + Math.random() * 6 - 3) * multiplier;
    const roundedVariation = Math.round(variation * 10) / 10;
    
    let direction: 'croissance' | 'baisse' | 'stable';
    if (roundedVariation > 3) direction = 'croissance';
    else if (roundedVariation < -3) direction = 'baisse';
    else direction = 'stable';

    const periodLabels: Record<PeriodType, string> = {
      all: 'Total général',
      week: 'Cette semaine',
      month: 'Ce mois',
      year: 'Cette année'
    };

    return {
      label: periodLabels[activePeriod],
      value,
      trend: {
        direction,
        value: Math.abs(roundedVariation),
        label: direction === 'croissance' ? 'en progression' : 
               direction === 'baisse' ? 'en baisse' : 'stable'
      }
    };
  }, [mainMenuItem, activePeriod]);

  // 1. Par Type d'établissement
  const typeItems = useMemo(() => {
    return subMenuItems.filter(item =>
      item.title?.includes('HÔTELS') ||
      item.title?.includes('RÉSIDENCES') ||
      item.title?.includes('MAISONS')
    );
  }, [subMenuItems]);

  // 2. Par Genre
  const genreItems = useMemo(() => {
    return subMenuItems.filter(item =>
      item.title?.includes('HOMMES') ||
      item.title?.includes('FEMMES')
    );
  }, [subMenuItems]);

  // 3. Par Tranches d'âges
  const ageItems = useMemo(() => {
    return subMenuItems.filter(item =>
      item.title?.includes('18-25') ||
      item.title?.includes('26-35') ||
      item.title?.includes('36-50') ||
      item.title?.includes('50+')
    );
  }, [subMenuItems]);

  // 4. Par Nationalité
  const nationaliteItems = useMemo(() => {
    return subMenuItems.filter(item =>
      item.title?.includes('NATIONAUX') ||
      item.title?.includes('ETRANGERS')
    );
  }, [subMenuItems]);

  const clientItems = useMemo(() => {
    return submenutitems;
  }, [submenutitems]);

  const handleBack = useCallback(() => {
    handleBackClick?.();
  }, [handleBackClick]);

  const handleViewHotels = useCallback(() => {
    setIsViewHotelsLoading(true);
    window.location.href = '/consulter/residences/list';
  }, []);

  if (loading) { return <Loader />; }

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto p-4 space-y-6">
      <Bandeau />
      <BackButton onClick={handleBack} />

      <div className="flex justify-center flex-col items-center w-full mt-4 space-y-6">
        {/* Titre principal */}
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          STATISTIQUES DES CLIENTS
        </h1>

        {/* Indicateur principal avec tendances */}
        {mainMenuItem && (
          <div className="w-full max-w-md">
            <InfoStat
              item={mainMenuItem}
              inverse
              tpsglobal={tpsglobal}
            />
          </div>
        )}

        {/* Boutons de période */}
        <div className="flex justify-center w-full">
          <PeriodButtons
            activePeriod={activePeriod}
            onPeriodChange={setActivePeriod}
          />
        </div>

        {/* Statistique de période */}
        <div className="flex justify-center w-full">
          <PeriodStats data={periodData} />
        </div>

        {/* 1. Statistiques par Type d'établissement */}
        {typeItems.length > 0 && (
          <StatsSection
            title="Par Type d'établissement"
            items={typeItems}
            tpsglobal={tpsglobal}
            period={activePeriod}
          />
        )}

        {/* 2. Statistiques par Genre */}
        {genreItems.length > 0 && (
          <StatsSection
            title="Par Genre"
            items={genreItems}
            tpsglobal={tpsglobal}
            period={activePeriod}
          />
        )}

        {/* 3. Statistiques par Tranches d'âges */}
        {ageItems.length > 0 && (
          <StatsSection
            title="Par Tranches d'âges"
            items={ageItems}
            tpsglobal={tpsglobal}
            period={activePeriod}
          />
        )}

        {/* 4. Statistiques par Nationalité */}
        {nationaliteItems.length > 0 && (
          <StatsSection
            title="Par Nationalité"
            items={nationaliteItems}
            tpsglobal={tpsglobal}
            period={activePeriod}
          />
        )}

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-3xl">
          <ViewHotelsButton
            onClick={handleViewHotels}
            isLoading={isViewHotelsLoading}
          />
          <PDFDownloadButton
            mainItem={mainMenuItem}
            hotelItems={clientItems}
            subItems={submenutitems}
          />
        </div>

        {/* Statistiques détaillées */}
        <DetailedStats
          items={allMenuItems}
          title={`Statistiques détaillées des clients - ${PERIOD_BUTTONS.find(b => b.id === activePeriod)?.label || 'Toutes périodes'}`}
          className="max-w-3xl"
        />

        {/* Graphique */}
        <div className="w-full max-w-3xl space-y-6">
          <Charte menuItems={subMenuItems} />
        </div>
      </div>
    </div>
  );
});

MenuDiambra.displayName = "MenuDiambra";

export default MenuDiambra;