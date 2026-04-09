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
        <div className="relative w-32 h-32">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-blue-500 rounded-full blur-3xl"
          />
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 filter drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <motion.path
              d="M20 50 Q50 10 80 50 Q50 90 20 50"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="5"
              fill="#fff"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-8 text-center"
        >
          <h1 className="text-2xl font-black text-white tracking-[0.5em] uppercase">OpenMacro</h1>
          <div className="mt-2 h-1 w-12 bg-blue-600 mx-auto rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          <p className="mt-4 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">
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
