"use client";
import { getRandomCount, getRandomTrendSimple, TrendType } from "@/lib/libs/functions";
import {
  ArrowDownRight, ArrowUpRight, Building2, LucideIcon, Minus, Minus as MinusIcon,
  TrendingDown, TrendingUp, Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";
import Bandeau from "../commons/Bandeau";
import Bouton from "./Bouton";

interface MenuItem {
  id: string;
  title: string;
  count: number;
  trend: TrendType;
  trendValue: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
}

interface StatCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}

const CATEGORY_STYLES = {
  etablissements: {
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "#2563EB"
  },
  clients: {
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    iconColor: "#9333EA"
  }
};

const TrendIndicator = ({ trend, value }: { trend: TrendType; value: number }) => {
  const trendConfig = {
    croissance: {
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      text: `+${value}%`,
      iconArrow: ArrowUpRight
    },
    baisse: {
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100",
      text: `-${value}%`,
      iconArrow: ArrowDownRight
    },
    stable: {
      icon: Minus,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      text: "Stable",
      iconArrow: MinusIcon
    }
  };

  const config = trendConfig[trend];
  const Icon = config.icon;
  const ArrowIcon = config.iconArrow;

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bgColor}`}>
      <Icon className={`w-3.5 h-3.5 ${config.color}`} />
      <span className={`text-xs font-semibold ${config.color}`}>{config.text}</span>
      {trend !== "stable" && <ArrowIcon className={`w-3 h-3 ${config.color}`} />}
    </div>
  );
};

const StatCard = memo(({ item, onClick }: StatCardProps) => {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onClick(item)}
      className={`
        group relative overflow-hidden rounded-2xl bg-white p-6 
        transition-all duration-300 hover:shadow-xl
        border-2 ${CATEGORY_STYLES[item.id === "etablissements" ? "etablissements" : "clients"]?.borderColor || "border-gray-200"}
        hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      `}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${CATEGORY_STYLES[item.id === "etablissements" ? "etablissements" : "clients"]?.bgColor || "bg-gray-50"}`}>
            <Icon className={`w-8 h-8 ${item.color}`} strokeWidth={1.5} />
          </div>
          <TrendIndicator trend={item.trend} value={item.trendValue} />
        </div>

        <div className="space-y-2">
          <div>
            <span className="text-3xl font-black text-gray-900">
              {item.count.toLocaleString("fr-FR")}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {item.title}
          </p>
          {item.description && (
            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Tendance mensuelle</span>
            <span className={`font-semibold ${item.trend === "croissance" ? "text-green-600" :
              item.trend === "baisse" ? "text-red-600" :
                "text-gray-600"
              }`}>
              {item.trend === "croissance" ? "↑ En hausse" :
                item.trend === "baisse" ? "↓ En baisse" :
                  "→ Stable"}
            </span>
          </div>
        </div>
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
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Hôtels, résidences et maisons d'hôtes"
    },
    {
      id: "clients",
      title: "CLIENTS",
      count: clientsCount,
      trend: clientsTrend.trend,
      trendValue: clientsTrend.value,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Touristes et visiteurs"
    }
  ];
};

export default function TourismDashboard() {
  const router = useRouter();
  const [dashboardData] = useState(() => generateDashboardData());

  const handleCardClick = useCallback((item: MenuItem) => {
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