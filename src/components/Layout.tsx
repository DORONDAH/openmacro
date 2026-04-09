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
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-60 -start-60 w-[80rem] h-[80rem] bg-blue-600/10 rounded-full blur-[180px] mix-blend-screen"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 80, 0],
            scale: [1, 1.2, 1],
            rotate: [0, -45, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-80 -end-80 w-[90rem] h-[90rem] bg-purple-600/10 rounded-full blur-[200px] mix-blend-screen"
        />

        {/* Floating cinematic particles/objects */}
        <motion.div
          animate={{
            y: [-20, 20, -20],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 start-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 end-1/3 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl"
        />

        {/* Cinematic noise/grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <main className="flex-1 pb-40 pt-12 p-4 max-w-lg mx-auto w-full overflow-x-hidden relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1]
            }}
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
