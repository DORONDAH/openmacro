import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Scale, Utensils, Plus } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import MacroCircle from './MacroCircle';
import WeightModal from './WeightModal';
import { useMetrics } from '../hooks/useMetrics';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { todayMacros, todayMeals, weightTrendData, currentTrendWeight, currentTDEE } = useMetrics();
  const [showWeightModal, setShowWeightModal] = useState(false);

  // Targets (should be moved to settings/store later)
  const targets = {
    calories: currentTDEE,
    protein: 160,
    fat: 70,
    carbs: 300,
  };

  return (
    <div className="space-y-6">
      {/* Energy Balance Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Utensils size={20} className="text-blue-500" />
          {t('dashboard.title')}
        </h2>

        <div className="flex justify-center mb-4">
          <MacroCircle
            current={todayMacros.calories}
            total={targets.calories}
            label={t('macros.calories')}
            color="#3b82f6"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-700 pt-6">
          <div className="text-center">
            <div className="text-sm text-gray-500">{t('macros.protein')}</div>
            <div className="font-bold">{Math.round(todayMacros.protein)} / {targets.protein}g</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">{t('macros.fat')}</div>
            <div className="font-bold">{Math.round(todayMacros.fat)} / {targets.fat}g</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">{t('macros.carbs')}</div>
            <div className="font-bold">{Math.round(todayMacros.carbs)} / {targets.carbs}g</div>
          </div>
        </div>
      </div>

      {/* TDEE & Weight Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-gray-500 text-sm mb-1 flex items-center gap-1">
            <TrendingUp size={14} />
            {t('dashboard.tdee')}
          </div>
          <div className="text-2xl font-black text-blue-600">{currentTDEE.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">Calculated weekly</div>
        </div>
        <button
          onClick={() => setShowWeightModal(true)}
          className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-left hover:border-blue-500 transition-colors"
        >
          <div className="text-gray-500 text-sm mb-1 flex items-center gap-1">
            <Scale size={14} />
            {t('dashboard.weight_trend')}
          </div>
          <div className="text-2xl font-black text-purple-600">
            {currentTrendWeight ? currentTrendWeight.toFixed(1) : '--.-'}
            <span className="text-sm font-normal text-gray-400 ml-1">kg</span>
          </div>
          <div className="text-xs text-blue-500 mt-1 flex items-center gap-1">
            <Plus size={10} /> Log Weight
          </div>
        </button>
      </div>

      {/* Weight Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Weight Trend</h3>
        <div className="h-48 w-full">
          {weightTrendData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickFormatter={(str) => str.split('-').slice(1).join('/')}
                />
                <YAxis
                  hide
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelFormatter={(str) => `Date: ${str}`}
                />
                <Line
                  type="monotone"
                  dataKey="trend"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#9ca3af"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#9ca3af' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
              Add a few days of weight entries to see trend
            </div>
          )}
        </div>
      </div>

      {/* Today's Log */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Today's Log</h3>
        <div className="space-y-3">
          {todayMeals.length > 0 ? (
            todayMeals.map((meal) => (
              <div key={meal.id} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
                <div>
                  <div className="font-bold text-sm">{meal.name}</div>
                  <div className="text-xs text-gray-500">
                    P: {Math.round(meal.protein)}g • C: {Math.round(meal.carbs)}g • F: {Math.round(meal.fat)}g
                  </div>
                </div>
                <div className="font-bold text-blue-600">{meal.calories}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">No food logged today</div>
          )}
        </div>
      </div>

      {showWeightModal && (
        <WeightModal onClose={() => setShowWeightModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;
