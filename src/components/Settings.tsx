import { useTranslation } from 'react-i18next';
import { Languages, Database, Info, Moon } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">{t('dashboard.title')} - Settings</h2>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-50 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <Languages size={20} className="text-blue-500" />
            <span className="font-medium">Language / שפה</span>
          </div>
          <span className="text-sm text-gray-500">{i18n.language === 'en' ? 'English' : 'עברית'}</span>
        </button>

        <div className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-50 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Moon size={20} className="text-purple-500" />
            <span className="font-medium">Dark Mode</span>
          </div>
          <span className="text-sm text-gray-500">Auto</span>
        </div>

        <button
          onClick={handleClearData}
          className="w-full flex items-center gap-3 p-5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Database size={20} />
          <span className="font-medium">Clear All Data</span>
        </button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold mb-2">
          <Info size={18} />
          About OpenMacro
        </div>
        <p className="text-sm text-blue-800/70 dark:text-blue-300/70 leading-relaxed">
          OpenMacro is a free, open-source, and private nutrition tracker. Your data never leaves your device.
          The TDEE algorithm adapts to your metabolic rate based on your actual weight and intake trends.
        </p>
      </div>

      <div className="text-center text-xs text-gray-400 pt-4">
        OpenMacro v0.1.0 • Built with Privacy
      </div>
    </div>
  );
};

export default Settings;
