import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { db } from '../db/db';
import { X, Save, Utensils, Hash, Zap } from 'lucide-react';

interface FoodEntryModalProps {
  product?: {
    name: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    id?: string;
  };
  onClose: () => void;
  onSave: () => void;
}

const FoodEntryModal: React.FC<FoodEntryModalProps> = ({ product, onClose, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: product?.name || '',
    calories: product?.calories || 0,
    protein: product?.protein || 0,
    fat: product?.fat || 0,
    carbs: product?.carbs || 0,
    servings: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const multiplier = formData.servings;
    await db.meals.add({
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      name: formData.name,
      calories: Math.round(formData.calories * multiplier),
      protein: formData.protein * multiplier,
      fat: formData.fat * multiplier,
      carbs: formData.carbs * multiplier,
      offId: product?.id,
    });
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-card w-full max-w-md rounded-[3.5rem] overflow-hidden relative z-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10"
      >
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-600/10 to-transparent -z-10" />

        <div className="p-10">
          <div className="flex justify-between items-start mb-12">
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.6em] mb-3 animate-pulse flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                {product ? t('modals.food_db') : t('modals.food_manual')}
              </div>
              <h3 className="text-5xl font-black text-white tracking-tighter uppercase">
                {product ? t('modals.food_confirm') : t('modals.food_quick')}
              </h3>
              <div className="h-1 w-12 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] mt-2" />
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-3 bg-white/5 rounded-2xl text-white/20 hover:text-white transition-colors border border-white/5"
            >
              <X size={20} />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ms-2">{t('modals.food_label')}</label>
              <div className="relative group">
                <div className="absolute start-6 top-1/2 -translate-y-1/2 p-2 bg-blue-500/10 rounded-xl text-blue-500/50 group-focus-within:text-blue-500 transition-colors">
                  <Utensils size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full ps-16 pe-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] text-white outline-none focus:ring-2 focus:ring-blue-500/50 font-bold text-lg transition-all shadow-inner placeholder:text-white/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ms-2">{t('modals.food_energy')}</label>
                <div className="relative group">
                  <div className="absolute start-6 top-1/2 -translate-y-1/2 p-2 bg-orange-500/10 rounded-xl text-orange-500/50 group-focus-within:text-orange-500 transition-colors">
                    <Zap size={16} />
                  </div>
                  <input
                    type="number"
                    required
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                    className="w-full ps-16 pe-6 py-6 bg-white/5 border border-white/10 rounded-[2rem] text-white outline-none focus:ring-2 focus:ring-blue-500/50 text-3xl font-black tracking-tighter transition-all shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ms-2">{t('modals.food_quantity')}</label>
                <div className="relative group">
                  <div className="absolute start-6 top-1/2 -translate-y-1/2 p-2 bg-emerald-500/10 rounded-xl text-emerald-500/50 group-focus-within:text-emerald-500 transition-colors">
                    <Hash size={16} />
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.servings}
                    onChange={(e) => setFormData({ ...formData, servings: Number(e.target.value) })}
                    className="w-full ps-16 pe-6 py-6 bg-white/5 border border-white/10 rounded-[2rem] text-white outline-none focus:ring-2 focus:ring-blue-500/50 text-3xl font-black tracking-tighter transition-all shadow-inner"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: t('macros.protein'), key: 'protein' as const, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: t('macros.carbs'), key: 'carbs' as const, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { label: t('macros.fat'), key: 'fat' as const, color: 'text-orange-500', bg: 'bg-orange-500/10' },
              ].map((macro) => (
                <div key={macro.key} className="space-y-3 group">
                  <label className={`text-[9px] font-black uppercase tracking-[0.2em] ml-1 ${macro.color} opacity-60 group-hover:opacity-100 transition-opacity`}>{macro.label}</label>
                  <input
                    type="number"
                    value={formData[macro.key]}
                    onChange={(e) => setFormData({ ...formData, [macro.key]: Number(e.target.value) })}
                    className={`w-full px-5 py-5 bg-white/5 border border-white/10 rounded-2xl text-lg font-black text-white outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-inner`}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-[0.7] py-7 text-white/20 font-black uppercase tracking-[0.4em] text-[10px] hover:text-white transition-colors"
              >
                {t('common.discard')}
              </button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(59,130,246,0.3)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 py-7 bg-blue-600 text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-[2rem] shadow-[0_15px_40px_rgba(59,130,246,0.2)] flex items-center justify-center gap-3 border border-blue-400/20"
              >
                <Save size={18} />
                {t('common.save')}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default FoodEntryModal;
