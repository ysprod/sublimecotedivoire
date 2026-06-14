'use client';
import { fadeInUp } from "@/lib/libs/constants";
import { valeurEntier } from "@/lib/libs/functions";
import { CartoFiltre, MenuItem } from "@/lib/libs/interface";
import { motion } from "framer-motion";
import { memo, useMemo } from "react";
import EtablissementsDataNavigation from "./EtablissementDataNavigation";
import Navigation from "./Navigation";

interface MenuDiambraProps {
    tpsglobal?: number | string;
    shouldShowDataNavigation: boolean;
    selectedMenuItem?: MenuItem | null;
    mainmenutitems: MenuItem[];
    setSelectedMenuItem: (item: MenuItem | null) => void;
    updateCarto: (updates: Partial<CartoFiltre>) => void;
}

const EnteteRapport = memo(({ tpsglobal = 0, shouldShowDataNavigation = false, selectedMenuItem,
    mainmenutitems, updateCarto, setSelectedMenuItem, }: MenuDiambraProps) => {
    const numericTpsglobal = useMemo(() => valeurEntier(tpsglobal), [tpsglobal]);
    return (
        <motion.div className="grid grid-cols-1 gap-6 p-2 max-w-6xl mx-auto" {...fadeInUp}>
            {shouldShowDataNavigation ? (
                <EtablissementsDataNavigation
                    setSelectedMenuItem={setSelectedMenuItem} selectedMenuItem={selectedMenuItem}
                    carto={{ tpsglobal: numericTpsglobal }} mainmenutitems={mainmenutitems}
                />
            ) : (
                
                    <Navigation currentActive={numericTpsglobal} mainmenutitems={mainmenutitems} updateCarto={updateCarto} />
               
            )}
        </motion.div>
    );
});

EnteteRapport.displayName = "EnteteRapport";

export default EnteteRapport;