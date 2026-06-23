import { MenuItem } from "@/lib/libs/interface";
import { useCallback, useState, useMemo } from "react";

const ETABLISSEMENT_TYPES = [
    {
        type: "HÔTELS",
        icon: "/icons/hotel.png",
        blackicon: "/icons/hotel-black.png",
        tpsglobal: 200,
        ratio: 0.65,
        minRatio: 0.6,
        maxRatio: 0.7
    },
    {
        type: "RÉSIDENCES",
        icon: "/icons/residence.png",
        blackicon: "/icons/residence-black.png",
        tpsglobal: 100,
        ratio: 0.25,
        minRatio: 0.2,
        maxRatio: 0.3
    },
    {
        type: "MAISONS D'HÔTES",
        icon: "/icons/maisondhote.png",
        blackicon: "/icons/maisondhote-black.png",
        tpsglobal: 46,
        ratio: 0.10,
        minRatio: 0.05,
        maxRatio: 0.15
    }
] as const;

const createSubMenuItem = (
    type: string,
    count: number,
    icon: string,
    tpsglobal: number,
    blackicon: string
): MenuItem => ({
    nbetablissements: count,
    title: `${count} ${type}`,
    icon,
    tpsglobal,
    blackicon,
     id: 'baseTitle.toLowerCase ',
  count,
  trendValue: 0,
  iconSrc: icon,
  iconAlt: `Icône  `,
  color: "text-black",
  bgColor: "bg-white",
  description: "baseTitle"
});

const generateSubMenuData = (totalEtablissements: number): { SUB_MENU_ITEMS: MenuItem[] } => {
    let remaining = totalEtablissements;
    const items = [];

    for (let i = 0; i < ETABLISSEMENT_TYPES.length; i++) {
        const config = ETABLISSEMENT_TYPES[i];
        let count: number;

        if (i === ETABLISSEMENT_TYPES.length - 1) {
            count = remaining;
        } else {
            const ratioVariation = config.minRatio + Math.random() * (config.maxRatio - config.minRatio);
            count = Math.floor(totalEtablissements * ratioVariation);
            remaining -= count;
        }

        items.push(createSubMenuItem(config.type, count, config.icon, config.tpsglobal, config.blackicon));
    }

    return { SUB_MENU_ITEMS: items, };
};

export function useSubMenuData(totalEtablissements: number) {
    const [menuData, setMenuData] = useState(() => generateSubMenuData(totalEtablissements));

    const refreshMenuData = useCallback(() => {
        const newData = generateSubMenuData(totalEtablissements);
        setMenuData(newData);
        return newData;
    }, [totalEtablissements]);

    const submenutitems = useMemo(() => menuData.SUB_MENU_ITEMS, [menuData]);

    return { menuData, refreshMenuData, submenutitems, };
}