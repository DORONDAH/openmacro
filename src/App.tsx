import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import FoodSearch from './components/FoodSearch';
import Trends from './components/Trends';
import Settings from './components/Settings';

function App() {
  const [view, setView] = useState<'dashboard' | 'search' | 'trends' | 'settings'>('dashboard');

  const handleFoodAdded = () => {
    setView('dashboard');
  };

  return (
    <Layout currentView={view} onViewChange={setView}>
      {view === 'dashboard' && <Dashboard />}
      {view === 'search' && <FoodSearch onBack={() => setView('dashboard')} onAdded={handleFoodAdded} />}
      {view === 'trends' && <Trends />}
      {view === 'settings' && <Settings />}
    </Layout>
  );
}

export default App;
