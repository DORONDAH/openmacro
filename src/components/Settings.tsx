import { useTranslation } from 'react-i18next';
import { Languages, Database, Info, Moon, Shield, Sparkles, ChevronRight, Target, Zap, Activity, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../db/db';
import { useMetrics } from '../hooks/useMetrics';

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { targets } = useMetrics();

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'en' ? 'he' : 'en';
    i18n.changeLanguage(nextLng);
  };

  const updateTarget = async (key: string, value: number) => {
    const existing = await db.settings.where('key').equals(key).first();
    if (existing) {
      await db.settings.update(existing.id!, { value });
    } else {
      await db.settings.add({ key, value });
    }
  };

  const handleClearData = async () => {
    if (confirm(t('settings_page.reset_confirm'))) {
      await Promise.all([
        db.weights.clear(),
        db.meals.clear(),
        db.customFoods.clear(),
        db.settings.clear()
      ]);
      window.location.reload();
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
    scale: 1.01,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-32 px-2"
    >
      <div className="flex flex-col gap-1 px-4 mb-8">
        <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1">{t('settings_page.configuration')}</div>
        <h2 className="text-4xl font-black text-white tracking-tighter">{t('dashboard.settings')}</h2>
        <div className="h-1 w-12 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
      </div>

      {/* Goals Section */}
      <motion.div
        variants={itemVariants}
        className="glass-card p-10 rounded-[3.5rem] relative overflow-hidden group border border-white/5"
      >
        <div className="absolute top-0 end-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Target size={120} className="text-blue-500" />
        </div>

        <div className="flex items-center gap-3 text-blue-500 font-black mb-2 tracking-[0.3em] uppercase text-[10px]">
          <Target size={16} />
          {t('settings_page.goals_title')}
        </div>
        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-10 italic">
          {t('settings_page.goals_desc')}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {[
            { label: t('macros.calories'), key: 'target_calories', icon: Flame, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: t('macros.protein'), key: 'target_protein', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: t('macros.fat'), key: 'target_fat', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            { label: t('macros.carbs'), key: 'target_carbs', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          ].map((goal) => (
            <div key={goal.key} className="space-y-3">
              <label className="flex items-center gap-2 text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ms-1">
                <goal.icon size={10} className={goal.color} />
                {goal.label}
              </label>
              <input
                type="number"
                value={(targets as any)[goal.key.replace('target_', '')]}
                onChange={(e) => updateTarget(goal.key, Number(e.target.value))}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-xl font-black text-white outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-inner"
              />
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="glass-card rounded-[3.5rem] overflow-hidden divide-y divide-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.6)] border border-white/5"
      >
        <motion.button
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between p-10 transition-colors group relative"
        >
          <div className="absolute inset-y-0 start-0 w-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-8">
            <div className="p-5 bg-blue-500/10 rounded-[1.8rem] group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500 shadow-inner ring-1 ring-white/5">
              <Languages size={28} className="text-blue-500" />
            </div>
            <div className="text-start">
              <span className="block font-black text-lg uppercase tracking-widest text-white">{t('settings_page.language_title')}</span>
              <span className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1.5 italic">{t('settings_page.language_desc')}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-6 py-2.5 rounded-2xl uppercase tracking-widest border border-blue-500/20 shadow-lg">{i18n.language === 'en' ? 'English' : 'עברית'}</span>
             <ChevronRight size={18} className="text-white/10 group-hover:text-white/40 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all" />
          </div>
        </motion.button>

        <motion.div
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
          className="w-full flex items-center justify-between p-10 group transition-colors relative"
        >
          <div className="absolute inset-y-0 start-0 w-1 bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-8">
            <div className="p-5 bg-purple-500/10 rounded-[1.8rem] group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-500 shadow-inner ring-1 ring-white/5">
              <Moon size={28} className="text-purple-500" />
            </div>
            <div className="text-start">
              <span className="block font-black text-lg uppercase tracking-widest text-white">{t('settings_page.visual_title')}</span>
              <span className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1.5 italic">{t('settings_page.visual_desc')}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles size={14} className="text-purple-500 animate-pulse" />
            <span className="text-[10px] font-black text-purple-500 bg-purple-500/10 px-6 py-2.5 rounded-2xl uppercase tracking-widest border border-purple-500/20 shadow-lg">{t('settings_page.visual_active')}</span>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
          onClick={handleClearData}
          className="w-full flex items-center justify-between p-10 group transition-colors relative"
        >
          <div className="absolute inset-y-0 start-0 w-1 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-8">
            <div className="p-5 bg-red-500/10 rounded-[1.8rem] group-hover:scale-110 group-hover:bg-red-500/20 transition-all duration-500 shadow-inner ring-1 ring-white/5">
              <Database size={28} className="text-red-500" />
            </div>
            <div className="text-start">
              <span className="block font-black text-lg uppercase tracking-widest text-red-500">{t('settings_page.reset_title')}</span>
              <span className="block text-[10px] font-black text-red-500/30 uppercase tracking-[0.3em] mt-1.5 italic">{t('settings_page.reset_desc')}</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-red-500/10 group-hover:text-red-500/40 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all" />
        </motion.button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        whileHover={cardHover}
        className="bg-blue-600/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-blue-500/10 relative overflow-hidden group shadow-2xl"
      >
        <div className="absolute -top-10 -end-10 p-8 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-700">
          <Shield size={160} className="text-blue-500" />
        </div>
        <div className="flex items-center gap-3 text-blue-500 font-black mb-6 tracking-[0.3em] uppercase text-[10px]">
          <Shield size={16} />
          {t('settings_page.privacy_title')}
        </div>
        <p className="text-base text-white/70 leading-relaxed font-bold tracking-tight">
          {t('settings_page.privacy_desc')}
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="text-center pt-12"
      >
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 rounded-2xl border border-white/5">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
            {t('settings_page.build_info')}
          </div>
        </div>
        <div className="mt-6 text-[8px] font-black text-white/10 uppercase tracking-[0.3em]">
          {t('settings_page.footer')}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
