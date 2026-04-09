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
  } as const;

  const itemVariants = {
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
      className="space-y-12 pb-32"
    >
      {/* Featured Hero Section */}
      <motion.div
        variants={itemVariants}
        className="relative flex flex-col items-center justify-center pt-8"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-500/10 blur-[120px] rounded-full -z-10" />

        <MacroCircle
          current={todayMacros.calories}
          total={targets.calories}
          label={t('macros.calories')}
          color="#3b82f6"
        />
      </motion.div>

      {/* Row: Macros Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-3 gap-3 px-2"
      >
        {[
          { label: t('macros.protein'), current: todayMacros.protein, target: targets.protein, color: 'text-blue-500', bg: 'bg-blue-500' },
          { label: t('macros.fat'), current: todayMacros.fat, target: targets.fat, color: 'text-orange-500', bg: 'bg-orange-500' },
          { label: t('macros.carbs'), current: todayMacros.carbs, target: targets.carbs, color: 'text-emerald-500', bg: 'bg-emerald-500' },
        ].map((macro) => (
          <div key={macro.label} className="glass-card p-4 rounded-3xl flex flex-col items-center text-center">
            <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">{macro.label}</div>
            <div className="text-xl font-black text-white mb-3 tracking-tighter">
              {Math.round(macro.current)}
              <span className="text-[10px] text-white/20 ml-1 font-bold">g</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((macro.current / macro.target) * 100, 100)}%` }}
                className={`h-full ${macro.bg}`}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Row: Adaptive Insights */}
      <div className="grid grid-cols-2 gap-4 px-2">
        <motion.div
          variants={itemVariants}
          whileHover={cardHover}
          className="glass-card p-6 rounded-[2rem]"
        >
          <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Zap size={14} className="text-blue-500" />
            Adaptive TDEE
          </div>
          <div className="text-4xl font-black text-white tracking-tighter">{currentTDEE.toLocaleString()}</div>
          <div className="text-[10px] font-black text-blue-500/50 mt-2 uppercase tracking-widest">Metabolic Rate</div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={cardHover}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowWeightModal(true)}
          className="glass-card p-6 rounded-[2rem] text-left relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Scale size={14} className="text-purple-500" />
            Trend Weight
          </div>
          <div className="text-4xl font-black text-white tracking-tighter">
            {currentTrendWeight ? currentTrendWeight.toFixed(1) : '--.-'}
            <span className="text-sm font-bold text-white/20 ml-1">kg</span>
          </div>
          <div className="text-[10px] font-black text-purple-500 mt-2 uppercase tracking-widest flex items-center gap-1">
            <Plus size={10} /> Log Today
          </div>
        </motion.button>
      </div>

      {/* Row: Activity Log (Continue Watching style) */}
      <motion.div
        variants={itemVariants}
        className="space-y-6"
      >
        <div className="flex justify-between items-end px-4">
          <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em]">Activity History</h3>
          <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">View All</div>
        </div>

        <div className="px-2">
          <div className="glass-card p-6 rounded-[2.5rem] space-y-4">
            {todayMeals.length > 0 ? (
              todayMeals.map((meal, idx) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex justify-between items-center py-4 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-blue-500 font-black text-xs">
                      {meal.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-black text-sm text-white/90">{meal.name}</div>
                      <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-0.5">
                        {Math.round(meal.protein)}P • {Math.round(meal.carbs)}C • {Math.round(meal.fat)}F
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-black text-white tracking-tighter">
                    {meal.calories}
                    <span className="text-[10px] text-white/20 ml-1 uppercase">kcal</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-white/20 text-xs font-black uppercase tracking-widest italic">
                Awaiting first entry...
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showWeightModal && (
          <WeightModal onClose={() => setShowWeightModal(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );

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
