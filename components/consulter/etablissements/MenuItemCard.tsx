'use client';
import { TITLE_SPLIT_REGEX } from "@/lib/libs/constants";
import type { MenuItem } from "@/lib/libs/interface";
import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import { memo, useCallback } from "react";

interface MenuItemCardProps {
    item: MenuItem;
    onClick: (item: MenuItem) => void;
    className?: string;
    iconSize?: number;
}

const MenuItemCard = memo(({ item, onClick, className, iconSize = 80 }: MenuItemCardProps) => {
    const defaultRenderTitle = useCallback((title: string) => {
        const [numberPart, ...textParts] = title.split(TITLE_SPLIT_REGEX);

        return (
            <div className="flex flex-col items-center justify-center">
                <span className="text-blue-600 font-bold">{numberPart}</span>
                {textParts.length > 0 && (<span className="text-gray-900 text-xs">{textParts.join(' ')}</span>)}
            </div>
        );
    }, []);

    const handleClick = useCallback(() => { onClick(item); }, [item, onClick]);

    return (
        <motion.button
            onClick={handleClick}
            className={clsx(
                "p-1 flex flex-col items-center justify-center transition-all duration-300",
                "bg-white rounded-lg hover:shadow-lg focus:outline-none",
                "focus:ring-2 focus:ring-black focus:ring-opacity-50", className
            )}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} aria-label={`Accéder à ${item.title}`}
        >
            {item.icon && (
                <Image src={item.icon} alt={item.title || "Menu item"} width={iconSize} height={iconSize}
                    className="mb-3 w-24 h-24 object-contain" priority={false}
                />
            )}

            {item.title && (
                <div className="text-center min-h-[40px] flex items-center">
                    {defaultRenderTitle(item.title)}
                </div>
            )}

        </motion.button>
    );
});

MenuItemCard.displayName = "MenuItemCard";

export default MenuItemCard;