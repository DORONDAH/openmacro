import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import FoodSearch from './components/FoodSearch';
import Trends from './components/Trends';
import Settings from './components/Settings';
import SplashScreen from './components/SplashScreen';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [view, setView] = useState<'dashboard' | 'search' | 'trends' | 'settings'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial sequence
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleFoodAdded = () => {
    setView('dashboard');
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <SplashScreen />}
      </AnimatePresence>

      <Layout currentView={view} onViewChange={setView}>
        {view === 'dashboard' && <Dashboard />}
        {view === 'search' && <FoodSearch onBack={() => setView('dashboard')} onAdded={handleFoodAdded} />}
        {view === 'trends' && <Trends />}
        {view === 'settings' && <Settings />}
      </Layout>
    </>
  );
}

export default App;
