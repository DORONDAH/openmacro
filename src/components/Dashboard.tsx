import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Scale, Utensils, Plus, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Targets
  const targets = {
    calories: currentTDEE,
    protein: 160,
    fat: 70,
    carbs: 300,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const cardHover = {
    scale: 1.02,
    y: -5,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-24"
    >
      {/* Energy Balance Header */}
      <motion.div
        variants={itemVariants}
        whileHover={cardHover}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 border border-white dark:border-gray-700 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

        <h2 className="text-xl font-black mb-8 flex items-center gap-2">
          <div className="p-2 bg-blue-500/10 rounded-xl">
            <Utensils size={20} className="text-blue-500" />
          </div>
          {t('dashboard.title')}
        </h2>

        <div className="flex justify-center mb-10">
          <MacroCircle
            current={todayMacros.calories}
            total={targets.calories}
            label={t('macros.calories')}
            color="#3b82f6"
          />
        </div>

        <div className="grid grid-cols-3 gap-6 border-t border-gray-50 dark:border-gray-700 pt-8">
          {[
            { label: t('macros.protein'), current: todayMacros.protein, target: targets.protein, color: 'text-blue-500' },
            { label: t('macros.fat'), current: todayMacros.fat, target: targets.fat, color: 'text-orange-500' },
            { label: t('macros.carbs'), current: todayMacros.carbs, target: targets.carbs, color: 'text-emerald-500' },
          ].map((macro) => (
            <div key={macro.label} className="text-center">
              <div className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">{macro.label}</div>
              <div className="text-sm font-black">
                <span className={macro.color}>{Math.round(macro.current)}</span>
                <span className="text-gray-300 mx-1">/</span>
                <span className="text-gray-400">{macro.target}g</span>
              </div>
              <div className="mt-2 h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((macro.current / macro.target) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full rounded-full ${macro.color.replace('text', 'bg')}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* TDEE & Weight Summary */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl shadow-blue-500/10 border border-white dark:border-gray-700"
        >
          <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1">
            <Zap size={12} className="text-blue-500" />
            {t('dashboard.tdee')}
          </div>
          <div className="text-3xl font-black text-blue-600 tracking-tight">{currentTDEE.toLocaleString()}</div>
          <div className="text-[10px] font-bold text-blue-500/50 mt-1 uppercase">Daily Adapted</div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={cardHover}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowWeightModal(true)}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl shadow-purple-500/10 border border-white dark:border-gray-700 text-left transition-all"
        >
          <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1">
            <Scale size={12} className="text-purple-500" />
            {t('dashboard.weight_trend')}
          </div>
          <div className="text-3xl font-black text-purple-600 tracking-tight">
            {currentTrendWeight ? currentTrendWeight.toFixed(1) : '--.-'}
            <span className="text-sm font-normal text-gray-300 ml-1">kg</span>
          </div>
          <div className="text-[10px] font-bold text-purple-500 mt-1 flex items-center gap-1 uppercase">
            <Plus size={8} /> Log Weight
          </div>
        </motion.button>
      </div>

      {/* Weight Chart */}
      <motion.div
        variants={itemVariants}
        whileHover={cardHover}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-gray-500/10 border border-white dark:border-gray-700"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <TrendingUp size={14} className="text-blue-500" />
            Weight Trend
          </h3>
          <ChevronRight size={16} className="text-gray-300" />
        </div>
        <div className="h-48 w-full">
          {weightTrendData.length > 1 ? (
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
                <YAxis hide domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelFormatter={(str) => `Date: ${str}`}
                />
                <Line
                  type="monotone"
                  dataKey="trend"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={false}
                  animationDuration={2000}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#e5e7eb"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#9ca3af', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm font-bold italic">
              Add a few days of weight entries to see trend
            </div>
          )}
        </div>
      </motion.div>

      {/* Today's Log */}
      <motion.div
        variants={itemVariants}
        whileHover={cardHover}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-gray-500/10 border border-white dark:border-gray-700"
      >
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Today's Log</h3>
        <div className="space-y-4">
          {todayMeals.length > 0 ? (
            todayMeals.map((meal, idx) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex justify-between items-center py-4 border-b border-gray-50 dark:border-gray-700 last:border-0"
              >
                <div>
                  <div className="font-black text-sm text-gray-800 dark:text-gray-100">{meal.name}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                    P: {Math.round(meal.protein)}g • C: {Math.round(meal.carbs)}g • F: {Math.round(meal.fat)}g
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="text-lg font-black text-blue-600">{meal.calories}</div>
                  <div className="text-[10px] font-bold text-gray-300 uppercase">kcal</div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm font-bold italic bg-gray-50 dark:bg-gray-900/50 rounded-3xl">
              No food logged today
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showWeightModal && (
          <WeightModal onClose={() => setShowWeightModal(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Add missing Zap icon
const Zap = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export default Dashboard;
