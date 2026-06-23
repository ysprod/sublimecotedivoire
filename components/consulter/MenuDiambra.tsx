"use client";
import { usePrincipale } from "@/hooks/datakwaba/commons/usePrincipale";
import { getRandomCount } from "@/lib/libs/functions";
import { MenuItem } from "@/lib/libs/interface";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import BackButton from "../commons/BackButton";
import Bandeau from "../commons/Bandeau";
import ConsulterEtablissementsContent from "./ConsulterEtablissementsContent";
import EnteteRapport from "./EnteteRapport";

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
  blackicon,
  id: baseTitle.toLowerCase().replace(/\s/g, '_'),
  count,
  trendValue: 0,
  iconSrc: icon,
  iconAlt: `Icône ${baseTitle}`,
  color: "text-black",
  bgColor: "bg-white",
  description: baseTitle
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
      if (previous === 0) return { value: 0, direction: 'stable' as const, label: 'stable' };
      const variation = ((current - previous) / previous) * 100;
      const absValue = Math.abs(Math.round(variation * 10) / 10);

      let direction: 'croissance' | 'baisse' | 'stable';
      let label: string;

      if (variation > 0) {
        direction = 'croissance';
        label = `+${absValue}% en hausse`;
      } else if (variation < 0) {
        direction = 'baisse';
        label = `-${absValue}% en baisse`;
      } else {
        direction = 'stable';
        label = 'stable';
      }

      return {
        value: absValue,
        direction,
        label
      };
    };

    return {
      MAIN_MENU_ITEMS: [
        {
          ...createMenuItem("ÉTABLISSEMENTS", totalEtablissements, "/icons/batiment.png", 0, "/icons/batiment.png"),
          trend: getTrend(totalEtablissements, previousTotalEtablissements)
        },
        {
          ...createMenuItem("CLIENTS", clientsCount, "/icons/lesclients.png", 1, "/icons/lesclients.png"),
          trend: getTrend(clientsCount, previousClientsCount)
        },
        {
          ...createMenuItem("HOMMES", hommesCount, "/icons/client.png", 2, "/icons/client.png"),
          trend: getTrend(hommesCount, previousHommesCount)
        },
        {
          ...createMenuItem("FEMMES", femmesCount, "/icons/cliente.png", 3, "/icons/cliente.png"),
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

  const handleBackClick = useCallback(() => {
      if (selectedMenuItem) {
        setSelectedMenuItem(null);
        return;
      }
      if (shouldShowDataNavigation) {
        setshouldShowDataNavigation(false);
        return;
      }
      setShowfiltreconsulter(false);
  }, [selectedMenuItem, shouldShowDataNavigation, setshouldShowDataNavigation, setShowfiltreconsulter]);

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

export default MenuDiambra;