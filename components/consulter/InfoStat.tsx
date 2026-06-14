'use client';
import { motion } from "framer-motion";
import clsx from "clsx";
import type { MenuItem } from "@/lib/libs/interface";
import Image from "next/image";
import { memo, useCallback } from "react";
import FormattedTitle from "./FormattedTile";

interface InfoStatProps {
  item: MenuItem;
  tpsglobal?: number;
  inverse?: boolean;
  showBackButton?: boolean;
  setSelectedMenuItem?: (item: MenuItem | null) => void;
}

const InfoStat = memo(({ item, inverse = false, tpsglobal = 1, setSelectedMenuItem, showBackButton = false }: InfoStatProps) => {
  const handleClick = useCallback(() => {
    if (inverse) {
      if (item.title && item.title.includes("ÉTABLISSEMENTS")) { setSelectedMenuItem?.(item); }
    } else {
      setSelectedMenuItem?.(item);
    }
  }, [inverse, item, setSelectedMenuItem]);

  return (
    <motion.div className="relative" whileHover={{ scale: 1.02 }}>
      <motion.button
        onClick={handleClick}
        className={clsx("w-full flex flex-col items-center justify-center",
          "bg-white rounded-lg transition-all duration-300 hover:shadow-lg",
          "focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50", "cursor-pointer",
          { "hover:scale-105": !showBackButton, "pt-4": showBackButton }
        )}
        whileHover={!showBackButton ? { scale: 1.05 } : undefined}
        whileTap={!showBackButton ? { scale: 0.95 } : undefined}
        aria-label={`Accéder à ${item.title || "cette information"}`}
      >
        <Image
          src={item.icon || "/batiment.png"} alt={item.title || "Information"}
          width={48} height={48} className="mb-4 w-16 h-16 object-contain" priority={false}
        />

        <div className="text-xxs font-semibold text-center whitespace-pre-line">
          <FormattedTitle item={item} inverse={inverse} tpsglobal={tpsglobal} />
        </div>
      </motion.button>
    </motion.div>
  );
});

InfoStat.displayName = "InfoStat";

export default InfoStat;