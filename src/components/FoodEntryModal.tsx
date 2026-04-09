import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../db/db';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md p-6 overflow-hidden relative shadow-2xl">
        <h3 className="text-xl font-bold mb-4">{product ? t('common.add') : t('common.quick_add')}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">{t('dashboard.food')}</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('macros.calories')}</label>
              <input
                type="number"
                required
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('common.servings')}</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t('macros.protein')}</label>
              <input
                type="number"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t('macros.carbs')}</label>
              <input
                type="number"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t('macros.fat')}</label>
              <input
                type="number"
                value={formData.fat}
                onChange={(e) => setFormData({ ...formData, fat: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodEntryModal;
