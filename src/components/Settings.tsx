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
      className="space-y-6 pb-24"
    >
      <h2 className="text-2xl font-black mb-6 px-2">{t('dashboard.settings')}</h2>

      <motion.div
        variants={itemVariants}
        whileHover={cardHover}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-gray-500/10 border border-white dark:border-gray-700 overflow-hidden"
      >
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between p-6 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Languages size={20} className="text-blue-500" />
            </div>
            <span className="font-black text-sm uppercase tracking-wider">Language / שפה</span>
          </div>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-full">{i18n.language === 'en' ? 'English' : 'עברית'}</span>
        </button>

        <div className="w-full flex items-center justify-between p-6 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <Moon size={20} className="text-purple-500" />
            </div>
            <span className="font-black text-sm uppercase tracking-wider">Dark Mode</span>
          </div>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-full">Auto</span>
        </div>

        <button
          onClick={handleClearData}
          className="w-full flex items-center gap-4 p-6 text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors"
        >
          <div className="p-2 bg-red-500/10 rounded-xl">
            <Database size={20} />
          </div>
          <span className="font-black text-sm uppercase tracking-wider">Clear All Data</span>
        </button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        whileHover={cardHover}
        className="bg-blue-500/5 dark:bg-blue-900/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-blue-500/10 shadow-xl shadow-blue-500/5"
      >
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black mb-3 tracking-tight uppercase text-xs">
          <Info size={16} />
          About OpenMacro
        </div>
        <p className="text-xs text-blue-700/70 dark:text-blue-300/60 leading-relaxed font-bold">
          OpenMacro is a free, open-source, and private nutrition tracker. Your data never leaves your device.
          The TDEE algorithm adapts to your metabolic rate based on your actual weight and intake trends.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="text-center text-[10px] font-black text-gray-300 pt-4 uppercase tracking-[0.2em]"
      >
        OpenMacro v0.1.0 • Built with Privacy
      </motion.div>
    </motion.div>
  );
};

export default Settings;
