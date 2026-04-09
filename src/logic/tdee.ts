/**
 * TDEE and Weight Trend Calculation Logic
 *
 * This module implements a 20-day Exponential Moving Average (EMA) for weight smoothing
 * and a 14-day rolling window algorithm to adapt TDEE based on energy balance.
 *
 * @module logic/tdee
 */

/**
 * Calculates the next EMA value for weight.
 * Formula: EMA = (Price - PreviousEMA) * k + PreviousEMA
 * where k = 2 / (N + 1)
 *
 * @param currentWeight - The actual weight recorded today
 * @param previousEMA - The previous day's smoothed weight trend
 * @param period - The period for EMA (default 20)
 * @returns The new smoothed trend weight
 */
export function calculateWeightEMA(
  currentWeight: number,
  previousEMA: number | null,
  period: number = 20
): number {
  if (previousEMA === null) return currentWeight;
  const k = 2 / (period + 1);
  return (currentWeight - previousEMA) * k + previousEMA;
}

/**
 * Calculates the adapted TDEE based on intake and weight change over a period.
 *
 * @param avgDailyIntake - Average calories consumed per day over the window
 * @param weightDelta - Change in trend weight (EndWeight - StartWeight)
 * @param days - The length of the window in days (default 14)
 * @param kcalPerKg - Energy density of weight change (default 7700 kcal/kg)
 * @returns The calculated TDEE
 */
export function calculateAdaptedTDEE(
  avgDailyIntake: number,
  weightDelta: number,
  days: number = 14,
  kcalPerKg: number = 7700
): number {
  const dailySurplus = (weightDelta * kcalPerKg) / days;
  return Math.round(avgDailyIntake - dailySurplus);
}

/**
 * Helper to process a series of weights to generate a trend line.
 */
export function generateWeightTrend(weights: { value: number; date: string }[]): number[] {
  let currentEMA: number | null = null;
  return weights.map((w) => {
    currentEMA = calculateWeightEMA(w.value, currentEMA);
    return currentEMA;
  });
}
