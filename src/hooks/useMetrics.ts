import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { calculateWeightEMA, calculateAdaptedTDEE } from '../logic/tdee';
import { format, subDays } from 'date-fns';

/**
 * Hook to calculate current metrics, macros, and trends from IndexedDB
 */
export function useMetrics() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const fourteenDaysAgo = format(subDays(new Date(), 14), 'yyyy-MM-dd');

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

  // Last 14 days of meals for TDEE calculation
  const recentMeals = useLiveQuery(
    () => db.meals.where('date').aboveOrEqual(fourteenDaysAgo).toArray(),
    [fourteenDaysAgo]
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
    return { ...w, trend: weightTrend! };
  }) || [];

  const currentTrendWeight = trendData.length > 0 ? trendData[trendData.length - 1].trend : null;

  // Calculate Adapted TDEE (14-day window)
  const defaultTDEE = 2500; // Should come from settings eventually
  let adaptedTDEE = defaultTDEE;

  if (trendData.length >= 14 && recentMeals) {
    const endWeight = trendData[trendData.length - 1].trend;
    const startWeight = trendData[trendData.length - 14].trend;
    const weightDelta = endWeight - startWeight;

    const totalCalories = recentMeals.reduce((sum, m) => sum + m.calories, 0);
    const avgDailyIntake = totalCalories / 14;

    adaptedTDEE = calculateAdaptedTDEE(avgDailyIntake, weightDelta, 14);
  }

  // Weekly history (last 7 days)
  const weeklyHistory = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const dayMeals = recentMeals?.filter(m => m.date === date) || [];
    const macros = dayMeals.reduce((acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      fat: acc.fat + m.fat,
      carbs: acc.carbs + m.carbs,
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 });

    return { date, ...macros, tdee: adaptedTDEE };
  }).reverse();

  return {
    todayMacros,
    todayMeals: todayMeals || [],
    currentTrendWeight,
    weightTrendData: trendData.slice(-14), // Last 14 days for more context
    currentTDEE: adaptedTDEE,
    weeklyHistory,
  };
}
