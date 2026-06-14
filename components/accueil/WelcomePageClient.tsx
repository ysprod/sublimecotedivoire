"use client";
import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import Image from "next/image";
import CacheLink from "../commons/CacheLink";


export default function TourismDashboard() {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-5xl px-4 flex-col items-center justify-center text-center">
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
            Plateforme Nationale de Centralisation des Données du Tourisme et des Loisirs
          </span>
        </motion.div>
      </motion.div>
      <CacheLink href="/vert" className="w-full sm:w-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7, type: "spring", stiffness: 100 }}
          className="mt-8 flex w-full justify-center sm:mt-10"
        >
          <div className="relative flex justify-center">
            <div className="absolute inset-0 rounded-full bg-orange-300/20 blur-3xl" />
            <Image
              src="/carteorange.png"
              alt="Tourisme en Côte d'Ivoire"
              width={260}
              height={260}
              priority
              className="relative h-auto w-[240px] drop-shadow-2xl sm:w-[260px] md:w-[300px]"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.65 }}
          className="mt-8 flex w-full justify-center sm:mt-10"
        >

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="
                group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden
                rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500
                bg-[length:200%_100%] px-5 py-4 text-center text-sm font-bold text-white
                shadow-[0_14px_40px_rgba(249,115,22,0.28)] transition-all duration-500
                hover:bg-[position:100%_0] hover:shadow-[0_18px_50px_rgba(249,115,22,0.35)]
                sm:w-auto sm:px-8 sm:text-base md:px-10 md:py-4 md:text-lg
              "
            aria-label="Consulter les données du tourisme"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Cliquez pour consulter les données
              <ZoomIn className="h-5 w-5 transition-transform group-hover:scale-110" />
            </span>

            <motion.div
              animate={{ x: [-180, 220] }}
              transition={{ repeat: Infinity, duration: 2.2, repeatDelay: 3 }}
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/20 via-white/10 to-transparent"
            />
          </motion.button>

        </motion.div>
      </CacheLink>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-10 w-full pt-2 text-center sm:mt-14 sm:pt-4"
      >
        <div className="mx-auto mb-4 h-px w-28 bg-gradient-to-r from-transparent via-orange-300 to-transparent sm:w-36" />
        <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-xs">
          République de Côte d&apos;Ivoire — Ministère du Tourisme et des Loisirs
        </p>
        <br></br> <br></br> <br></br> <br></br>
      </motion.div>
    </div>
  );
}
