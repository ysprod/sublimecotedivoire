"use client";
import { usePrincipale } from "@/hooks/datakwaba/usePrincipale";
import { TITLE_SPLIT_REGEX } from "@/lib/libs/constants";
import { getRandomCount } from "@/lib/libs/functions";
import { MenuItem } from "@/lib/libs/interface";
import clsx from "clsx";
import {
  BedDouble, Building2, Globe, Home, Hotel, MapPin, Minus, TrendingDown, TrendingUp, User,
  UserRound, Users,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Bandeau from "../commons/Bandeau";
import BackButton from "../recherche/BackButton";
import ConsulterEtablissementsContent from "./ConsulterEtablissementsContent";
import EnteteRapport from "./EnteteRapport";

interface MenuItemCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
  className?: string;
  showTrend?: boolean;
}

interface TrendData {
  value: number;
  direction: 'up' | 'down' | 'stable';
  label?: string;
}

const TREND_CONFIG = {
  up: { icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-100" },
  down: { icon: TrendingDown, color: "text-red-600", bgColor: "bg-red-100" },
  stable: { icon: Minus, color: "text-gray-600", bgColor: "bg-gray-100" }
} as const;

const getIconComponent = (title: string, isBlack: boolean = false) => {
  const iconProps = {
    size: 80,
    strokeWidth: 1.5,
    className: `mb-3 w-24 h-24 ${isBlack ? 'text-gray-900' : 'text-blue-600'}`
  };

  if (title.includes('HÔTELS')) return <Hotel {...iconProps} />;
  if (title.includes('RÉSIDENCES')) return <BedDouble {...iconProps} />;
  if (title.includes('MAISONS')) return <Home {...iconProps} />;
  if (title.includes('ÉTABLISSEMENTS')) return <Building2 {...iconProps} />;
  if (title.includes('CLIENTS')) return <Users {...iconProps} />;
  if (title.includes('HOMMES')) return <User {...iconProps} />;
  if (title.includes('FEMMES')) return <UserRound  {...iconProps} />;
  if (title.includes('NATIONAUX')) return <MapPin {...iconProps} />;
  if (title.includes('ETRANGERS')) return <Globe {...iconProps} />;

  return <Building2 {...iconProps} />;
};

const TrendIndicator = memo(({ trend }: { trend: TrendData }) => {
  const config = TREND_CONFIG[trend.direction];
  const Icon = config.icon;

  return (
    <div className={clsx(
      "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-2",
      config.bgColor,
      config.color
    )}>
      <Icon size={14} />
      <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
      <span className="text-gray-600">{trend.label}</span>
    </div>
  );
});

const MenuItemCard = memo(({
  item,
  onClick,
  className,
  showTrend = true
}: MenuItemCardProps) => {
  const getDefaultTrend = useCallback((item: MenuItem): TrendData => {
    const defaultTrends: Record<string, TrendData> = {
      'HÔTELS': { value: 5.2, direction: 'up', label: 'secteur en croissance' },
      'RÉSIDENCES': { value: 3.8, direction: 'up', label: 'demande croissante' },
      'MAISONS': { value: -2.1, direction: 'down', label: 'légère baisse' },
      'ÉTABLISSEMENTS': { value: 4.5, direction: 'up', label: 'expansion continue' },
      'CLIENTS': { value: 7.3, direction: 'up', label: 'hausse de fréquentation' },
      'HOMMES': { value: 2.1, direction: 'up', label: 'légère progression' },
      'FEMMES': { value: 8.5, direction: 'up', label: 'forte progression' },
      'NATIONAUX': { value: 3.2, direction: 'up', label: 'tourisme local' },
      'ETRANGERS': { value: 12.4, direction: 'up', label: 'reprise tourisme' }
    };

    for (const [key, trend] of Object.entries(defaultTrends)) {
      if (item.title?.includes(key)) {
        return trend;
      }
    }

    return {
      value: Math.random() * 10 - 5,
      direction: Math.random() > 0.5 ? 'up' : 'down',
      label: 'vs période précédente'
    };
  }, []);

  const trend = useMemo<TrendData | null>(() => {
    if (!showTrend) return null;

    if (item.trend) {
      return item.trend;
    }

    return getDefaultTrend(item);
  }, [item, showTrend, getDefaultTrend]);
  const defaultRenderTitle = useCallback((title: string) => {
    const [numberPart, ...textParts] = title.split(TITLE_SPLIT_REGEX);
    const formattedNumber = parseInt(numberPart)?.toLocaleString('fr-FR') || numberPart;

    return (
      <div className="flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold text-blue-600">{formattedNumber}</span>
        {textParts.length > 0 && (
          <span className="text-gray-700 text-sm font-medium mt-1">
            {textParts.join(' ')}
          </span>
        )}
      </div>
    );
  }, []);

  const handleClick = useCallback(() => {
    onClick(item);
  }, [item, onClick]);

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "p-4 flex flex-col items-center justify-center transition-all duration-300",
        "bg-white rounded-xl shadow-md hover:shadow-xl focus:outline-none",
        "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "border border-gray-100 hover:border-blue-200",
        className
      )}
      aria-label={`Accéder à ${item.title}`}
    >
      <div className="relative">
        {getIconComponent(item.title!, item.blackicon?.includes('black'))}
      </div>

      {item.title && (
        <div className="text-center min-h-[60px] flex flex-col items-center mt-2">
          {defaultRenderTitle(item.title)}
        </div>
      )}

      {trend && <TrendIndicator trend={trend} />}

      {!trend && showTrend && (
        <div className="text-xs text-gray-400 mt-2">
          Données non disponibles
        </div>
      )}
    </button>
  );
});

const createMenuItem = (
  baseTitle: string,
  count: number,
  icon: string,
  tpsglobal: number,
  blackicon: string
): MenuItem => ({
  nbetablissements: count,
  title: `${count} ${baseTitle}`,
  icon,
  tpsglobal,
  blackicon
});

const useMenuData = () => {
  const menuData = useMemo(() => {
    const hotelsCount = getRandomCount(2000, 10000);
    const previousHotelsCount = Math.floor(hotelsCount * (1 + (Math.random() * 0.2 - 0.1)));

    const residencesCount = Math.floor(hotelsCount * getRandomCount(30, 50) / 100);
    const previousResidencesCount = Math.floor(residencesCount * (1 + (Math.random() * 0.2 - 0.1)));

    const maisonsCount = Math.floor(hotelsCount * getRandomCount(10, 20) / 100);
    const previousMaisonsCount = Math.floor(maisonsCount * (1 + (Math.random() * 0.2 - 0.1)));

    const totalEtablissements = hotelsCount + residencesCount + maisonsCount;
    const previousTotalEtablissements = previousHotelsCount + previousResidencesCount + previousMaisonsCount;

    const hommesCount = getRandomCount(2000, 10000);
    const previousHommesCount = Math.floor(hommesCount * (1 + (Math.random() * 0.2 - 0.1)));

    const femmesCount = getRandomCount(2000, 1000);
    const previousFemmesCount = Math.floor(femmesCount * (1 + (Math.random() * 0.2 - 0.1)));

    const clientsCount = hommesCount + femmesCount;
    const previousClientsCount = previousHommesCount + previousFemmesCount;

    const nationauxRatio = getRandomCount(30, 70) / 100;
    const nationauxCount = Math.round(clientsCount * nationauxRatio);
    const previousNationauxCount = Math.round(previousClientsCount * nationauxRatio);
    const etrangersCount = clientsCount - nationauxCount;
    const previousEtrangersCount = previousClientsCount - previousNationauxCount;

    const getTrend = (current: number, previous: number) => {
      if (previous === 0) return { value: 0, direction: 'stable' as const };
      const variation = ((current - previous) / previous) * 100;
      return {
        value: Math.abs(Math.round(variation * 10) / 10),
        direction: variation > 0 ? 'up' as const : variation < 0 ? 'down' as const : 'stable' as const
      };
    };

    return {
      MAIN_MENU_ITEMS: [
        {
          ...createMenuItem("ÉTABLISSEMENTS", totalEtablissements, "/icons/batiment.png", 0, "/icons/batiment.png"),
          trend: getTrend(totalEtablissements, previousTotalEtablissements)
        },
        {
          ...createMenuItem("CLIENTS", clientsCount, "/icons/clients.png", 1, "/icons/clients.png"),
          trend: getTrend(clientsCount, previousClientsCount)
        },
        {
          ...createMenuItem("HOMMES", hommesCount, "/icons/homme.png", 2, "/icons/homme.png"),
          trend: getTrend(hommesCount, previousHommesCount)
        },
        {
          ...createMenuItem("FEMMES", femmesCount, "/icons/femme.png", 3, "/icons/femme.png"),
          trend: getTrend(femmesCount, previousFemmesCount)
        },
        {
          ...createMenuItem("NATIONAUX", nationauxCount, "/icons/nationaux.png", 4, "/icons/nationaux.png"),
          trend: getTrend(nationauxCount, previousNationauxCount)
        },
        {
          ...createMenuItem("ETRANGERS", etrangersCount, "/icons/etranger.png", 5, "/icons/etranger.png"),
          trend: getTrend(etrangersCount, previousEtrangersCount)
        }
      ]
    };
  }, []);

  return { mainmenutitems: menuData };
};

interface MenuItemCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
  className?: string;
  showTrend?: boolean;
}

interface TrendData {
  value: number;
  direction: 'up' | 'down' | 'stable';
  label?: string;
}

const MenuDiambra = memo(() => {
  const {
    shouldShowDataNavigation,showfiltreconsulter, carto,
    updateCarto,    setshouldShowDataNavigation,    setShowfiltreconsulter, 
  } = usePrincipale();

  const { mainmenutitems } = useMenuData();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (selectedMenuItem && !shouldShowDataNavigation) {
      setshouldShowDataNavigation(true);
    }
  }, [selectedMenuItem, shouldShowDataNavigation, setshouldShowDataNavigation]);

  useEffect(() => {
    return () => {
      setSelectedMenuItem(null);
    };
  }, []);

  const [isPending, startTransition] = useTransition();

  const handleButtonClick = useCallback((item: MenuItem) => {
    startTransition(() => {
      setShowfiltreconsulter(true);
      updateCarto({ tpsglobal: item.tpsglobal });
    });
  }, [setShowfiltreconsulter, updateCarto]);

  const handleBackClick = useCallback(() => {
    startTransition(() => {
      if (selectedMenuItem) {
        setSelectedMenuItem(null);
        return;
      }
      if (shouldShowDataNavigation) {
        setshouldShowDataNavigation(false);
        return;
      }
      setShowfiltreconsulter(false);
    });
  }, [selectedMenuItem, shouldShowDataNavigation, setshouldShowDataNavigation, setShowfiltreconsulter]);

  useEffect(() => {
    if (selectedMenuItem && !shouldShowDataNavigation) {
      setshouldShowDataNavigation(true);
    }
  }, [selectedMenuItem, shouldShowDataNavigation, setshouldShowDataNavigation]);

  useEffect(() => {
    return () => {
      setSelectedMenuItem(null);
    };
  }, []);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto">
      <Bandeau />
      {showfiltreconsulter ? (
        <div className="grid grid-cols-1 gap-2 p-4 max-w-6xl mx-auto" >
          <BackButton onClick={handleBackClick} />
          <EnteteRapport
            tpsglobal={carto.tpsglobal}
            shouldShowDataNavigation={shouldShowDataNavigation}
            setSelectedMenuItem={setSelectedMenuItem}
            selectedMenuItem={selectedMenuItem}
            mainmenutitems={mainmenutitems.MAIN_MENU_ITEMS}
            updateCarto={updateCarto}
          />
          <ConsulterEtablissementsContent
            carto={carto}
            mainmenutitems={mainmenutitems.MAIN_MENU_ITEMS}
            selectedMenuItem={selectedMenuItem}
            setSelectedMenuItem={setSelectedMenuItem}
          />
        </div>
      ) : (
        <div className="flex flex-col w-full max-w-3xl mx-auto">
          <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto"  >
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {mainmenutitems.MAIN_MENU_ITEMS.map((item: MenuItem) => (
                <MenuItemCard key={item.tpsglobal} item={item} onClick={handleButtonClick} />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {isPending && (
        <div className="fixed bottom-4 right-4 bg-black/50 text-white p-2 rounded">
          Chargement...
        </div>
      )}
      <br /><br /><br />
    </div>
  );
});

export default MenuDiambra;