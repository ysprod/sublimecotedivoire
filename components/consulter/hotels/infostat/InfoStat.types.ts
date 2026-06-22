import type { MenuItem } from "@/lib/libs/interface";

export interface InfoStatProps {
  item: MenuItem;
  tpsglobal?: number;
  inverse?: boolean;
  onClick?: (item: MenuItem) => void;
}

export const TREND_CONFIG = {
  croissance: {
    bgColor: "bg-green-50",
    color: "text-green-700",
    label: "en hausse"
  },
  baisse: {
    bgColor: "bg-red-50",
    color: "text-red-700",
    label: "en baisse"
  },
  stable: {
    bgColor: "bg-gray-50",
    color: "text-gray-700",
    label: "stable"
  }
} as const;

export const PERIOD_CONFIG = {
  day: { label: 'par rapport à hier', short: 'J', threshold: 3, factor: 1 },
  week: { label: 'par rapport à la semaine dernière', short: 'S', threshold: 5, factor: 1.5 },
  month: { label: 'par rapport au mois dernier', short: 'M', threshold: 8, factor: 2 },
  year: { label: 'par rapport à l\'année dernière', short: 'A', threshold: 10, factor: 3 }
} as const;