import { useTranslation } from 'react-i18next';
import { Home, Search, BarChart2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type View = 'dashboard' | 'search' | 'trends' | 'settings';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen text-white flex flex-col font-sans relative overflow-hidden bg-[#050505]">
      <div className="mesh-gradient" />

      {/* Background Objects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{
            y: [0, -40, 0],
            rotate: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] -left-20 w-[40rem] h-[40rem] bg-blue-600/5 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            y: [0, 60, 0],
            rotate: [0, -25, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] -right-32 w-[50rem] h-[50rem] bg-purple-600/5 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, 40, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] right-[5%] w-96 h-96 bg-emerald-600/5 rounded-full blur-[100px]"
        />
      </div>

      <main className="flex-1 pb-40 pt-12 p-4 max-w-lg mx-auto w-full overflow-x-hidden relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Cinematic Navigation Dock */}
      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[#141414]/80 backdrop-blur-3xl border border-white/10 h-24 rounded-[3rem] flex items-center justify-around z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {[
          { id: 'dashboard', icon: Home, label: t('dashboard.title') },
          { id: 'search', icon: Search, label: t('dashboard.search') },
          { id: 'trends', icon: BarChart2, label: t('dashboard.trends') },
          { id: 'settings', icon: Settings, label: t('dashboard.settings') },
        ].map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              className="relative flex flex-col items-center justify-center w-20 h-20 group"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-bg"
                  className="absolute inset-2 bg-white/5 rounded-[2rem] -z-10 shadow-inner"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <motion.div
                animate={isActive ? { y: -5, scale: 1.2 } : { y: 0, scale: 1 }}
                className={isActive ? 'text-blue-500' : 'text-white/40 group-hover:text-white/70 transition-colors'}
              >
                <item.icon size={isActive ? 28 : 24} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-[8px] mt-1 font-black uppercase tracking-[0.2em] text-blue-500 absolute bottom-3"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
