'use client';
import { motion } from "framer-motion";
import { memo, useMemo } from "react";
import { MenuItem } from "@/libs/interface";
import { fadeInUp } from "@/libs/constants";
import Charte from "../charts/Charte";
import DistributedBarChart from "../charts/DistributedBarChart";
import InfoStat from "../consulter/InfoStat";

interface MenuDiambraProps {
  tpsglobal?: number;
  setSelectedMenuItem?: (item: MenuItem | null) => void;
  mymainMenuItem: MenuItem;
  submenutitems: MenuItem[];
}

const EtablissementsData = memo(({ tpsglobal = 0, mymainMenuItem, submenutitems, setSelectedMenuItem }: MenuDiambraProps) => {
  const mainMenuItem = useMemo(() => {
    if (!mymainMenuItem || !submenutitems.length) return null;
    const total = submenutitems.reduce((sum, item) => sum + (item.nbetablissements || 0), 0);
    const textPart = mymainMenuItem.title?.replace(/^\d+\s/, '') || '';

    return { ...mymainMenuItem, nbetablissements: total, title: `${total} ${textPart}` };
  }, [mymainMenuItem, submenutitems]);

  const renderSubItems = useMemo(() => {
    if (!submenutitems.length) return null;
    return (
      <>
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          {submenutitems.slice(0, 2).map((item) => (
            <InfoStat
              key={`${item.title}-${item.tpsglobal}`}
              item={item} tpsglobal={tpsglobal}
              setSelectedMenuItem={setSelectedMenuItem}
            />
          ))}
          {submenutitems.length > 2 && (
            <div className="col-span-2 flex justify-center">
              <InfoStat
                key={`${submenutitems[2].title}-${submenutitems[2].tpsglobal}`}
                item={submenutitems[2]} tpsglobal={tpsglobal}
                setSelectedMenuItem={setSelectedMenuItem}
              />
            </div>
          )}
        </div>

        <Charte menuItems={submenutitems} />
        <DistributedBarChart menuItems={submenutitems} />
      </>
    );
  }, [submenutitems, tpsglobal, setSelectedMenuItem]);

  return (
    <motion.div className="flex justify-center flex-col items-center w-full" {...fadeInUp}>
      {mainMenuItem && (
        <div className="flex justify-center mb-2">
          <InfoStat item={mainMenuItem} inverse setSelectedMenuItem={setSelectedMenuItem} />
        </div>
      )}

      {renderSubItems}
    </motion.div>
  );
});

EtablissementsData.displayName = "EtablissementsData";

export default EtablissementsData;