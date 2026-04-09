import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { useMetrics } from '../hooks/useMetrics';
import { Scale, TrendingUp, Zap, PieChart as PieIcon } from 'lucide-react';

const Trends: React.FC = () => {
  const { t } = useTranslation();
  const { weightTrendData, currentTrendWeight, weeklyHistory } = useMetrics();

  // Calculate weekly change
  const weeklyChange = weightTrendData.length >= 7
    ? weightTrendData[weightTrendData.length - 1].trend - weightTrendData[weightTrendData.length - 7].trend
    : null;

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold mb-4">{t('dashboard.trends')}</h2>

      {/* Weight Summary Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div>
          <div className="text-gray-500 text-sm flex items-center gap-1 mb-1">
            <Scale size={16} />
            {t('dashboard.weight_trend')}
          </div>
          <div className="text-3xl font-black text-purple-600">
            {currentTrendWeight ? currentTrendWeight.toFixed(1) : '--.-'}
            <span className="text-lg font-normal text-gray-400 ml-1">kg</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-gray-500 text-sm flex items-center gap-1 justify-end mb-1">
            <TrendingUp size={16} />
            Weekly Change
          </div>
          <div className={`text-xl font-bold ${weeklyChange && weeklyChange > 0 ? 'text-orange-500' : 'text-green-500'}`}>
            {weeklyChange !== null ? (weeklyChange > 0 ? '+' : '') + weeklyChange.toFixed(2) : '--.--'} kg
          </div>
        </div>
      </div>

      {/* Detailed Weight Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold mb-6 flex items-center gap-2">
          <TrendingUp size={18} className="text-blue-500" />
          {t('dashboard.history_14d')}
        </h3>
        <div className="h-64 w-full">
          {weightTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  tickFormatter={(str) => str.split('-').slice(1).join('/')}
                />
                <YAxis
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Line
                  name="Trend Weight"
                  type="monotone"
                  dataKey="trend"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  name="Actual Weight"
                  type="monotone"
                  dataKey="value"
                  stroke="#9ca3af"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: '#9ca3af' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
              No weight data available yet.
            </div>
          )}
        </div>
      </div>

      {/* Intake vs TDEE Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold mb-6 flex items-center gap-2">
          <Zap size={18} className="text-yellow-500" />
          {t('dashboard.intake_vs_tdee')}
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyHistory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                tickFormatter={(str) => str.split('-').slice(2).join('/')}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="calories" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={weeklyHistory[0]?.tdee} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'TDEE', fill: '#ef4444', fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Macro Distribution Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold mb-6 flex items-center gap-2">
          <PieIcon size={18} className="text-green-500" />
          {t('dashboard.macro_distribution')} (g)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyHistory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                tickFormatter={(str) => str.split('-').slice(2).join('/')}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Bar name={t('macros.protein')} dataKey="protein" stackId="a" fill="#3b82f6" />
              <Bar name={t('macros.carbs')} dataKey="carbs" stackId="a" fill="#10b981" />
              <Bar name={t('macros.fat')} dataKey="fat" stackId="a" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
        <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">How it works</h4>
        <p className="text-sm text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
          The blue line shows your 20-day weight trend (EMA). This filters out water weight
          fluctuations and gives you a better idea of your actual progress. Your TDEE is adapted
          based on how your trend weight changes relative to your calorie intake.
        </p>
      </div>
    </div>
  );
};

export default Trends;

export default Trends;
