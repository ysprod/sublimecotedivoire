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

export  const truncateEmail = (email: string,maxEmailLength:number) => {
  if (email.length <= maxEmailLength) return email;
  return `${email.substring(0, maxEmailLength - 3)}...`;
};