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
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Cinematic glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-[60px] opacity-20 animate-pulse"
          style={{ backgroundColor: color }}
        />

        <div
          className="absolute inset-4 rounded-full border border-white/5 backdrop-blur-3xl shadow-2xl"
          style={{ background: `radial-gradient(circle at center, ${color}10, transparent)` }}
        />

        <svg className="w-full h-full transform -rotate-90 relative z-10">
          <defs>
            <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity={0.4} />
            </linearGradient>
            <filter id="glow-cinematic" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle
            cx="128"
            cy="128"
            r="100"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
            fill="transparent"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="100"
            stroke={`url(#gradient-${label})`}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 100}
            initial={{ strokeDashoffset: 2 * Math.PI * 100 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 100 * (1 - percentage / 100) }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            strokeLinecap="round"
            filter="url(#glow-cinematic)"
          />
        </svg>

        <div className="absolute flex flex-col items-center z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-7xl font-black tracking-tighter text-white drop-shadow-2xl"
          >
            {Math.round(current)}
          </motion.div>
          <div className="text-xs text-blue-400 font-black uppercase tracking-[0.3em] mt-1 opacity-80">{label}</div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-12 flex flex-col items-center gap-2"
      >
        <div className="text-4xl font-black text-white/90 tracking-tight">
          {Math.abs(Math.round(total - current))}
          <span className="text-lg font-bold text-white/40 ml-2 uppercase">kcal {percentage >= 100 ? t('common.over') : t('common.left')}</span>
        </div>
        <div className="h-1 w-12 bg-blue-500 rounded-full opacity-50 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
      </motion.div>
    </div>
  );
};

export default MacroCircle;
