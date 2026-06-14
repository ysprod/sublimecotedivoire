'use client';
import { motion } from "framer-motion";
import { fadeInUp, RAPPORTS } from "@/libs/constants";
import EnteteFiltre from "./EnteteFiltre";
import Navigation from "./Navigation";
import type { CartoFiltre, MenuItem } from "@/libs/interface";
import { memo, useMemo } from "react";
import EtablissementsDataNavigation from "../consulter/EtablissementDataNavigation";
import { valeurEntier } from "@/libs/functions";

interface MenuDiambraProps {
    carto: CartoFiltre;
    tpsglobal?: number | string;
    mainmenutitems: MenuItem[];
    shouldShowDataNavigation: boolean;
    selectedMenuItem?: MenuItem | null;
    setSelectedMenuItem: (item: MenuItem | null) => void;
    updateCarto: (updates: Partial<CartoFiltre>) => void
}

const useFormattedTitle = (tpsglobal: number | string) => {
    return useMemo(() => {
        const numericValue = typeof tpsglobal === 'string' ? parseInt(tpsglobal, 10) : tpsglobal;
        return (RAPPORTS[numericValue] || RAPPORTS[0]).replace(/ DE CÔTE D'IVOIRE$/, '');
    }, [tpsglobal]);
};

const EnteteRapport = memo(({ tpsglobal = 0, carto, shouldShowDataNavigation = false,
    mainmenutitems, selectedMenuItem, updateCarto, setSelectedMenuItem, }: MenuDiambraProps) => {

    const formattedTitle = useFormattedTitle(tpsglobal);

    return (
        <motion.div className="grid grid-cols-1 gap-6 p-2 max-w-6xl mx-auto" {...fadeInUp}>

            <EnteteFiltre carto={carto} />

            {shouldShowDataNavigation ? (
                <EtablissementsDataNavigation
                    setSelectedMenuItem={setSelectedMenuItem} selectedMenuItem={selectedMenuItem}
                    carto={{ tpsglobal: valeurEntier(tpsglobal) }} mainmenutitems={mainmenutitems}
                />
            ) : (
                <>
                    <motion.h2
                        className="text-xxs md:text-xxs font-bold text-center text-gray-800" {...fadeInUp}
                        transition={{ ...fadeInUp.transition, delay: 0.2 }}
                    >
                        {formattedTitle}
                    </motion.h2>
                    <Navigation updateCarto={updateCarto} mainmenutitems={mainmenutitems} currentActive={valeurEntier(tpsglobal)} />
                </>
            )}
        </motion.div>
    );
});

EnteteRapport.displayName = "EnteteRapport";

export default EnteteRapport;