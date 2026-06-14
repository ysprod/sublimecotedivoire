"use client";
import { motion } from "framer-motion";
import { memo, useCallback } from "react";
import EnteteFiltre from "./EnteteFiltre";
import BackButton from "./BackButton";
import MenuItemCard from "../consulter/MenuItemCard";
import { CartoFiltre, MenuItem } from "@/libs/interface";
import { fadeInUp } from "@/libs/constants";

interface MenuDiambraFiltreProps {
  carto: CartoFiltre;
  onBack: () => void;
  mainmenutitems: MenuItem[];
  setShowfiltreconsulter: (value: boolean) => void;
  updateCarto: (updates: Partial<CartoFiltre>) => void;
}

const MenuDiambraFiltre = memo(({ carto, mainmenutitems, onBack, setShowfiltreconsulter, updateCarto }: MenuDiambraFiltreProps) => {

  const nParams = useCallback((item: MenuItem) => {
    setShowfiltreconsulter(true);
    updateCarto({ tpsglobal: item.tpsglobal });
  }, [setShowfiltreconsulter, updateCarto]);

  return (
    <motion.div className="grid grid-cols-1 gap-4 max-w-6xl mx-auto mt-1" {...fadeInUp}>
      <BackButton onClick={onBack} />
      <EnteteFiltre carto={carto} />

      <div className="flex flex-col justify-center items-center">
        <motion.h3 {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2, duration: 0.5 }}
          className="text-xxs font-semibold text-gray-800 text-center" >
          RAPPORT DES DONNÉES SUR LES ÉTABLISSEMENTS HÔTELIERS
        </motion.h3>
      </div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
      >
        {mainmenutitems.map((item) => (<MenuItemCard key={item.tpsglobal} item={item} onClick={() => nParams(item)} />))}
      </motion.div>

    </motion.div>
  );
});

MenuDiambraFiltre.displayName = "MenuDiambraFiltre";

export default MenuDiambraFiltre;