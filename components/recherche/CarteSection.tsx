// app/recherche/components/CarteSection.tsx
'use client';

import { DataStatistique } from "@/lib/libs/interface";
import { memo } from "react";
import CarteStat from "../../components/map/CarteStat";

interface CarteSectionProps {
  regions: DataStatistique[];
}

export const CarteSection = memo(({ regions }: CarteSectionProps) => {
  return (
    <div className="mb-4">
      <CarteStat data={regions} />
    </div>
  );
});

CarteSection.displayName = "CarteSection";