"use client";
import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import Image from "next/image";
import CacheLink from "../commons/CacheLink";

export default function Bouton() {

    return (
        <div className="mx-auto max-w-4xl">
            <CacheLink href="/recherche" >
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 18 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.7, type: "spring", stiffness: 100 }}
                    className="mt-8 flex w-full justify-center sm:mt-10"
                >
                    <div className="relative flex justify-center">
                        <div className="absolute inset-0 rounded-full bg-orange-300/20 blur-3xl" />
                        <Image
                            src="/carteverte.png"
                            alt="Tourisme en Côte d'Ivoire"
                            width={260}
                            height={260}
                            priority
                            className="relative h-auto w-[240px] drop-shadow-2xl sm:w-[260px] md:w-[300px]"
                        />
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative mt-6 inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-green-800 bg-[length:200%_100%] px-6 py-3 text-base font-bold text-white shadow-xl transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-2xl sm:gap-3 sm:px-8 sm:py-3.5 sm:text-lg"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Consulter les données par région, département et commune
                            <ZoomIn className="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
                        </span>
                        <motion.div
                            animate={{ x: [-100, 100] }}
                            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/20 to-transparent"
                        />
                    </motion.button>
                </motion.div>
            </CacheLink>
            <br /><br /><br />
        </div>
    );
}