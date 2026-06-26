'use client';
import { useSubMenuData } from "@/hooks/datakwaba/commons/useSubMenuData";
import { navAnimation } from "@/lib/libs/constants";
import { CartoFiltre, MenuItem } from "@/lib/libs/interface";
import { motion } from "framer-motion";
import { memo, useMemo } from "react";

interface MenuDiambraProps {
    setSelectedMenuItem: (item: MenuItem | null) => void;
    selectedMenuItem?: MenuItem | null;
    carto: CartoFiltre;
    mainmenutitems: MenuItem[];
}

const EtablissementsDataNavigation = memo(({ carto, mainmenutitems }: MenuDiambraProps) => {

    const mainMenuItem = useMemo(() => (
        mainmenutitems.find(item => item.tpsglobal === carto.tpsglobal) ?? mainmenutitems[0]
    ), [carto.tpsglobal, mainmenutitems]);

    const { submenutitems } = useSubMenuData(mainMenuItem.nbetablissements);

    const { items } = useMemo(() => {
        const total = submenutitems.reduce((sum, item) => sum + (item.nbetablissements || 0), 0);
        const mainMenuItem = {
            nbetablissements: total,
            title: `${total} ÉTABLISSEMENTS`,
            icon: "/icons/batiment.png",
            tpsglobal: 0,
            blackicon: "/icons/batiment.png"
        };
        return { items: [mainMenuItem, ...submenutitems] };
    }, [submenutitems]);

    return (
        <motion.nav className="flex w-full" {...navAnimation} aria-label="Navigation">
            {items.map(() => (
                <></>
                // <InfoStatNavigation
                //     key={item.title}
                //     item={item}
                //     setSelectedMenuItem={setSelectedMenuItem}
                //     isActive={selectedMenuItem?.title === item.title}
                // />
            ))}
        </motion.nav>
    );
});

EtablissementsDataNavigation.displayName = "EtablissementsDataNavigation";

export default EtablissementsDataNavigation;