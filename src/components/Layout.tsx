import { useTranslation } from 'react-i18next';
import { Home, Search, BarChart2, Settings, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type View = 'dashboard' | 'search' | 'trends' | 'settings';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const { i18n, t } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      <main className="flex-1 pb-32 pt-6 p-4 max-w-lg mx-auto w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        onClick={() => onViewChange('search')}
        className={`fixed bottom-28 ${isRtl ? 'left-6' : 'right-6'} p-5 bg-blue-600 text-white rounded-[1.5rem] shadow-2xl shadow-blue-500/40 hover:bg-blue-700 transition-colors z-30`}
        aria-label="Add entry"
      >
        <Plus size={28} />
      </motion.button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/20 dark:border-gray-800 h-20 rounded-[2rem] flex items-center justify-around z-40 shadow-2xl shadow-black/5">
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
              className="relative flex flex-col items-center justify-center w-16 h-16 group"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-bg"
                  className="absolute inset-0 bg-blue-50 dark:bg-blue-500/10 rounded-2xl -z-10"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                />
              )}
              <motion.div
                animate={isActive ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                className={isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600 transition-colors'}
              >
                <item.icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span className={`text-[10px] mt-1 font-black uppercase tracking-widest ${isActive ? 'text-blue-600 opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100 transition-all'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
