import { MenuItem } from "@/lib/libs/interface";
import { useCallback, useState } from "react";

const ICONS = {
    ETABLISSEMENTS: "/icons/batiment.png",
    HOTELS: "/icons/hotel.png",
    RESIDENCES: "/icons/residence.png",
    MAISONS: "/icons/maisondhote.png",
} as const;

const ETABLISSEMENT_TYPES = [
    {
        type: "HÔTELS",
        icon: ICONS.HOTELS,
        blackicon: "/icons/hotel-black.png",
        tpsglobal: 200,
        minRatio: 0.6,
        maxRatio: 0.7
    },
    {
        type: "RÉSIDENCES",
        icon: ICONS.RESIDENCES,
        blackicon: "/icons/residence-black.png",
        tpsglobal: 100,
        minRatio: 0.2,
        maxRatio: 0.3
    },
    {
        type: "MAISONS D'HÔTES",
        icon: ICONS.MAISONS,
        blackicon: "/icons/maisondhote-black.png",
        tpsglobal: 46,
        minRatio: 0.05,
        maxRatio: 0.15
    }
] as const;


const createMenuItem = (
    baseTitle: string,
    count: number,
    icon: string,
    tpsglobal: number,
    blackicon?: string
): MenuItem => ({
    nbetablissements: count,
    title: `${count} ${baseTitle}`,
    icon,
    tpsglobal,
    blackicon: blackicon || icon,
    id: baseTitle.toLowerCase().replace(/\s/g, '_'),
    count,
    trendValue: 0,
    iconSrc: icon,
    iconAlt: `Icône ${baseTitle}`,
    color: "text-black",
    bgColor: "bg-white",
    description: baseTitle
});

const createSubMenuItem = (
    type: string,
    count: number,
    icon: string,
    tpsglobal: number,
    blackicon: string
): MenuItem => ({
    ...createMenuItem(type, count, icon, tpsglobal, blackicon),
});

const generateSubMenuItems = (totalEtablissements: number): MenuItem[] => {
    let remaining = totalEtablissements;
    const items: MenuItem[] = [];

    for (let i = 0; i < ETABLISSEMENT_TYPES.length; i++) {
        const config = ETABLISSEMENT_TYPES[i];
        let count: number;

        if (i === ETABLISSEMENT_TYPES.length - 1) {
            count = Math.max(0, remaining);
        } else {
            const ratio = config.minRatio + Math.random() * (config.maxRatio - config.minRatio);
            count = Math.floor(totalEtablissements * ratio);
            remaining = Math.max(0, remaining - count);
        }

        items.push(createSubMenuItem(config.type, count, config.icon, config.tpsglobal, config.blackicon));
    }

    return items;
};

export const useSubMenuData = (totalEtablissements: number) => {
    const [subMenuItems, setSubMenuItems] = useState<MenuItem[]>(() =>
        generateSubMenuItems(totalEtablissements)
    );
    const refreshMenuData = useCallback(() => {
        const newItems = generateSubMenuItems(totalEtablissements);
        setSubMenuItems(newItems);
        return newItems;
    }, [totalEtablissements]);

    return { submenutitems: subMenuItems, refreshMenuData };
}; 