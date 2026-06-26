'use client';
import Bandeau from "@/components/commons/Bandeau";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { memo } from "react";

const TREND_CONFIG = {
  up: { icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50", label: "Hausse" },
  down: { icon: TrendingDown, color: "text-red-600", bgColor: "bg-red-50", label: "Baisse" },
  stable: { icon: Minus, color: "text-gray-600", bgColor: "bg-gray-50", label: "Stable" }
} as const;


const MenuDiambra = memo(() => {
  // const { handleBackClick, tpsglobal, submenutitems, mainMenuItem, handleClick } = usePrincipale();

  // const hotelItems = useMemo(() => {
  //   return submenutitems.filter(item =>
  //     CATEGORY_KEYWORDS.some(keyword => item.title?.includes(keyword))
  //   );
  // }, [submenutitems]);

  // const handleBack = useCallback(() => {
  //   handleBackClick?.();
  // }, [handleBackClick]);

  // const hasData = useMemo(() => {
  //   return submenutitems.length > 0 && hotelItems.length > 0;
  // }, [submenutitems, hotelItems]);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 space-y-6">
      <Bandeau />
      {/* <BackButton onClick={handleBack} />

      <div className="flex justify-center flex-col items-center w-full mt-4 space-y-6">
        {mainMenuItem && (
          <div className="w-full max-w-md">
            <InfoStat
              item={mainMenuItem}
              inverse
              tpsglobal={tpsglobal}
              onClick={handleClick}
            />
          </div>
        )}

        {hotelItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
            {hotelItems.slice(0, 3).map((item) => (
              <InfoStat
                key={`${item.title}-${item.tpsglobal}`}
                item={item}
                tpsglobal={tpsglobal}
                onClick={handleClick}
              />
            ))}
          </div>
        )}

        <div className="w-full max-w-3xl flex justify-center">
          <PDFDownloadButton
            mainItem={mainMenuItem}
            hotelItems={hotelItems}
            subItems={submenutitems}
          />
        </div>

        {hasData && (
          <DetailedStats
            items={hotelItems}
            title="Statistiques détaillées des établissements"
            className="max-w-3xl"
          />
        )}

        {submenutitems.length > 0 && (
          <div className="w-full max-w-3xl space-y-6">
            <Charte menuItems={submenutitems} />
          </div>
        )}
      </div> */}
    </div>
  );
});

export default MenuDiambra;