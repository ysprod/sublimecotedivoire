'use client';
import Charte from "@/components/charts/Charte";
import { ReportButton } from "@/components/commons/ReportButton";
import { usePrincipale } from "@/hooks/datakwaba/hotels/usePrincipale";
import { PERIOD_BUTTONS } from "@/lib/libs/constants";
import { PeriodType } from "@/lib/libs/interface";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Hotel } from "lucide-react";
import dynamic from 'next/dynamic';
import { memo } from "react";
import InfoStat from "./infostat/InfoStat";

const Bandeau = dynamic(() => import("@/components/commons/Bandeau"), { ssr: true });
const BackButton = dynamic(() => import("@/components/commons/BackButton"), { ssr: true });

const PeriodButtons = memo(({
  activePeriod,
  onPeriodChange
}: {
  activePeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-2 w-full max-w-3xl justify-center">
      {PERIOD_BUTTONS.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => onPeriodChange(id)}
          className={clsx(
            "group relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300",
            "flex items-center gap-2",
            activePeriod === id
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-100 scale-105"
              : "bg-white text-gray-600 hover:text-gray-900 hover:shadow-md hover:scale-102 border border-gray-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          )}
        >
          <span className="text-lg">{icon}</span>
          <span>{label}</span>
          {activePeriod === id && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
});

const ViewHotelsButton = memo(({
  onClick,
  isLoading,
  className
}: {
  onClick?: () => void;
  isLoading?: boolean;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={clsx(
        "flex items-center gap-2 px-6 py-3 rounded-xl",
        "bg-gradient-to-r from-blue-600 to-indigo-600",
        "text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "disabled:opacity-70 disabled:cursor-not-allowed",
        "w-full sm:w-auto",
        className
      )}
    >
      <Hotel size={20} />
      <span>{isLoading ? "Chargement..." : "Voir la liste des hôtels"}</span>
    </button>
  );
});

const MenuDiambra = () => {
  const {
    handleBack, setActivePeriod, handleViewHotels,
    isViewHotelsLoading, adaptedIndicators, activePeriod,handleRapportClick,
  } = usePrincipale();

  return (
    <div className="bg-white flex flex-col w-full mx-auto px-4 py-4 space-y-4">
      <Bandeau />
      <div className="flex items-center justify-center">
        <BackButton onClick={handleBack} />
      </div>

      <section className="p-4 space-y-4">
        <h2 className="ont-bold text-black uppercase text-center  ">
          statistiques des etablissements hôteliers au plan national
        </h2>
        <div className="flex justify-center pt-2">
          <PeriodButtons
            activePeriod={activePeriod}
            onPeriodChange={setActivePeriod}
          />
        </div>

        {adaptedIndicators.mainItem && (
          <div className="flex justify-center py-4">
            <div className="w-full max-w-md">
              <div className="relative">
                <div className="absolute -inset-1  rounded-2xl opacity-20" />
                <div className="relative">
                  <InfoStat
                    item={adaptedIndicators.mainItem}
                    inverse
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {adaptedIndicators.subItems.map((item, index) => (
            <motion.div
              key={`${item.title}-${item.tpsglobal}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="transform transition-all duration-300 hover:scale-[1.02]"
            >
              <InfoStat item={item} />
            </motion.div>
          ))}
        </div>

        <Charte menuItems={adaptedIndicators.subItems} />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-gray-100">
          <ViewHotelsButton
            onClick={handleViewHotels}
            isLoading={isViewHotelsLoading}
          />

           <ReportButton onClick={handleRapportClick} />
        </div>
      </section>
    </div>
  );
};

export default MenuDiambra;