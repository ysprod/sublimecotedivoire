"use client";
import { useMenuData } from "@/hooks/useMenuData";
import { CartoFiltre } from "@/libs/interface";
import { memo } from "react";
import ConsulterEtablissementsFiltre from "./ConsulterEtablissementsFiltre";
import ConsulterHome from "./ConsulterHome";

interface ConsulterProps {
  carto: CartoFiltre;
  shouldShowDataNavigation: boolean;
  showfiltreconsulter: boolean;
  updateCarto: (updates: Partial<CartoFiltre>) => void;
  setshouldShowDataNavigation: (value: boolean) => void;
  setShowfiltreconsulter: (value: boolean) => void;
}

const MenuDiambra = memo(({ carto, showfiltreconsulter, shouldShowDataNavigation = false,
  updateCarto, setshouldShowDataNavigation, setShowfiltreconsulter, }: ConsulterProps) => {

  const { mainmenutitems } = useMenuData();

  return (
    <>
   
      {showfiltreconsulter ? (
        <ConsulterEtablissementsFiltre
          mainmenutitems={mainmenutitems}
          carto={carto}
          shouldShowDataNavigation={shouldShowDataNavigation}
          updateCarto={updateCarto}
          setshouldShowDataNavigation={setshouldShowDataNavigation}
          setShowfiltreconsulter={setShowfiltreconsulter}
        />
      ) : (
        <ConsulterHome mainmenutitems={mainmenutitems}
          setShowfiltreconsulter={setShowfiltreconsulter}
          updateCarto={updateCarto} />
      )}
    </>
  );
});

MenuDiambra.displayName = "MenuDiambra";

export default MenuDiambra;