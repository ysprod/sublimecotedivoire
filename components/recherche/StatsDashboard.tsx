// app/recherche/components/StatsDashboard.tsx
'use client';

import { useVert } from "@/hooks/datakwaba/recherche/useVert";
import { memo } from "react";
import { StatCard } from "./StatCard";
 

export const StatsDashboard = memo(() => {
  const { dashboardData, handleCardClick } = useVert();

  return (
    <div className="flex flex-col items-center w-full mx-auto px-2 py-2 space-y-2">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboardData.map((item, index) => (
            <StatCard
              key={item.id}
              item={item}
              onClick={handleCardClick}
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

StatsDashboard.displayName = "StatsDashboard";