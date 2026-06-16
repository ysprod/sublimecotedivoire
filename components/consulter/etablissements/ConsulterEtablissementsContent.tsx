'use client';
import { fadeInUp } from "@/lib/libs/constants";
import type { CartoFiltre, MenuItem } from "@/lib/libs/interface";
import { motion } from "framer-motion";
import { memo, useMemo } from "react";
import EtablissementsData from "./EtablissementsData";
import EnteteEtabDataFiltre from "./EnteteEtabDataFiltre";
import { valeurEntier } from "@/lib/libs/functions";
import { useSubMenuData } from "@/hooks/datakwaba/useSubMenuData";

interface EtablissementsFiltreProps {
    carto: CartoFiltre;
    selectedMenuItem?: MenuItem | null;
    mainmenutitems: MenuItem[];
    setSelectedMenuItem?: (item: MenuItem | null) => void;
}

const ConsulterEtablissementsContent = memo(({ carto, selectedMenuItem, mainmenutitems, setSelectedMenuItem, }: EtablissementsFiltreProps) => {

    const tpsglobal = useMemo(() => valeurEntier(carto.tpsglobal), [carto.tpsglobal]);

    const mymainMenuItem = useMemo(() => (
        mainmenutitems.find(item => item.tpsglobal === carto.tpsglobal) ?? mainmenutitems[0]
    ), [carto.tpsglobal, mainmenutitems]);

    const { submenutitems } = useSubMenuData(mymainMenuItem.nbetablissements);

    return (
        <motion.div className={"grid grid-cols-1 gap-2 p-4 max-w-6xl mx-auto"} {...fadeInUp}>
            {selectedMenuItem ? (
                <EnteteEtabDataFiltre
                    menuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem}
                />
            ) : (
                <EtablissementsData
                    tpsglobal={tpsglobal} setSelectedMenuItem={setSelectedMenuItem}
                    submenutitems={submenutitems} mymainMenuItem={mymainMenuItem}
                />
            )}
        </motion.div>
    );
});

ConsulterEtablissementsContent.displayName = "ConsulterEtablissementsContent";

export default ConsulterEtablissementsContent;