'use client';

import { fadeInUp } from "@/lib/libs/constants";
import type { CartoFiltre, DataStatistique, MenuItem, OptionValue } from "@/lib/libs/interface";
import { motion } from "framer-motion";
import { memo, useCallback, useState, useMemo } from "react";
import MenuItemCard from "./MenuItemCard";
import CarteStat from "../../map/CarteStat";
import BackButton from "./BackButton";
import EnteteFiltre from "./EnteteFiltre";
import FiltreForm from "./FiltreForm";

// ============ TYPES ============
interface FiltreProps {
  carto: CartoFiltre;
  regionOptions: OptionValue[];
  departementOptions: OptionValue[];
  regions: DataStatistique[];
  mainmenutitems: MenuItem[];
  setShowfiltreconsulter: (value: boolean) => void;
  updateCarto: (updates: Partial<CartoFiltre>) => void;
  isLoading?: boolean;
}

// ============ COMPOSANT ============
const FiltreResultat = memo(({ 
  regions, 
  mainmenutitems, 
  carto, 
  departementOptions,
  regionOptions, 
  updateCarto, 
  setShowfiltreconsulter,
  isLoading = false 
}: FiltreProps) => {
  const [showResults, setShowResults] = useState(false);

  // Vérification des données
  const hasData = useMemo(() => {
    return regions.length > 0 && mainmenutitems.length > 0;
  }, [regions, mainmenutitems]);

  // Gestionnaires
  const handleBack = useCallback(() => {
    setShowResults(false);
  }, []);

  const handleItemClick = useCallback((item: MenuItem) => {
    setShowfiltreconsulter(true);
    updateCarto({ tpsglobal: item.tpsglobal });
  }, [setShowfiltreconsulter, updateCarto]);

  const handleShowResults = useCallback(() => {
    setShowResults(true);
  }, []);

  // Rendu de la vue des résultats
  const renderResults = useCallback(() => (
    <motion.div 
      className="grid grid-cols-1 gap-4 max-w-6xl mx-auto mt-1" 
      {...fadeInUp}
    >
      <BackButton onClick={handleBack} />
      <EnteteFiltre carto={carto} />

      <div className="flex flex-col justify-center items-center">
        <motion.h3 
          {...fadeInUp} 
          transition={{ ...fadeInUp.transition, delay: 0.2, duration: 0.5 }}
          className="text-xs font-semibold text-gray-800 text-center"
        >
          RAPPORT DES DONNÉES SUR LES ÉTABLISSEMENTS HÔTELIERS
        </motion.h3>
      </div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {mainmenutitems.map((item) => (
          <MenuItemCard 
            key={item.tpsglobal} 
            item={item}
            onClick={() => handleItemClick(item)}
            showTrend={true}
          />
        ))}
      </motion.div>
    </motion.div>
  ), [carto, mainmenutitems, handleBack, handleItemClick]);

  // Rendu du formulaire
  const renderForm = useCallback(() => (
    <>
      <FiltreForm 
        regionOptions={regionOptions}
        departementOptions={departementOptions}
        carto={carto}
        updateCarto={updateCarto}
        setShowResults={handleShowResults}   
      />
      
      {hasData ? (
        <CarteStat data={regions} />
      ) : (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500 text-sm">
            {isLoading ? "Chargement des données..." : "Aucune donnée disponible"}
          </p>
        </div>
      )}
    </>
  ), [
    regionOptions, 
    departementOptions, 
    carto, 
    updateCarto, 
    handleShowResults,
    isLoading,
    hasData,
    regions
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full p-4 space-x-4"
    >
      {showResults ? renderResults() : renderForm()}
    </motion.div>
  );
});

FiltreResultat.displayName = 'FiltreResultat';

export default FiltreResultat;