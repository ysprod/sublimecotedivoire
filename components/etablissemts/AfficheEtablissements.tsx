'use client';
import { useEtablissements } from "@/hooks/datakwaba/useEtablissements";
import { TAB_ETAB_CONFIG } from "@/lib/libs/constants";
import type { Etablissement, MenuItem, TabType } from "@/lib/libs/interface";
import { motion } from "framer-motion";
import { memo, useCallback, useMemo, useState } from "react";
import ConsulterListeEtablissement from "./ConsulterListeEtablissement";
import EnteteFiltre from "./EnteteFiltre";
import FiltreForm from "./FiltreForm";
import TabButtonRender from "./TabButtonRender";
import Loader from "../commons/Loader";
import Erreur from "../commons/Erreur";

interface EtablissementsDataFiltreProps {
    etablissements: Etablissement[];
    initialActiveTab?: TabType;
    menuItem?: MenuItem;
    showfiltre?: boolean
}

const AfficheEtablissements = memo(({ etablissements, initialActiveTab = 'all', menuItem, showfiltre = true }: EtablissementsDataFiltreProps) => {

    const { departementOptions, regionOptions, updateCarto, carto, loading, errorMessage } = useEtablissements();

    const [activeTab, setActiveTab] = useState<TabType>(initialActiveTab);

    const filterByLocation = useCallback((etab: Etablissement) => (
        (!carto.region || etab.region === carto.region) &&
        (!carto.departement || etab.departement === carto.departement) &&
        (!carto.localite || etab.commune === carto.localite)
    ), [carto.region, carto.departement, carto.localite]);

    const filterByStatus = useCallback((etab: Etablissement) => (
        activeTab === 'upToDate' ? etab.cotisation === 'À jour' :
            activeTab === 'notUpToDate' ? etab.cotisation === 'Pas à jour' : true
    ), [activeTab]);

    const filteredEtablissements = useMemo(() => (
        etablissements.filter(etab => filterByLocation(etab) && filterByStatus(etab))
    ), [etablissements, filterByLocation, filterByStatus]);

    const handleTabChange = useCallback((tab: TabType) => { setActiveTab(tab); }, []);

    const { label } = TAB_ETAB_CONFIG[activeTab];

    const count = filteredEtablissements.length;

    const typeEtablissement = useMemo(() => {
        const title = menuItem?.title!.toLowerCase();
        if (title?.includes('hôtel') || title?.includes('hotel')) return 'Hôtels';
        if (title?.includes('résidence') || title?.includes('residence')) return 'Résidences';
        if (title?.includes('maisons') || title?.includes('maison d\'hotes')) return 'Maisons d\'hôtes';
        return 'Établissements';
    }, [menuItem?.title]);

    if (loading) return <Loader />;

    if (errorMessage) return <Erreur message={errorMessage} />;

    return (
        <>
            {showfiltre && <FiltreForm
                departementOptions={departementOptions} regionOptions={regionOptions}
                carto={carto} updateCarto={updateCarto} typeEtablissement={typeEtablissement}
            />}

            <motion.div className="flex flex-col items-center" >
                <div className="mb-2 flex flex-col items-center justify-center">

                    <motion.div>
                        <div className="flex border-b border-gray-300">
                            <TabButtonRender handleTabChange={handleTabChange} activeTab={activeTab} />
                        </div>

                        <div className="py-2">
                            <p className="text-center mb-1 text-sm font-medium">
                                {label} ({count})
                            </p>
                            <EnteteFiltre carto={carto} />
                            <ConsulterListeEtablissement etablissements={filteredEtablissements} key={`etab-list-${activeTab}-${count}`} />
                        </div>
                    </motion.div>
                </div>
            </motion.div></>
    );
});

AfficheEtablissements.displayName = "AfficheEtablissements";

export default AfficheEtablissements;