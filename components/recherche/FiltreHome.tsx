'use client';
import { motion } from "framer-motion";
import { memo, useCallback, useMemo, useState } from "react";
import type { CartoFiltre, MenuItem } from "@/libs/interface";
import { fadeInUp, filtremoov } from "@/libs/constants";
import EnteteRapport from "./EnteteRapport";
import BackButton from "./BackButton";
import EtablissementsDataFiltre from "./EtablissementsDataFiltre";
import { useSubMenuData } from "@/hooks/useSubMenuData";
import { valeurEntier } from "@/libs/functions";
import EtablissementsData from "./EtablissementsData";

interface EtablissementsFiltreProps {
    carto: CartoFiltre;
    mainmenutitems: MenuItem[];
    shouldShowDataNavigation: boolean;
    setshouldShowDataNavigation: (value: boolean) => void;
    setShowfiltreconsulter: (value: boolean) => void;
    updateCarto: (updates: Partial<CartoFiltre>) => void;
}

const FiltreHome = memo(({ carto, shouldShowDataNavigation, mainmenutitems,
    setshouldShowDataNavigation, setShowfiltreconsulter, updateCarto }: EtablissementsFiltreProps) => {
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

    const handleBackClick = useCallback(() => {
        if (selectedMenuItem) {
            setSelectedMenuItem(null);
        } else if (shouldShowDataNavigation) {
            setshouldShowDataNavigation(false);
        } else {
            setShowfiltreconsulter(false);
        }
    }, [selectedMenuItem, shouldShowDataNavigation, setShowfiltreconsulter, setshouldShowDataNavigation]);

    const numericTpsglobal = useMemo(() => valeurEntier(carto.tpsglobal), [carto.tpsglobal]);

    const mymainMenuItem = useMemo(() => (
        mainmenutitems.find(item => item.tpsglobal === carto.tpsglobal) ?? mainmenutitems[0]
    ), [carto.tpsglobal, mainmenutitems]);

    const { submenutitems } = useSubMenuData(mymainMenuItem.nbetablissements);

    return (
        <motion.div className="grid grid-cols-1 gap-8 p-4 max-w-6xl mx-auto" {...fadeInUp}>
            <BackButton onClick={handleBackClick} />

            <EnteteRapport
                tpsglobal={carto.tpsglobal} carto={carto}
                mainmenutitems={mainmenutitems} shouldShowDataNavigation={shouldShowDataNavigation}
                updateCarto={updateCarto} setSelectedMenuItem={setSelectedMenuItem}
                selectedMenuItem={selectedMenuItem}
            />

            <motion.div className="grid grid-cols-1 gap-4 p-4 max-w-6xl mx-auto" {...filtremoov}>
                {selectedMenuItem ? (
                    <EtablissementsDataFiltre
                        menuItem={selectedMenuItem!}
                        setSelectedMenuItem={setSelectedMenuItem}
                        setshouldShowDataNavigation={setshouldShowDataNavigation}
                        shouldShowDataNavigation={shouldShowDataNavigation}
                        carto={carto} />
                ) : (
                    <EtablissementsData
                        tpsglobal={numericTpsglobal} setSelectedMenuItem={setSelectedMenuItem}
                        submenutitems={submenutitems} mymainMenuItem={mymainMenuItem}
                    />
                )}
            </motion.div>
        </motion.div>
    );
});

FiltreHome.displayName = "FiltreHome";

export default FiltreHome;