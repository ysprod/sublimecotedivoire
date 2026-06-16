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
import { memo, useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";

import ConsulterEtablissementsContent from "./ConsulterEtablissementsContent";
import EnteteRapport from "./EnteteRapport";
import Bandeau from "@/components/commons/Bandeau";
import BackButton from "@/components/recherche/BackButton";

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

const MenuDiambra2 = memo(() => {
  const {
    shouldShowDataNavigation, carto,
    updateCarto, setshouldShowDataNavigation, setShowfiltreconsulter,
  } = usePrincipale();

  const { mainmenutitems } = useMenuData();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);



  useEffect(() => {
    return () => {
      setSelectedMenuItem(null);
    };
  }, []);

  const [isPending, startTransition] = useTransition();


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
    return () => {
      setSelectedMenuItem(null);
    };
  }, []);

  useEffect(() => {
    setSelectedMenuItem(mainmenutitems.MAIN_MENU_ITEMS[0]);
    setShowfiltreconsulter(true);
    updateCarto({ tpsglobal: selectedMenuItem?.tpsglobal });
    setshouldShowDataNavigation(true);
  }, [selectedMenuItem, setShowfiltreconsulter, updateCarto, mainmenutitems.MAIN_MENU_ITEMS, setshouldShowDataNavigation]);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto">
      <Bandeau />
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

    </div>
  );
});


// ============ COMPOSANT PRINCIPAL ============
const MenuDiambra = memo(() => {
  const {
    shouldShowDataNavigation,
    carto,
    updateCarto,
    setshouldShowDataNavigation,
    setShowfiltreconsulter,
  } = usePrincipale();

  const { mainmenutitems } = useMenuData();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isPending, startTransition] = useTransition();
  const isInitialized = useRef(false);

  // Mémorisation des callbacks
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

  const handleMenuItemSelect = useCallback((item: MenuItem | null) => {
    setSelectedMenuItem(item);
  }, []);

  // Initialisation unique
  useEffect(() => {
    if (!isInitialized.current && mainmenutitems.MAIN_MENU_ITEMS.length > 0) {
      isInitialized.current = true;
      const firstItem = mainmenutitems.MAIN_MENU_ITEMS[0];
      setSelectedMenuItem(firstItem);
      setShowfiltreconsulter(true);
      updateCarto({ tpsglobal: firstItem.tpsglobal });
      setshouldShowDataNavigation(true);
    }
  }, [mainmenutitems.MAIN_MENU_ITEMS, setShowfiltreconsulter, updateCarto, setshouldShowDataNavigation]);

  // Nettoyage
  useEffect(() => {
    return () => {
      isInitialized.current = false;
    };
  }, []);

  // Mémorisation des props pour éviter les re-rendus
  const enteteProps = useMemo(() => ({
    tpsglobal: carto.tpsglobal,
    shouldShowDataNavigation,
    setSelectedMenuItem: handleMenuItemSelect,
    selectedMenuItem,
    mainmenutitems: mainmenutitems.MAIN_MENU_ITEMS,
    updateCarto
  }), [carto.tpsglobal, shouldShowDataNavigation, selectedMenuItem, mainmenutitems.MAIN_MENU_ITEMS, updateCarto, handleMenuItemSelect]);

  const contentProps = useMemo(() => ({
    carto,
    mainmenutitems: mainmenutitems.MAIN_MENU_ITEMS,
    selectedMenuItem,
    setSelectedMenuItem: handleMenuItemSelect
  }), [carto, mainmenutitems.MAIN_MENU_ITEMS, selectedMenuItem, handleMenuItemSelect]);

  // Éviter le rendu si pas de données
  if (mainmenutitems.MAIN_MENU_ITEMS.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto">
      <Bandeau />
      <div className="grid grid-cols-1 gap-2 p-4 max-w-6xl mx-auto">
        <BackButton onClick={handleBackClick} />
        <EnteteRapport {...enteteProps} />
        <ConsulterEtablissementsContent {...contentProps} />
      </div>
      {isPending && (
        <div className="fixed bottom-4 right-4 bg-black/50 text-white p-2 rounded">
          Chargement...
        </div>
      )}
    </div>
  );
});

MenuDiambra.displayName = "MenuDiambra";



export default MenuDiambra;