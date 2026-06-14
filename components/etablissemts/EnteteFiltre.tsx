'use client';
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
    ];

    return (
        <motion.div
            className="p-2 m-2 max-w-6xl mx-auto text-center text-xxs md:text-xxs space-y-2"
        >
            {filterLabels.map(({ condition, text }) => condition ? (
                <motion.p key={text} className="text-xxs"                >
                    <span className="font-semibold">{text.split(":")[0]}:</span>{text.split(":")[1]}
                </motion.p>
            ) : null)}
        </motion.div>
    );
});

EnteteFiltre.displayName = "EnteteFiltre";

export default EnteteFiltre;