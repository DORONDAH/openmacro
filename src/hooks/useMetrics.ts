import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { calculateWeightEMA } from '../logic/tdee';
import { format } from 'date-fns';

/**
 * Hook to calculate current metrics, macros, and trends from IndexedDB
 */
export function useMetrics() {
  const today = format(new Date(), 'yyyy-MM-dd');

  // Today's Meals
  const todayMeals = useLiveQuery(
    () => db.meals.where('date').equals(today).toArray(),
    [today]
  );

  // All weights for trend calculation
  const allWeights = useLiveQuery(
    () => db.weights.orderBy('date').toArray(),
    []
  );

  // Today's macros summary
  const todayMacros = todayMeals?.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      fat: acc.fat + m.fat,
      carbs: acc.carbs + m.carbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  ) || { calories: 0, protein: 0, fat: 0, carbs: 0 };

  // Calculate Weight Trend (EMA 20)
  let weightTrend: number | null = null;
  const trendData = allWeights?.map(w => {
    weightTrend = calculateWeightEMA(w.value, weightTrend);
    return { ...w, trend: weightTrend };
  }) || [];

  const currentTrendWeight = trendData.length > 0 ? trendData[trendData.length - 1].trend : null;

  // Calculate Adapted TDEE (14-day window)
  // This is a simplified version for the UI
  const defaultTDEE = 2500; // Should come from settings

  return {
    todayMacros,
    todayMeals: todayMeals || [],
    currentTrendWeight,
    weightTrendData: trendData.slice(-7), // Last 7 days for the chart
    currentTDEE: defaultTDEE, // For now
  };
}
