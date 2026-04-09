import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../db/db';
import { format } from 'date-fns';

interface WeightModalProps {
  onClose: () => void;
}

const WeightModal: React.FC<WeightModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    // Check if entry exists for this date
    const existing = await db.weights.where('date').equals(date).first();
    if (existing) {
      await db.weights.update(existing.id!, { value: Number(value) });
    } else {
      await db.weights.add({ date, value: Number(value) });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl">
        <h3 className="text-xl font-bold mb-4">{t('common.weight')}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">{t('common.date')}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">{t('common.value_kg')}</label>
            <input
              type="number"
              step="0.1"
              required
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-3 text-2xl font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
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

export default WeightModal;
