import { useTranslation } from 'react-i18next';
import { Home, Search, BarChart2, Settings, Plus } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <main className="flex-1 pb-20 p-4 max-w-lg mx-auto w-full">
        {children}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => onViewChange('search')}
        className={`fixed bottom-24 ${isRtl ? 'left-6' : 'right-6'} p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-10`}
        aria-label="Add entry"
      >
        <Plus size={24} />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 h-16 flex items-center justify-around z-20">
        <button
          onClick={() => onViewChange('dashboard')}
          className={`flex flex-col items-center ${currentView === 'dashboard' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">{t('dashboard.title')}</span>
        </button>
        <button
          onClick={() => onViewChange('search')}
          className={`flex flex-col items-center ${currentView === 'search' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <Search size={24} />
          <span className="text-xs mt-1">{t('dashboard.search')}</span>
        </button>
        <button
          onClick={() => onViewChange('trends')}
          className={`flex flex-col items-center ${currentView === 'trends' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <BarChart2 size={24} />
          <span className="text-xs mt-1">{t('dashboard.trends')}</span>
        </button>
        <button
          onClick={() => onViewChange('settings')}
          className={`flex flex-col items-center ${currentView === 'settings' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <Settings size={24} />
          <span className="text-xs mt-1">{t('dashboard.settings')}</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
