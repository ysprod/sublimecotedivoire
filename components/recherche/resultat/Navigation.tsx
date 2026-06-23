"use client";
import { motion } from "framer-motion";
import { useCallback, memo } from "react";
import type { CartoFiltre, MenuItem } from "@/lib/libs/interface";
import { navAnimation } from "@/lib/libs/constants";
import NavButton from "./NavButton";

interface NavigationProps {
  currentActive?: number;
  mainmenutitems: MenuItem[];
  updateCarto: (updates: Partial<CartoFiltre>) => void;
}

const Navigation = memo(({ currentActive = 0, mainmenutitems, updateCarto }: NavigationProps) => {

  const handleButtonClick = useCallback((item: MenuItem) => {
    updateCarto({ tpsglobal: item.tpsglobal });
  }, [updateCarto]);

  return (
    <motion.nav className="flex w-full" {...navAnimation} aria-label="Navigation principale">

      {mainmenutitems.map((item) => {
        const isActive = currentActive === item.tpsglobal;

        return (<NavButton key={item.tpsglobal} handleButtonClick={handleButtonClick}
          item={item} isActive={isActive} />);
      })}

    </motion.nav>
  );
});

Navigation.displayName = "Navigation";

export default Navigation;