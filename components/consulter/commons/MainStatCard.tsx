'use client';
import { MenuItem } from "@/lib/libs/interface";
import { memo } from "react";
import { InfoStat } from "./InfoStat";

interface MainStatCardProps {
  item: MenuItem;
  tpsglobal: number;
}

export const MainStatCard = memo(({ item, tpsglobal }: MainStatCardProps) => (
  <div className="w-full max-w-md">
    <InfoStat
      item={item}
      inverse
      tpsglobal={tpsglobal}
      onClick={() => {}}
    />
  </div>
));

MainStatCard.displayName = 'MainStatCard';