import { useTranslation } from 'react-i18next';

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
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-lg font-bold">{current}</span>
          <span className="text-[10px] text-gray-500 uppercase">{label}</span>
        </div>
      </div>
      <div className="mt-2 text-sm font-medium text-gray-500">
        {total - current} kcal {percentage >= 100 ? t('common.over') : t('common.left')}
      </div>
    </div>
  );
};

export default MacroCircle;
