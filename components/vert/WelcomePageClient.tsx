"use client";
import { getRandomCount, getRandomTrendSimple, TrendType } from "@/lib/libs/functions";
import clsx from "clsx";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { memo, useCallback, useState } from "react";
import Bandeau from "../commons/Bandeau";
import Bouton from "./Bouton";

interface MenuItem {
  id: string;
  title: string;
  count: number;
  trend: TrendType;
  trendValue: number;
  iconSrc: string; // Changé: chemin vers l'image PNG
  iconAlt: string; // Ajouté: texte alternatif
  color: string;
  bgColor: string;
  description: string;
}

interface StatCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}

interface TrendData {
  direction: 'croissance' | 'baisse' | 'stable';
  value: number;
  label: string;
}

const TREND_CONFIG = {
  croissance: {
    icon: TrendingUp,
    bgColor: "bg-green-100",
    color: "text-green-700"
  },
  baisse: {
    icon: TrendingDown,
    bgColor: "bg-red-100",
    color: "text-red-700"
  },
  stable: {
    icon: Minus,
    bgColor: "bg-gray-100",
    color: "text-gray-700"
  }
};

const TrendIndicator = memo(({ trend }: { trend: TrendData }) => {
  const config = TREND_CONFIG[trend.direction];
  const Icon = config.icon;

  return (
    <>
    <div className={clsx(
      "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
      config.bgColor,
      config.color
    )}>
      <Icon size={14} />
      <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
    </div>
    <div className={clsx(
      "flex items-center text-xs font-medium uppercase",
     
      config.color
    )}>
    
      <span className="text-gray-500 text-[10px]"><br/>{trend.label}</span>
    </div>
    </>
    
  );
});

const CATEGORY_STYLES = {
  etablissements: {
    color: "text-blue-600",
    bgColor: "bg-white",
    borderColor: "border-blue-200",
    iconContainerBg: "bg-white"
  },
  clients: {
    color: "text-purple-600",
    bgColor: "bg-white",
    borderColor: "border-purple-200",
    iconContainerBg: "bg-white"
  }
};

const StatCard = memo(({ item, onClick }: StatCardProps) => {
  const trendData: TrendData = {
    direction: item.trend === "croissance" ? "croissance" : item.trend === "baisse" ? "baisse" : "stable",
    value: item.trendValue,
    label: item.trend === "croissance" ? "en hausse par rapport à hier" : item.trend === "baisse" ? "en baisse par rapport à hier" : "stable par rapport à hier"
  };

  const style = item.id === "etablissements" ? CATEGORY_STYLES.etablissements : CATEGORY_STYLES.clients;

  return (
    <button
      onClick={() => onClick(item)}
      className={`
        group relative overflow-hidden bg-white p-6  
        hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        flex flex-col items-center text-center  hover:shadow-xl
      `}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />

      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="flex items-center justify-center mb-4">
          <div className={clsx(
            "p-3  transition-all duration-300 group-hover:scale-105",
            style.iconContainerBg
          )}>
            <Image
              src={item.iconSrc}
              alt={item.iconAlt}
              width={80}
              height={80}
              className="w-24 h-24 object-contain"
              priority={false}
            />
          </div>
        </div>

        <div className="space-y-2 text-center w-full">
          <div>
            <span className="text-3xl font-black text-gray-900">
              {item.count.toLocaleString("fr-FR")}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {item.title}<br />
            <span className="text-xs"> SUR TOUTE L'ETENDUE DU TERRITOIRE</span>
           
          </p> 
        </div>
        <TrendIndicator trend={trendData} />
      </div>
    </button>
  );
});

const generateDashboardData = (): MenuItem[] => {
  const hotelsCount = getRandomCount(2000, 20000);
  const residencesCount = Math.floor(hotelsCount * getRandomCount(30, 50) / 100);
  const maisonsCount = Math.floor(hotelsCount * getRandomCount(10, 20) / 100);
  const totalEtablissements = hotelsCount + residencesCount + maisonsCount;

  const hommesCount = getRandomCount(2000, 10000);
  const femmesCount = getRandomCount(1000, 8000);
  const clientsCount = hommesCount + femmesCount;

  const etablissementsTrend = getRandomTrendSimple();
  const clientsTrend = getRandomTrendSimple();

  return [
    {
      id: "etablissements",
      title: "ÉTABLISSEMENTS",
      count: totalEtablissements,
      trend: etablissementsTrend.trend,
      trendValue: etablissementsTrend.value,
      iconSrc: "/icons/batiment.png", // Chemin vers votre image PNG
      iconAlt: "Icône établissements",
      color: "text-black",
      bgColor: "bg-white",
      description: "Hôtels, résidences et maisons d'hôtes"
    },
    {
      id: "clients",
      title: "CLIENTS",
      count: clientsCount,
      trend: clientsTrend.trend,
      trendValue: clientsTrend.value,
      iconSrc: "/icons/lesclients.png", // Chemin vers votre image PNG
      iconAlt: "Icône clients",
      color: "text-black",
      bgColor: "bg-white",
      description: "Touristes et visiteurs"
    }
  ];
};

export default function TourismDashboard() {
  const router = useRouter();
  const [dashboardData] = useState(() => generateDashboardData());

  const handleCardClick = useCallback((item: MenuItem) => {    
    if (item.id === "etablissements") {
      router.push(`/consulter/etablissements/?tpsglobal=${item.id}`);
      return;
    }
    router.push(`/consulter/?tpsglobal=${item.id}`);
  }, [router]);

  return (
    <div className="w-full mx-auto max-w-3xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Bandeau />

        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardData.map((item) => (
              <StatCard key={item.id} item={item} onClick={handleCardClick} />
            ))}
          </div>
        </div>
        <div className="mt-8">
          <Bouton />
        </div>
      </div>
    </div>
  );
}