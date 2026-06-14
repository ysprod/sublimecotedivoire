'use client';
import { fadeInUp } from "@/lib/libs/constants";
import type { CartoFiltre, MenuItem } from "@/lib/libs/interface";
import { motion } from "framer-motion";
import { memo, useCallback, useEffect, useState } from "react";
import BackButton from "../recherche/BackButton";
import ConsulterEtablissementsContent from "./ConsulterEtablissementsContent";
import EnteteRapport from "./EnteteRapport";

interface EtablissementsFiltreProps {
    carto: CartoFiltre;
    shouldShowDataNavigation: boolean;
    mainmenutitems: MenuItem[];
    setshouldShowDataNavigation: (value: boolean) => void;
    updateCarto: (updates: Partial<CartoFiltre>) => void;
    setShowfiltreconsulter: (value: boolean) => void;
}

const ConsulterEtablissementsFiltre = memo(({ carto, mainmenutitems, shouldShowDataNavigation = false,
    updateCarto, setshouldShowDataNavigation, setShowfiltreconsulter, }: EtablissementsFiltreProps) => {

    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

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
    }, [selectedMenuItem, setShowfiltreconsulter, setshouldShowDataNavigation, shouldShowDataNavigation]);

    useEffect(() => { setSelectedMenuItem(null); }, []);

    useEffect(() => {
        if (selectedMenuItem && !shouldShowDataNavigation) { setshouldShowDataNavigation(true); }
    }, [selectedMenuItem, shouldShowDataNavigation, setshouldShowDataNavigation]);

    return (
        <motion.div className="grid grid-cols-1 gap-2 p-4 max-w-6xl mx-auto" {...fadeInUp}>
            <BackButton onClick={handleBackClick} />

            <EnteteRapport
                tpsglobal={carto.tpsglobal} shouldShowDataNavigation={shouldShowDataNavigation}
                setSelectedMenuItem={setSelectedMenuItem} selectedMenuItem={selectedMenuItem}
                mainmenutitems={mainmenutitems} updateCarto={updateCarto}
            />

            <ConsulterEtablissementsContent
                carto={carto}
                mainmenutitems={mainmenutitems}
                selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem}
            />
        </motion.div>
    );
});

ConsulterEtablissementsFiltre.displayName = "ConsulterEtablissementsFiltre";

export default ConsulterEtablissementsFiltre;