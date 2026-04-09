import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface MacroCircleProps {
  current: number;
  total: number;
  label: string;
  color: string;
}

const MacroCircle: React.FC<MacroCircleProps> = ({ current, total, label, color }) => {
  const { t } = useTranslation();
  const percentage = Math.min(Math.round((current / total) * 100), 100);
  const strokeDasharray = 2 * Math.PI * 40;
  const strokeDashoffset = strokeDasharray * (1 - percentage / 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Shadow glow effect */}
        <div
          className="absolute inset-4 rounded-full blur-2xl opacity-20"
          style={{ backgroundColor: color }}
        />

        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="40"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-gray-100 dark:text-gray-800"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="40"
            stroke={color}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: strokeDasharray }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-black"
          >
            {Math.round(current)}
          </motion.span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</span>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-sm font-bold text-gray-500 bg-gray-50 dark:bg-gray-800/50 px-4 py-1 rounded-full border border-gray-100 dark:border-gray-700"
      >
        {Math.abs(Math.round(total - current))} <span className="text-xs font-normal opacity-70">kcal</span> {percentage >= 100 ? t('common.over') : t('common.left')}
      </motion.div>
    </div>
  );
};

export default MacroCircle;
