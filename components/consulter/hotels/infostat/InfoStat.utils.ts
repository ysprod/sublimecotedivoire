import { PERIODS } from "@/lib/libs/constants";
import type { AllTrends, TrendData } from "@/lib/libs/interface";
import { PERIOD_CONFIG } from "./InfoStat.types";

/**
 * Génère une tendance de manière déterministe (sans Math.random) 
 * afin d'éviter tout problème de désynchronisation d'hydratation en Next.js.
 */
export const generateDeterministicTrend = (
  baseValue: number,
  period: keyof typeof PERIOD_CONFIG,
  seedModifier: number
): TrendData => {
  const config = PERIOD_CONFIG[period];
  
  // Utilisation d'un sinus basé sur la valeur et un modificateur pour simuler une fausse variation stable
  const pseudoRandomSeed = Math.sin(baseValue * 0.1 + seedModifier) * 15;
  const variation = pseudoRandomSeed * config.factor;
  const roundedVariation = Math.round(variation * 10) / 10;

  let direction: 'croissance' | 'baisse' | 'stable';

  if (roundedVariation > config.threshold) {
    direction = 'croissance';
  } else if (roundedVariation < -config.threshold) {
    direction = 'baisse';
  } else {
    direction = 'stable';
  }

  return {
    direction,
    value: Math.abs(roundedVariation),
    label: direction === 'stable' ? `stable ${config.label}` : `${roundedVariation > 0 ? '+' : ''}${roundedVariation}% ${config.label}`
  };
};

export const generateStaticTrends = (baseValue: number, seed: number): AllTrends => {
  const result = {} as AllTrends;
  let modifier = seed;
  for (const period of PERIODS) {
    result[period] = generateDeterministicTrend(baseValue, period, modifier);
    modifier += 0.5; // Décalage de la graine pour chaque période
  }
  return result;
};

export const computeCategoryTrends = (title: string, count: number): AllTrends => {
  const multipliers: Record<string, number> = {
    'HÔTELS': 0.7,
    'RÉSIDENCES': 0.5,
    'MAISONS': 0.3,
    'ÉTABLISSEMENTS': 0.6,
  };

  let multiplier = 0.6;
  
  for (const [key, value] of Object.entries(multipliers)) {
    if (title.includes(key)) {
      multiplier = value;
      break;
    }
  }

  return generateStaticTrends(count * multiplier, title.length);
};