"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import CacheLink from "./CacheLink";

export default function Bandeau() {

    return (
        <div className="mx-auto flex w-full max-w-8xl flex-col items-center justify-center text-center">
            <CacheLink href="/" className="w-full sm:w-auto mb-4">
                <motion.div
                    initial={{ opacity: 0, y: -24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, type: "spring", stiffness: 90 }}
                    className="flex w-full flex-col items-center"
                >
                    <motion.div
                        initial={{ scale: 0.88, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.6, type: "spring", stiffness: 120 }}
                        className="relative flex justify-center"
                    >
                        <Image
                            src="/logos.png"
                            alt="Tourisme Côte d'Ivoire"
                            width={900}
                            height={240}
                            priority
                            className="relative h-auto w-[320px] object-contain sm:w-[320px] md:w-[480px]"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="flex justify-center"
                    >
                        <span className="max-w-2xl text-center text-[12px] font-extrabold uppercase leading-relaxed tracking-[0.14em] text-orange-700 sm:text-xs md:text-sm">
                            Tableau de bord de Centralisation et d'analyse des Données du sectecur hôtelier
                        </span>
                    </motion.div>
                </motion.div>
            </CacheLink>



        </div>
    );
}