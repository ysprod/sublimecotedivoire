// lib/libs/trends.ts

import { AllTrends, TrendData } from "./interface";

// ============================================================================
// CONFIGURATIONS
// ============================================================================

const PERIODS = ['day', 'week', 'month', 'year'] as const;

const PERIOD_CONFIG = {
  day: { min: -15, max: 15, threshold: 3 },
  week: { min: -25, max: 25, threshold: 5 },
  month: { min: -40, max: 40, threshold: 8 },
  year: { min: -60, max: 60, threshold: 10 }
} as const;

const PERIOD_LABELS = {
  day: 'Jour',
  week: 'Sem.',
  month: 'Mois',
  year: 'Année'
} as const;

// ============================================================================
// FONCTIONS DE GÉNÉRATION
// ============================================================================

export const generateTrendValue = (
  baseValue: number,
  period: keyof typeof PERIOD_CONFIG
): number => {
  const factor = PERIOD_CONFIG[period];
  const variation = (Math.sin(baseValue * 0.1 + Math.random() * 0.5) * factor.max * 0.5) +
    (Math.random() * (factor.max - factor.min) + factor.min);
  return Math.round(variation * 10) / 10;
};

export const getTrendDirection = (
  value: number,
  period: keyof typeof PERIOD_CONFIG
): 'croissance' | 'baisse' | 'stable' => {
  const threshold = PERIOD_CONFIG[period].threshold;

  if (value > threshold) return 'croissance';
  if (value < -threshold) return 'baisse';
  return 'stable';
};

export const generateAllTrends = (baseValue: number): AllTrends => {
  const result = {} as AllTrends;

  for (const period of PERIODS) {
    const value = generateTrendValue(baseValue, period);
    const direction = getTrendDirection(value, period);
    const absValue = Math.abs(value);
    const sign = direction === 'croissance' ? '+' : '';

    result[period] = {
      direction,
      value: absValue,
      label: `${sign}${absValue}% ${PERIOD_LABELS[period]}`
    };
  }

  return result;
};

export const getTrendForPeriod = (
  trends: AllTrends,
  period: keyof typeof PERIOD_CONFIG
): TrendData => {
  return trends[period];
};