"use client";
import { useVert } from "@/hooks/datakwaba/useVert";
import Bandeau from "../commons/Bandeau";
import Bouton from "./Bouton";
import StatCard from "./StatCard";

export default function TourismDashboard() {
  const { dashboardData, handleCardClick } = useVert();

  return (
    <div className="mx-auto max-w-2xl">
      <Bandeau />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dashboardData.map((item) => (
          <StatCard key={item.id} item={item} onClick={handleCardClick} />
        ))}
      </div>

      <Bouton />
    </div>
  );
}