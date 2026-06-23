"use client";
import { motion } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";
import { memo } from "react";
import type { MenuItem } from "@/lib/libs/interface";
import { buttonAnimation } from "@/lib/libs/constants";

interface NavigationProps {
    item: MenuItem;
    isActive?: boolean;
    handleButtonClick: (item: MenuItem) => void;
}

const NavButton = memo(({ handleButtonClick, item, isActive }: NavigationProps) => {

    const baseButtonClass = clsx(
        "flex-1 flex flex-col items-center justify-center",
        "p-0 rounded-lg transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    );

    const buttonClass = clsx(baseButtonClass, isActive
        ? "bg-blue-600 text-white shadow-lg" : "bg-white hover:bg-blue-50 text-gray-800");

    return (
        <motion.button
            key={item.tpsglobal}
            onClick={() => handleButtonClick(item)}
            className={buttonClass}
            {...buttonAnimation}
            aria-current={isActive ? "page" : undefined}
        >
            <div className="relative w-12 h-12">
                <Image
                    src={item.icon!} alt={item.title!} fill
                    className={clsx("object-contain", isActive && "invert")}
                    sizes="(max-width: 768px) 48px, 48px"
                    priority={isActive}
                />
            </div>

            <span className="sr-only">{item.title}</span>
        </motion.button>
    );
});

NavButton.displayName = "NavButton";

export default NavButton;