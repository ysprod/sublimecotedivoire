"use client";
import { useVert } from "@/hooks/datakwaba/useVert";
import { motion } from "framer-motion";
import Bandeau from "../commons/Bandeau";
import StatCard from "./StatCard";
import Loader from "../commons/Loader";
import { Bouton } from "./Feature";

export default function TourismDashboard() {
  const { isPending, dashboardData, handleCardClick, } = useVert();

  return (
    <div className="flex flex-col items-center w-full mx-auto px-4 py-4 space-y-4">
      <Bandeau />

      {isPending ? (<Loader />) : (<>
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="transform transition-all duration-300 hover:scale-[1.02]"
              >
                <StatCard
                  item={item}
                  onClick={handleCardClick}
                  priority={index === 0}
                />
              </motion.div>
            ))}
          </div>
        </div>
        <Bouton />
      </>)}
    </div>
  );
}