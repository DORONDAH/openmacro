import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion } from 'framer-motion';
import { X, Scan } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const { t } = useTranslation();
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear();
      },
      () => {
        // Handle scan errors silently
      }
    );

    return () => {
      scanner.clear().catch(err => console.error("Failed to clear scanner", err));
    };
  }, [onScan]);

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
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-card w-full max-w-md rounded-[3rem] overflow-hidden relative z-10 border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
      >
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl text-blue-500">
              <Scan size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">{t('scanner.link')}</span>
              <h3 className="text-xl font-black text-white tracking-tighter">{t('scanner.title')}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="relative">
          <div id="reader" className="w-full !border-0 bg-black"></div>
          {/* Viewfinder overlay */}
          <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40 backdrop-grayscale" />

          {/* High-tech scanning line */}
          <motion.div
            animate={{
              top: ['15%', '85%', '15%'],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute start-[40px] end-[40px] h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20 pointer-events-none"
          />

          {/* Corner accents */}
          {[
            "top-10 start-10 border-t-2 border-s-2",
            "top-10 end-10 border-t-2 border-e-2",
            "bottom-10 start-10 border-b-2 border-s-2",
            "bottom-10 end-10 border-b-2 border-e-2",
          ].map((style, i) => (
            <div key={i} className={`absolute w-6 h-6 border-blue-500/50 ${style} pointer-events-none z-20`} />
          ))}
        </div>

        <div className="p-8 bg-black/40 text-center">
          <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] italic">
            {t('scanner.placeholder')}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-1 w-4 bg-blue-600/30 rounded-full" />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BarcodeScanner;
