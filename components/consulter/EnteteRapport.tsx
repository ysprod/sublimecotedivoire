'use client';
import { motion } from "framer-motion";
import { fadeInUp, RAPPORTS } from "@/libs/constants";
import Navigation from "./Navigation";
import { CartoFiltre, MenuItem } from "@/libs/interface";
import { memo, useMemo } from "react";
import EtablissementsDataNavigation from "./EtablissementDataNavigation";
import { valeurEntier } from "@/libs/functions";

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

    const formattedTitle = useMemo(() => { return RAPPORTS[numericTpsglobal] || RAPPORTS[0]; }, [numericTpsglobal]);

    return (
        <motion.div className="grid grid-cols-1 gap-6 p-2 max-w-6xl mx-auto" {...fadeInUp}>

            {shouldShowDataNavigation ? (
                <EtablissementsDataNavigation
                    setSelectedMenuItem={setSelectedMenuItem} selectedMenuItem={selectedMenuItem}
                    carto={{ tpsglobal: numericTpsglobal }} mainmenutitems={mainmenutitems}
                />
            ) : (
                <><motion.h2
                    className="text-xxs md:text-xxs font-bold text-center text-gray-800"
                    {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}
                >
                    {formattedTitle}
                </motion.h2>
                    <Navigation currentActive={numericTpsglobal} mainmenutitems={mainmenutitems} updateCarto={updateCarto} />
                </>
            )}
        </motion.div>
    );
});

EnteteRapport.displayName = "EnteteRapport";

export default EnteteRapport;