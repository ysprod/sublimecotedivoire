'use client';
import { motion } from "framer-motion";
import { MenuItem } from "@/libs/interface";
import PieChart from "./PieChart";
import { fadeInUp } from "@/libs/constants";
import { memo } from "react";

interface CharteProps {
    menuItems: MenuItem[];
}

const Charte = memo(({ menuItems }: CharteProps) => {
    return (
        <motion.div className="w-full bg-white p-2 md:p-4 m-4 max-w-4xl mx-auto" {...fadeInUp}>
            <PieChart menuItems={menuItems} />
        </motion.div>
    );
});

Charte.displayName = "Charte";

export default Charte;