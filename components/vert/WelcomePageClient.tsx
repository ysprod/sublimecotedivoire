"use client";
import { useMenuData } from "@/hooks/vert/useMenuData";
import { fadeInUp } from "@/libs/constants";
import { MenuItem } from "@/libs/interface";
import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Bandeau from "../commons/Bandeau";
import CacheLink from "../commons/CacheLink";
import MenuItemCard from "./MenuItemCard";

export default function TourismDashboard() {
  const router = useRouter();
  const { mainmenutitems } = useMenuData();

  const handleButtonClick = useCallback((item: MenuItem) => {
    router.push(`/consulter/?tpsglobal=${item.tpsglobal}`);
  }, [router]);

  return (
    <div className="mx-auto max-w-4xl px-3 sm:px-4 lg:px-6">
      <Bandeau />
      <motion.div className="grid grid-cols-1 mt-4 gap-8 max-w-6xl mx-auto" {...fadeInUp}>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
        >
          {mainmenutitems.map((item) => (<MenuItemCard key={item.tpsglobal} item={item} onClick={handleButtonClick} />))}
        </motion.div>
      </motion.div>

      <CacheLink href="/recherche" >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="relative z-10 flex justify-center mt-4"
        >
          <Image
            src="/carteverte.png"
            alt="Touristes en Côte d'Ivoire"
            width={400}
            height={400}
            className="drop-shadow-2xl sm:w-128 sm:h-128"
          />
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