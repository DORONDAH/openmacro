import { useTranslation } from 'react-i18next';
import { Languages, Database, Info, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../db/db';

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'en' ? 'he' : 'en';
    i18n.changeLanguage(nextLng);
  };

  const handleClearData = async () => {
    if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
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
    hidden: { y: 10, opacity: 0 },
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
      className="space-y-8 pb-32"
    >
      <div className="flex flex-col gap-1 px-4 mb-8">
        <h2 className="text-4xl font-black text-white tracking-tighter">{t('dashboard.settings')}</h2>
        <div className="h-1 w-12 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
      </div>

      <motion.div
        variants={itemVariants}
        whileHover={cardHover}
        className="glass-card rounded-[3rem] overflow-hidden"
      >
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between p-8 hover:bg-white/5 transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-6">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <Languages size={24} className="text-blue-500" />
            </div>
            <div className="text-left">
              <span className="block font-black text-sm uppercase tracking-wider text-white">Language</span>
              <span className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Change App Language</span>
            </div>
          </div>
          <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-4 py-2 rounded-full uppercase tracking-widest">{i18n.language === 'en' ? 'English' : 'עברית'}</span>
        </button>

        <div className="w-full flex items-center justify-between p-8 hover:bg-white/5 transition-colors border-b border-white/5">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-purple-500/10 rounded-2xl">
              <Moon size={24} className="text-purple-500" />
            </div>
            <div className="text-left">
              <span className="block font-black text-sm uppercase tracking-wider text-white">Theme</span>
              <span className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Dark Mode Always</span>
            </div>
          </div>
          <span className="text-[10px] font-black text-purple-500 bg-purple-500/10 px-4 py-2 rounded-full uppercase tracking-widest italic">Cinematic</span>
        </div>

        <button
          onClick={handleClearData}
          className="w-full flex items-center gap-6 p-8 text-red-500 hover:bg-red-500/5 transition-colors"
        >
          <div className="p-3 bg-red-500/10 rounded-2xl">
            <Database size={24} />
          </div>
          <div className="text-left">
            <span className="block font-black text-sm uppercase tracking-wider">Reset Account</span>
            <span className="block text-[10px] font-bold text-red-500/40 uppercase tracking-widest mt-0.5">Delete All Data Permanently</span>
          </div>
        </button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        whileHover={cardHover}
        className="bg-blue-600/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-blue-500/10 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Info size={80} className="text-blue-500" />
        </div>
        <div className="flex items-center gap-2 text-blue-500 font-black mb-6 tracking-[0.2em] uppercase text-[10px]">
          <Info size={16} />
          Intelligence Engine
        </div>
        <p className="text-sm text-white/60 leading-relaxed font-bold">
          OpenMacro is built on privacy. Your metabolic data (TDEE) is calculated locally using a 20-day EMA weight smoothing algorithm.
          This ensures your insights remain yours alone.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="text-center pt-8"
      >
        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">
          OpenMacro v0.1.0
        </div>
        <div className="h-px w-8 bg-white/10 mx-auto mb-2" />
        <div className="text-[8px] font-black text-blue-500/30 uppercase tracking-[0.2em]">
          Experimental Cinematic Build
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
