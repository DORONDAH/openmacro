import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const SplashScreen: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-30" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 2,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="relative"
      >
        {/* Animated Glow Logo */}
        <div className="relative w-48 h-48 mx-auto">
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-blue-500 rounded-full blur-[80px]"
          />
          <motion.div
            animate={{
              scale: [0.8, 1.1, 0.8],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute inset-0 bg-purple-500 rounded-full blur-[100px]"
          />
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 filter drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]">
            <motion.path
              d="M20 50 Q50 10 80 50 Q50 90 20 50"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M30 50 Q50 25 70 50 Q50 75 30 50"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="2"
              fill="#fff"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [1, 2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 text-center"
        >
          <h1 className="text-5xl font-black text-white tracking-[0.8em] uppercase ml-[0.8em]">OpenMacro</h1>
          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-transparent via-blue-600 to-transparent mx-auto rounded-full shadow-[0_0_25px_rgba(59,130,246,0.8)]" />
          <p className="mt-8 text-[11px] font-black text-white/40 uppercase tracking-[0.5em] animate-pulse">
            {t('splash.loading')}
          </p>
        </motion.div>
      </motion.div>

      {/* Cinematic scanning lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-[1px] bg-white animate-[scan_4s_linear_infinite]" />
      </div>

      <style>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
