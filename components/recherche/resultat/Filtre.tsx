'use client';
import { memo } from "react";
import type { CartoFiltre, OptionValue } from "@/lib/libs/interface";
import FiltreHome from "./FiltreHome";
import { useMenuData } from "@/hooks/datakwaba/recherche/useMenuData";
import { useRegions } from "@/hooks/datakwaba/recherche/useRegions";
import { DATA_LOADING } from "@/lib/libs/constants";
import HistoriqueLoader from "@/components/connexions/HistoriqueLoader";
import Reessayer from "@/components/commons/Reessayer";
import Erreur from "@/components/commons/Erreur";
import Bandeau from "@/components/commons/Bandeau";
import FiltreResultat from "./FiltreResultat";
 

interface FiltreProps {
  carto: CartoFiltre;
  regionOptions: OptionValue[];
  departementOptions: OptionValue[];
  loading: boolean;
  errorMessage: string | null;
  shouldShowDataNavigation: boolean;
  showfiltreconsulter: boolean;
  setShowfiltreconsulter: (value: boolean) => void;
  updateCarto: (updates: Partial<CartoFiltre>) => void;
  setshouldShowDataNavigation: (value: boolean) => void;
}

const Filtre = memo(({ carto, departementOptions, regionOptions, loading, errorMessage,
  shouldShowDataNavigation, showfiltreconsulter = false,
  updateCarto, setShowfiltreconsulter, setshouldShowDataNavigation, }: FiltreProps) => {

  const { regions, loading: loadingregions, error, refresh } = useRegions();

  const { mainmenutitems } = useMenuData();

  if (loading || loadingregions) return <HistoriqueLoader texte={DATA_LOADING} />;

  if (error) return <Reessayer error={error} refresh={refresh} />;
  if (errorMessage) return <Erreur message={errorMessage} />;

  return (
    <>
      <Bandeau />
      {showfiltreconsulter ? (
        <FiltreHome
          carto={carto}
          mainmenutitems={mainmenutitems}
          shouldShowDataNavigation={shouldShowDataNavigation}
          setshouldShowDataNavigation={setshouldShowDataNavigation}
          setShowfiltreconsulter={setShowfiltreconsulter}
          updateCarto={updateCarto}
        />) : (
        <FiltreResultat
          mainmenutitems={mainmenutitems} carto={carto}
          setShowfiltreconsulter={setShowfiltreconsulter}
          updateCarto={updateCarto} regions={regions}
          regionOptions={regionOptions}
          departementOptions={departementOptions}
        />
      )}
    </>
  );
});

Filtre.displayName = 'Filtre';

export default Filtre;