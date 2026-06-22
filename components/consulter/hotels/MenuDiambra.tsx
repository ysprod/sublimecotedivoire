'use client';
import Charte from "@/components/charts/Charte";
import { usePrincipale } from "@/hooks/datakwaba/hotels/usePrincipale";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import { PeriodButtons, StatsSummary, ViewHotelsButton } from "./Features";
import InfoStat from "./infostat/InfoStat";
import PDFDownloadButton from "./ReportPDF";

const Bandeau = dynamic(() => import("@/components/commons/Bandeau"), { ssr: true });
const BackButton = dynamic(() => import("@/components/recherche/BackButton"), { ssr: true });

const MenuDiambra = () => {
  const {
    handleBack, setActivePeriod, handleViewHotels,
    isViewHotelsLoading, adaptedIndicators, activePeriod,
  } = usePrincipale();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="flex flex-col w-full max-w-6xl mx-auto px-4 py-6 space-y-8">
        <Bandeau />
        <div className="flex items-center justify-between">
          <BackButton onClick={handleBack} />
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        </div>

        <section className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100/50 p-8 space-y-8">
          <h2 className="  font-bold text-black uppercase text-center  ">
            statistiques des etablissements hôteliers au plan national
          </h2>
          <div className="flex justify-center pt-2">
            <PeriodButtons
              activePeriod={activePeriod}
              onPeriodChange={setActivePeriod}
            />
          </div>

          <StatsSummary items={adaptedIndicators.subItems} />

          {adaptedIndicators.mainItem && (
            <div className="flex justify-center py-4">
              <div className="w-full max-w-md">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-20" />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-gray-100">
            <ViewHotelsButton
              onClick={handleViewHotels}
              isLoading={isViewHotelsLoading}
            />

            <PDFDownloadButton
              mainItem={adaptedIndicators.mainItem}
              hotelItems={adaptedIndicators.subItems}
              subItems={adaptedIndicators.subItems}
            />
          </div>
          <Charte menuItems={adaptedIndicators.subItems} />
        </section>
      </div>
    </div>
  );
};

export default MenuDiambra;