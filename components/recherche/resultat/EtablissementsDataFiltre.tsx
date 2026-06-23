'use client';
import { motion } from "framer-motion";
import { memo, useEffect } from "react";
import type { CartoFiltre, MenuItem } from "@/lib/libs/interface";
import { DATA_LOADING, fadeInUp } from "@/lib/libs/constants";
import { useEtablissementsData } from "@/hooks/datakwaba/recherche/useEtablissementsData";
import HistoriqueLoader from "../../connexions/HistoriqueLoader";
import InfoStat from "../../consulter/InfoStat";
import AfficheEtablissements from "../../etablissemts/AfficheEtablissements";

interface EtablissementsDataFiltreProps {
    menuItem: MenuItem;
    shouldShowDataNavigation: boolean;
    carto: CartoFiltre;
    setSelectedMenuItem?: (item: MenuItem | null) => void;
    setshouldShowDataNavigation: (value: boolean) => void;
}

const EtablissementsDataFiltre = memo(({ shouldShowDataNavigation = false, menuItem,
    setSelectedMenuItem, setshouldShowDataNavigation,
}: EtablissementsDataFiltreProps) => {

    const { etablissements, isLoading } = useEtablissementsData(menuItem.nbetablissements);

    useEffect(() => {
        if (!shouldShowDataNavigation) { setshouldShowDataNavigation(true); }
    }, [setshouldShowDataNavigation, shouldShowDataNavigation]);

    if (isLoading) { return (<HistoriqueLoader texte={DATA_LOADING} />); }

    return (
        <motion.div className="w-full flex flex-col items-center" {...fadeInUp}>
            <div className="mb-2 w-full flex flex-col items-center justify-center max-w-6xl">
                <InfoStat
                    item={menuItem} inverse
                    setSelectedMenuItem={setSelectedMenuItem} showBackButton={!!setSelectedMenuItem}
                />
                <AfficheEtablissements etablissements={etablissements} menuItem={menuItem} showfiltre={false} />
            </div>
        </motion.div>
    );
});

EtablissementsDataFiltre.displayName = "EtablissementsDataFiltre";

export default EtablissementsDataFiltre;