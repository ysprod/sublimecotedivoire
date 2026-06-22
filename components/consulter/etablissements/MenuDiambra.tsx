'use client';
import Bandeau from "@/components/commons/Bandeau";
import BackButton from "@/components/recherche/BackButton";
import { usePrincipale } from "@/hooks/datakwaba/etablissements/usePrincipale";
import { memo } from "react";
import InfoStat from "./InfoStat";

const MenuDiambra = memo(() => {
  const { hotelItems, tpsglobal, mainMenuItem, handleClick, handleBack, } = usePrincipale();

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 space-y-6 mb-8">
      <Bandeau />
      <BackButton onClick={handleBack} />

      <div className="flex justify-center flex-col items-center w-full mt-4 space-y-6">
        {mainMenuItem && (
          <div className="w-full max-w-md">
            {/* <InfoStat
              item={mainMenuItem}
              inverse
              tpsglobal={tpsglobal}
              onClick={handleClick}
            /> */}
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
      </div>
    </div>
  );
});

export default MenuDiambra;