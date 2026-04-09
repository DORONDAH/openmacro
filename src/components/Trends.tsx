import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
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
import { Scale, TrendingUp, Zap, PieChart as PieIcon, ChevronDown } from 'lucide-react';

const Trends: React.FC = () => {
  const { t } = useTranslation();
  const { weightTrendData, currentTrendWeight, weeklyHistory } = useMetrics();

  // Calculate weekly change
  const weeklyChange = weightTrendData.length >= 7
    ? weightTrendData[weightTrendData.length - 1].trend - weightTrendData[weightTrendData.length - 7].trend
    : null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  } as const;

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  } as const;

  const cardHover = {
    scale: 1.02,
    y: -5,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-24"
    >
      <h2 className="text-2xl font-black mb-6 px-2">{t('dashboard.trends')}</h2>

      {/* Weight Summary Card */}
      <motion.div
        variants={cardVariants}
        whileHover={cardHover}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-purple-500/10 border border-white dark:border-gray-700 flex items-center justify-between relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
        <div>
          <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1">
            <Scale size={14} className="text-purple-500" />
            {t('dashboard.weight_trend')}
          </div>
          <div className="text-4xl font-black text-purple-600 tracking-tighter">
            {currentTrendWeight ? currentTrendWeight.toFixed(1) : '--.-'}
            <span className="text-lg font-normal text-gray-300 ml-1">kg</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1 justify-end">
            <TrendingUp size={14} />
            Weekly Change
          </div>
          <div className={`text-2xl font-black tracking-tight ${weeklyChange && weeklyChange > 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
            {weeklyChange !== null ? (weeklyChange > 0 ? '+' : '') + weeklyChange.toFixed(2) : '--.--'}
            <span className="text-sm ml-1 opacity-50 font-bold">kg</span>
          </div>
        </div>
      </motion.div>

      {/* Detailed Weight Chart */}
      <motion.div
        variants={cardVariants}
        whileHover={cardHover}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 border border-white dark:border-gray-700"
      >
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-500" />
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
                  tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }}
                  tickFormatter={(str) => str.split('-').slice(1).join('/')}
                />
                <YAxis
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}/>
                <Line
                  name="Trend"
                  type="monotone"
                  dataKey="trend"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={false}
                  animationDuration={1500}
                />
                <Line
                  name="Actual"
                  type="monotone"
                  dataKey="value"
                  stroke="#e5e7eb"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: '#9ca3af', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 font-bold italic">
              No weight data available yet.
            </div>
          )}
        </div>
      </motion.div>

      {/* Intake vs TDEE Chart */}
      <motion.div
        variants={cardVariants}
        whileHover={cardHover}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-yellow-500/10 border border-white dark:border-gray-700"
      >
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
          <Zap size={16} className="text-yellow-500" />
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
                tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }}
                tickFormatter={(str) => str.split('-').slice(2).join('/')}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }}
              />
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="calories" fill="#3b82f6" radius={[6, 6, 0, 0]} animationDuration={1500} />
              <ReferenceLine
                y={weeklyHistory[0]?.tdee}
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{ position: 'right', value: 'TARGET', fill: '#ef4444', fontSize: 8, fontWeight: 'bold' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Macro Distribution Chart */}
      <motion.div
        variants={cardVariants}
        whileHover={cardHover}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-500/10 border border-white dark:border-gray-700"
      >
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
          <PieIcon size={16} className="text-emerald-500" />
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
                tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }}
                tickFormatter={(str) => str.split('-').slice(2).join('/')}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }}
              />
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '10px' }} />
              <Bar name={t('macros.protein')} dataKey="protein" stackId="a" fill="#3b82f6" animationDuration={1500} />
              <Bar name={t('macros.carbs')} dataKey="carbs" stackId="a" fill="#10b981" animationDuration={1500} />
              <Bar name={t('macros.fat')} dataKey="fat" stackId="a" fill="#f59e0b" animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        whileHover={cardHover}
        className="bg-blue-500/5 dark:bg-blue-900/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-blue-500/10 shadow-xl shadow-blue-500/5"
      >
        <h4 className="font-black text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2 tracking-tight">
          How it works
          <ChevronDown size={14} />
        </h4>
        <p className="text-xs text-blue-700/70 dark:text-blue-300/60 leading-relaxed font-bold">
          The blue line shows your 20-day weight trend (EMA). This filters out water weight
          fluctuations and gives you a better idea of your actual progress. Your TDEE is adapted
          based on how your trend weight changes relative to your calorie intake.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Trends;
