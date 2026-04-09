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

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Dynamic ambient backdrop */}
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full blur-[120px] -z-20"
          style={{ backgroundColor: color }}
        />

        {/* Outer orbital rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-white/5 opacity-40 shadow-[0_0_50px_rgba(59,130,246,0.1)]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-white/10 opacity-20"
        />

        <div
          className="absolute inset-8 rounded-full border border-white/10 backdrop-blur-3xl shadow-[0_0_120px_rgba(0,0,0,0.8)] overflow-hidden"
          style={{ background: `radial-gradient(circle at center, ${color}20, transparent)` }}
        >
          {/* Internal scanning shimmers */}
          <motion.div
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-40"
          />
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
            className="absolute inset-y-0 w-40 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent opacity-20"
          />
        </div>

        <svg className="w-full h-full transform -rotate-90 relative z-10 p-2">
          <defs>
            <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity={0.4} />
            </linearGradient>
            <filter id="glow-hero" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle
            cx="144"
            cy="144"
            r="120"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="16"
            fill="transparent"
          />
          <motion.circle
            cx="144"
            cy="144"
            r="120"
            stroke={`url(#gradient-${label})`}
            strokeWidth="16"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 120}
            initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 120 * (1 - percentage / 100) }}
            transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            strokeLinecap="round"
            filter="url(#glow-hero)"
          />
        </svg>

        <div className="absolute flex flex-col items-center z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-8xl font-black tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-baseline"
          >
            {Math.round(current)}
          </motion.div>
          <div className="text-[10px] text-blue-500 font-black uppercase tracking-[0.5em] mt-2 opacity-80 flex items-center gap-3">
             <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
             {label}
             <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-14 flex flex-col items-center gap-3"
      >
        <div className="text-5xl font-black text-white/90 tracking-tight flex items-baseline gap-2">
          {Math.abs(Math.round(total - current))}
          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{percentage >= 100 ? t('common.over') : t('common.left')}</span>
        </div>
        <div className="h-1 w-16 bg-blue-600 rounded-full opacity-30 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
      </motion.div>
    </div>
  );
};

export default MacroCircle;
