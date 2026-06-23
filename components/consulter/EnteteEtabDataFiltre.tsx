'use client';
import { motion } from "framer-motion";
import { memo } from "react";
import type { MenuItem } from "@/lib/libs/interface";
import { DATA_LOADING, fadeInUp } from "@/lib/libs/constants";
import AfficheEtablissements from "../etablissemts/AfficheEtablissements";
import HistoriqueLoader from "../connexions/HistoriqueLoader";
import { useEtablissementsData } from "@/hooks/datakwaba/recherche/useEtablissementsData";
import InfoStat from "./InfoStat";

interface EtablissementsDataFiltreProps {
    menuItem: MenuItem;
    setSelectedMenuItem?: (item: MenuItem | null) => void;
}

const EnteteEtabDataFiltre = memo(({ menuItem, setSelectedMenuItem }: EtablissementsDataFiltreProps) => {

    const { etablissements, isLoading } = useEtablissementsData(menuItem.nbetablissements);

    if (isLoading) { return (<HistoriqueLoader texte={DATA_LOADING} />); }

    return (
        <motion.div className="w-full flex flex-col items-center" {...fadeInUp}>

            <div className="mb-2 w-full flex flex-col items-center justify-center max-w-6xl">
                <InfoStat item={menuItem} inverse setSelectedMenuItem={setSelectedMenuItem} />
                <AfficheEtablissements etablissements={etablissements} menuItem={menuItem} />
            </div>

        </motion.div>
    );
});

EnteteEtabDataFiltre.displayName = "EnteteEtabDataFiltre";

export default EnteteEtabDataFiltre;