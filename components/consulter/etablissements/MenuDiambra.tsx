'use client';
import Charte from "@/components/charts/Charte";
import DistributedBarChart from "@/components/charts/DistributedBarChart";
import Bandeau from "@/components/commons/Bandeau";
import BackButton from "@/components/recherche/BackButton";
import { usePrincipale } from "@/hooks/datakwaba/etablissements/usePrincipale";
import { memo } from "react";
import InfoStat from "./InfoStat";

const MenuDiambra = memo(() => {
  const { handleBackClick, tpsglobal, submenutitems, mainMenuItem, } = usePrincipale();

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-2">
      <Bandeau />
      <BackButton onClick={handleBackClick} />

      <div className="flex justify-center flex-col items-center w-full mt-4">
        {mainMenuItem && (
          <div className="flex justify-center mb-2 w-full max-w-xs">
            <InfoStat
              item={mainMenuItem}
              inverse
              tpsglobal={tpsglobal}
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          {submenutitems.slice(0, 2).map((item) => (
            <InfoStat
              key={`${item.title}-${item.tpsglobal}`}
              item={item}
              tpsglobal={tpsglobal}
            />
          ))}

          {submenutitems.length > 2 && (
            <div className="col-span-2 flex justify-center">
              <InfoStat
                key={`${submenutitems[2].title}-${submenutitems[2].tpsglobal}`}
                item={submenutitems[2]}
                tpsglobal={tpsglobal}
              />
            </div>
          )}
        </div>
        <Charte menuItems={submenutitems} />
        <DistributedBarChart menuItems={submenutitems} />
      </div>
    </div>
  );
});

export default MenuDiambra;