import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { X, Info, Zap, Scale, Activity, TrendingUp } from 'lucide-react';

interface TDEEInfoModalProps {
  onClose: () => void;
}

const TDEEInfoModal: React.FC<TDEEInfoModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { staggerChildren: 0.1 }
    }
  } as const;

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  } as const;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="glass-card w-full max-w-lg rounded-[3.5rem] overflow-hidden relative z-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10"
      >
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-600/10 to-transparent -z-10" />

        <div className="p-10">
          <div className="flex justify-between items-start mb-10">
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                {t('tdee_modal.system_intelligence')}
              </div>
              <h3 className="text-4xl font-black text-white tracking-tighter">
                {t('dashboard.adaptive_tdee')}
              </h3>
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

          <div className="space-y-8">
            <motion.div variants={itemVariants} className="flex gap-6 items-start">
              <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-500 shrink-0">
                <Scale size={24} />
              </div>
              <div>
                <h4 className="text-white font-black uppercase tracking-widest text-xs mb-2">{t('tdee_modal.weight_smoothing')}</h4>
                <p className="text-white/40 text-[11px] leading-relaxed font-bold">
                  {t('tdee_modal.weight_smoothing_desc')}
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-6 items-start">
              <div className="p-4 bg-yellow-500/10 rounded-2xl text-yellow-500 shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <h4 className="text-white font-black uppercase tracking-widest text-xs mb-2">{t('tdee_modal.energy_balance')}</h4>
                <p className="text-white/40 text-[11px] leading-relaxed font-bold">
                  {t('tdee_modal.energy_balance_desc')}
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-6 items-start">
              <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 shrink-0">
                <TrendingUp size={24} />
              </div>
              <div>
                <h4 className="text-white font-black uppercase tracking-widest text-xs mb-2">{t('tdee_modal.dynamic_adaptation')}</h4>
                <p className="text-white/40 text-[11px] leading-relaxed font-bold">
                  {t('tdee_modal.dynamic_adaptation_desc')}
                </p>
              </div>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full mt-12 py-6 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-[2rem] transition-all border border-white/10"
          >
            {t('common.cancel')}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default TDEEInfoModal;
