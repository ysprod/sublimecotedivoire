'use client';
import type { MenuItem } from "@/lib/libs/interface";
import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import { memo, useCallback } from "react"; 
import { STAT_LABEL_MAP } from "@/lib/libs/constants";
import { useMemo } from "react";

interface InfoStatProps {
    item: MenuItem;
    tpsglobal?: number;
    inverse?: boolean;
}

const FormattedTitle = memo(({ item, inverse = false, tpsglobal = 1 }: InfoStatProps) => {

    const formattedTitle = useMemo(() => {
        if (!item.title) return null;

        const match = item.title.match(/^(\d+)\s(.+)$/);
        if (!match) return item.title;

        const numberPart = match[1];
        const textPart = match[2];
        const modifiedText = STAT_LABEL_MAP[tpsglobal] || "";

        return (
            <>
                <span className="text-gray-900">{inverse ? numberPart : textPart}</span>
                <br />
                <div>
                    <span className="text-blue-600 font-bold">{inverse ? textPart : numberPart}</span>
                    {!inverse && modifiedText && (<span className="text-blue-600 font-bold"> {modifiedText}</span>)}
                </div>
            </>
        );

    }, [item.title, inverse, tpsglobal]);

    return formattedTitle || <span className="text-gray-800">non spécifié</span>;
}); 

interface InfoStatProps {
  item: MenuItem;
  tpsglobal?: number;
  inverse?: boolean;
  showBackButton?: boolean;
  setSelectedMenuItem?: (item: MenuItem | null) => void;
  ononClick?: (item: MenuItem) => void;
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