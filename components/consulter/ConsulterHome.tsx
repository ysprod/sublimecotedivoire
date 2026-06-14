"use client";
import { fadeInUp } from "@/libs/constants";
import { CartoFiltre, MenuItem } from "@/libs/interface";
import { motion } from "framer-motion";
import { memo, useCallback } from "react";
import Bandeau from "../commons/Bandeau";
import MenuItemCard from "./MenuItemCard";

interface ConsulterProps {
    mainmenutitems: MenuItem[];
    setShowfiltreconsulter: (value: boolean) => void;
    updateCarto: (updates: Partial<CartoFiltre>) => void;
}

const ConsulterHome = memo(({ mainmenutitems, setShowfiltreconsulter, updateCarto }: ConsulterProps) => {
    const handleButtonClick = useCallback((item: MenuItem) => {
        setShowfiltreconsulter(true);
        updateCarto({ tpsglobal: item.tpsglobal });
    }, [setShowfiltreconsulter, updateCarto]);

    return (
        <>
           <Bandeau />
         <motion.div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto" {...fadeInUp}>

            <motion.h3
                className="text-xxs font-semibold text-gray-800 text-center"
                {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}
            >
                RAPPORT DES DONNÉES SUR LES ÉTABLISSEMENTS HÔTELIERS DE CÔTE D&apos;IVOIRE
            </motion.h3>

            <motion.div
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
            >
                {mainmenutitems.map((item) => (<MenuItemCard key={item.tpsglobal} item={item} onClick={handleButtonClick} />))}
            </motion.div> 
        </motion.div>
        </>
       
    );
});

ConsulterHome.displayName = "ConsulterHome";

export default ConsulterHome;