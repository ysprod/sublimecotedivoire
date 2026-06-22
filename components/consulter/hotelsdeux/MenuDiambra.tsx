'use client';
import Charte from "@/components/charts/Charte";
import { usePrincipale } from "@/hooks/datakwaba/hotels/usePrincipale";
import dynamic from 'next/dynamic';
import { memo } from "react";
import { PeriodButtons, ViewHotelsButton } from "./Features";
import InfoStat from "./InfoStat";
import PDFDownloadButton from "./ReportPDF";

const Bandeau = dynamic(() => import("@/components/commons/Bandeau"), { ssr: true });
const BackButton = dynamic(() => import("@/components/recherche/BackButton"), { ssr: true });

const MenuDiambra = () => {
  const {
    handleBack, setActivePeriod, handleViewHotels, isViewHotelsLoading, adaptedIndicators, activePeriod,
  } = usePrincipale();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex flex-col w-full max-w-6xl mx-auto px-4 py-6 space-y-8">
        <Bandeau />

        <div className="flex items-center justify-between">
          <BackButton onClick={handleBack} />
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Statistiques par période
            </h2>
          </div>

          <PeriodButtons
            activePeriod={activePeriod}
            onPeriodChange={setActivePeriod}
          />

          {adaptedIndicators.mainItem && (
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <InfoStat
                  item={adaptedIndicators.mainItem}
                  inverse
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {adaptedIndicators.subItems.map((item) => (
              <InfoStat
                key={`${item.title}-${item.tpsglobal}`}
                item={item}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gray-100">
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

          <div className="w-full">
            <Charte menuItems={adaptedIndicators.subItems} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default MenuDiambra;