import { API_DELAY_MS, API_ERROR, MONTHS } from "./constants";

export const dst = (date: Date): string => {
  return date.toISOString();
};

export const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return '00/00/0000';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatMoisFiltre = (dateStr?: string) => {
  if (!dateStr) return '';
  const monthIndex = parseInt(dateStr) - 1;
  const lemois = MONTHS[monthIndex];
  return lemois.label;
};

export const getRandomUserImage = () => {
  const rand = Math.random();
  if (rand <= 0.3) return null;
  const gender = rand > 0.65 ? 'men' : 'women';
  const index = Math.floor(Math.random() * 100);
  return `https://randomuser.me/api/portraits/${gender}/${index}.jpg`;
};

export const fetchData = async <T>(url: string, method: string = 'GET', body?: unknown): Promise<T> => {
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.data) {
      throw new Error("Format non reconnue des données");
    }

    return result.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("An unknown error occurred");
  }
};

export const getCarteColor = (total: number) => {
  if (total === 0) return '#cccccc';
  if (total < 100) return '#ffd700';
  if (total < 500) return '#ffa500';
  return '#ff4500';
};

export const getRandomCount = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const valeurEntier = (tps: string | number | undefined) => {
  if (typeof tps === 'number') return tps;
  if (typeof tps === 'string') return parseInt(tps, 10) || 0;
  return 0;
};

export const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, API_DELAY_MS));

export const logError = (error: unknown) => {
  if (process.env.NODE_ENV === 'development') { console.error(API_ERROR, error); }
};

export const handleLoadError = (error: Error, info: React.ErrorInfo) => console.error("Erreur :", error, info)

export const truncateEmail = (email: string, maxEmailLength: number) => {
  if (email.length <= maxEmailLength) return email;
  return `${email.substring(0, maxEmailLength - 3)}...`;
};

export type TrendType = "croissance" | "baisse" | "stable";

export interface TrendResult {
  trend: TrendType;
  value: number; // Pourcentage de variation
  icon: "trending-up" | "trending-down" | "minus";
  color: string;
  description: string;
}

export const getRandomTrend = (options?: {
  bias?: "positive" | "negative" | "neutral";
  minValue?: number;
  maxValue?: number;
}): TrendResult => {
  const { bias = "neutral", minValue = 2, maxValue = 35 } = options || {};

  let probs = { croissance: 0.33, baisse: 0.33, stable: 0.34 };

  if (bias === "positive") {
    probs = { croissance: 0.7, baisse: 0.15, stable: 0.15 };
  } else if (bias === "negative") {
    probs = { croissance: 0.15, baisse: 0.7, stable: 0.15 };
  }

  const rand = Math.random();
  let trend: TrendType;

  if (rand < probs.croissance) {
    trend = "croissance";
  } else if (rand < probs.croissance + probs.baisse) {
    trend = "baisse";
  } else {
    trend = "stable";
  }

  let value = 0;
  if (trend !== "stable") {
    value = getRandomCount(minValue, maxValue);
  }

  const config = {
    croissance: {
      icon: "trending-up" as const,
      color: "#22C55E",
      description: `+${value}% par rapport au mois dernier`
    },
    baisse: {
      icon: "trending-down" as const,
      color: "#EF4444",
      description: `-${value}% par rapport au mois dernier`
    },
    stable: {
      icon: "minus" as const,
      color: "#6B7280",
      description: "Stable par rapport au mois dernier"
    }
  };

  return {
    trend,
    value,
    icon: config[trend].icon,
    color: config[trend].color,
    description: config[trend].description
  };
};

export const getRandomTrendSimple = (): { trend: TrendType; value: number } => {
  const trend = getRandomTrend();
  return { trend: trend.trend, value: trend.value };
};

export const getTrendHistory = (months: number = 6): TrendResult[] => {
  const history: TrendResult[] = [];
  let lastTrend: TrendType | null = null;

  for (let i = 0; i < months; i++) {
    // Éviter plus de 3 fois la même tendance consécutive
    let trend: TrendResult;
    do {
      trend = getRandomTrend({ bias: "neutral" });
    } while (lastTrend === trend.trend && Math.random() > 0.4);

    history.push(trend);
    lastTrend = trend.trend;
  }

  return history;
};

export const calculateTrend = (oldValue: number, newValue: number): TrendResult => {
  if (oldValue === 0) return getRandomTrend({ bias: "neutral" });

  const percentChange = ((newValue - oldValue) / oldValue) * 100;
  const roundedChange = Math.round(Math.abs(percentChange));

  if (percentChange > 5) {
    return {
      trend: "croissance",
      value: roundedChange,
      icon: "trending-up",
      color: "#22C55E",
      description: `+${roundedChange}% par rapport à la période précédente`
    };
  } else if (percentChange < -5) {
    return {
      trend: "baisse",
      value: roundedChange,
      icon: "trending-down",
      color: "#EF4444",
      description: `-${roundedChange}% par rapport à la période précédente`
    };
  } else {
    return {
      trend: "stable",
      value: 0,
      icon: "minus",
      color: "#6B7280",
      description: "Stable par rapport à la période précédente"
    };
  }
};