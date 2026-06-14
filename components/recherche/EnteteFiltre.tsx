'use client';
import { fadeInUp } from "@/lib/libs/constants";
import { formatMoisFiltre } from "@/lib/libs/functions";
import { CartoFiltre } from "@/lib/libs/interface";
import { motion } from "framer-motion";
import { memo } from "react";

interface MenuDiambraProps {
    carto: CartoFiltre;
}

const EnteteFiltre = memo(({ carto }: MenuDiambraProps) => {
    const filterLabels = [
        { condition: carto.region, text: `Région/District : ${carto.region}` },
        { condition: carto.departement, text: `Département : ${carto.departement}` },
        { condition: carto.localite, text: `Commune : ${carto.localite}` },
        { condition: carto.annee, text: `Année : ${carto.annee}` },
        { condition: carto.mois, text: `Mois : ${formatMoisFiltre(carto.mois)}` },
    ];

    return (
        <motion.div
            className="p-2 max-w-6xl mx-auto text-center text-base md:text-lg font-medium space-y-2" {...fadeInUp}
        >
            {filterLabels.map(({ condition, text }, index) => condition ? (
                <motion.p
                    key={text}
                    className="capitalize" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index, duration: 0.4 }}
                >
                    <span className="font-semibold">{text.split(":")[0]}:</span>{text.split(":")[1]}
                </motion.p>
            ) : null)}
        </motion.div>
    );
});

EnteteFiltre.displayName = "EnteteFiltre";

export default EnteteFiltre;