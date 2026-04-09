import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, Plus, Zap, History, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MacroCircle from './MacroCircle';
import WeightModal from './WeightModal';
import TDEEInfoModal from './TDEEInfoModal';
import { useMetrics } from '../hooks/useMetrics';
import { db } from '../db/db';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { todayMacros, todayMeals, currentTrendWeight, currentTDEE, targets } = useMetrics();
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showTDEEInfoModal, setShowTDEEInfoModal] = useState(false);

  const handleDeleteMeal = async (id: number) => {
    if (confirm(t('dashboard.confirm_delete_meal'))) {
      await db.meals.delete(id);
    }
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
        className="grid grid-cols-3 gap-3 px-2 relative"
      >
        <div className="absolute inset-0 bg-blue-500/5 blur-[80px] rounded-full -z-10 animate-pulse" />
        {[
          { label: t('macros.protein'), current: todayMacros.protein, target: targets.protein, color: 'text-blue-500', bg: 'bg-blue-500' },
          { label: t('macros.fat'), current: todayMacros.fat, target: targets.fat, color: 'text-orange-500', bg: 'bg-orange-500' },
          { label: t('macros.carbs'), current: todayMacros.carbs, target: targets.carbs, color: 'text-emerald-500', bg: 'bg-emerald-500' },
        ].map((macro) => (
          <div key={macro.label} className="glass-card p-6 rounded-[2.5rem] flex flex-col items-center text-center group cursor-default transition-all duration-500 hover:bg-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className={`text-[9px] font-black uppercase tracking-[0.3em] mb-4 transition-colors ${macro.color} opacity-60 group-hover:opacity-100`}>
              {macro.label}
            </div>
            <div className="text-2xl font-black text-white mb-4 tracking-tighter flex items-baseline gap-1">
              {Math.round(macro.current)}
              <span className="text-[10px] text-white/10 font-bold uppercase tracking-widest">g</span>
            </div>

            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((macro.current / macro.target) * 100, 100)}%` }}
                className={`h-full ${macro.bg} relative`}
              >
                <div className="absolute inset-0 bg-white/30 blur-[2px]" />
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
              </motion.div>
            </div>

            <div className="mt-4 text-[8px] font-black text-white/10 uppercase tracking-widest group-hover:text-white/30 transition-colors">
              {t('dashboard.target_label')} {macro.target}g
            </div>
          </div>
        ))}
      </motion.div>

      {/* Row: Adaptive Insights */}
      <div className="grid grid-cols-2 gap-4 px-2">
        <motion.button
          variants={itemVariants}
          whileHover={cardHover}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTDEEInfoModal(true)}
          className="glass-card p-6 rounded-[2rem] text-start relative overflow-hidden group"
        >
          <div className="absolute top-0 end-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap size={60} className="text-blue-500" />
          </div>
          <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Zap size={14} className="text-blue-500" />
            {t('dashboard.adaptive_tdee')}
          </div>
          <div className="text-4xl font-black text-white tracking-tighter">
            {currentTDEE ? currentTDEE.toLocaleString() : '2,500'}
          </div>
          <div className="text-[10px] font-black text-blue-500/50 mt-2 uppercase tracking-widest">{t('dashboard.metabolic_rate')}</div>
        </motion.button>

      <motion.div
        variants={itemVariants}
        whileHover={cardHover}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowWeightModal(true)}
        className="glass-card p-6 rounded-[2rem] text-start relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-0 end-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Scale size={60} className="text-purple-500" />
        </div>
        <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Scale size={14} className="text-purple-500" />
          {t('dashboard.trend_weight')}
        </div>
        <div className="text-4xl font-black text-white tracking-tighter">
          {currentTrendWeight ? currentTrendWeight.toFixed(1) : '--.-'}
          <span className="text-sm font-bold text-white/20 ms-1">kg</span>
        </div>
        <div className="text-[10px] font-black text-purple-500 mt-2 uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
          <Plus size={10} /> {t('dashboard.log_today')}
        </div>
      </motion.button>
      </div>

      {/* Row: Activity Log (Netflix 'Continue Watching' style) */}
      <motion.div
        variants={itemVariants}
        className="space-y-6"
      >
        <div className="flex justify-between items-end px-4">
          <div className="flex items-center gap-2">
            <History size={16} className="text-white/20" />
            <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em]">{t('dashboard.activity_log')}</h3>
          </div>
          <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 cursor-pointer transition-colors">{t('dashboard.view_timeline')}</div>
        </div>

        <div className="px-2">
          <div className="glass-card p-8 rounded-[3rem] space-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            {todayMeals.length > 0 ? (
              todayMeals.map((meal, idx) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex justify-between items-center py-6 border-b border-white/5 last:border-0 group cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-500 font-black text-lg group-hover:bg-blue-500/10 transition-colors shadow-inner">
                      {meal.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-black text-base text-white group-hover:text-blue-400 transition-colors tracking-tight">{meal.name}</div>
                      <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1 flex gap-2">
                        <span>{Math.round(meal.protein)}P</span>
                        <span className="text-white/5">•</span>
                        <span>{Math.round(meal.carbs)}C</span>
                        <span className="text-white/5">•</span>
                        <span>{Math.round(meal.fat)}F</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right rtl:text-left flex items-center gap-4">
                    <div className="flex flex-col items-end rtl:items-start">
                      <div className="text-2xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform origin-right rtl:origin-left">
                        {meal.calories}
                      </div>
                      <div className="text-[8px] text-white/20 font-black uppercase tracking-widest mt-0.5">kcal</div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, color: '#ef4444' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMeal(meal.id!);
                      }}
                      className="p-2 text-white/5 group-hover:text-white/20 transition-colors"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 flex flex-col items-center gap-6 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative">
                  <div className="w-24 h-24 bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-blue-500 blur-sm group-hover:blur-0 transition-all duration-700">
                     <Plus size={48} />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 bg-blue-500/20 rounded-[2rem] -z-10 blur-xl"
                  />
                </div>

                <div className="space-y-2 relative z-10">
                  <div className="text-white font-black text-xl tracking-tighter uppercase tracking-[0.2em]">{t('dashboard.metabolic_void')}</div>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] max-w-[200px] leading-relaxed">
                    {t('dashboard.void_description')}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] hover:bg-white/10 transition-all"
                >
                  {t('dashboard.init_log')}
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showWeightModal && (
          <WeightModal onClose={() => setShowWeightModal(false)} />
        )}
        {showTDEEInfoModal && (
          <TDEEInfoModal onClose={() => setShowTDEEInfoModal(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
