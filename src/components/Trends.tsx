import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { useMetrics } from '../hooks/useMetrics';
import { Scale, TrendingUp, Zap, PieChart as PieIcon, ChevronDown } from 'lucide-react';

const Trends: React.FC = () => {
  const { t } = useTranslation();
  const { weightTrendData, currentTrendWeight, weeklyHistory } = useMetrics();

  // Calculate weekly change
  const weeklyChange = weightTrendData.length >= 7
    ? weightTrendData[weightTrendData.length - 1].trend - weightTrendData[weightTrendData.length - 7].trend
    : null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  } as const;

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  } as const;

  const cardHover = {
    scale: 1.02,
    y: -5,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-32"
    >
      <div className="flex flex-col gap-1 px-4 mb-8">
        <h2 className="text-4xl font-black text-white tracking-tighter">{t('dashboard.trends')}</h2>
        <div className="h-1 w-12 bg-purple-600 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.5)]" />
      </div>

      {/* Hero Trend Card */}
      <motion.div
        variants={cardVariants}
        whileHover={cardHover}
        className="glass-card p-8 rounded-[3rem] flex items-center justify-between relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/5 to-transparent -z-10" />
        <div>
          <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Scale size={16} className="text-purple-500" />
            {t('dashboard.weight_trend')}
          </div>
          <div className="text-6xl font-black text-white tracking-tighter">
            {currentTrendWeight ? currentTrendWeight.toFixed(1) : '--.-'}
            <span className="text-lg font-bold text-white/20 ml-2">kg</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            7D Change
          </div>
          <div className={`text-3xl font-black tracking-tighter ${weeklyChange && weeklyChange > 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
            {weeklyChange !== null ? (weeklyChange > 0 ? '+' : '') + weeklyChange.toFixed(2) : '--.--'}
            <span className="text-sm ml-1 opacity-30">kg</span>
          </div>
        </div>
      </motion.div>

      {/* Section: Weight Analysis */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.3em] px-4">Performance Insights</h3>
        <motion.div
          variants={cardVariants}
          className="glass-card p-8 rounded-[3rem]"
        >
          <div className="h-64 w-full">
            {weightTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightTrendData}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}
                    tickFormatter={(str) => str.split('-').slice(1).join('/')}
                  />
                  <YAxis
                    domain={['dataMin - 0.5', 'dataMax + 0.5']}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#141414',
                      borderRadius: '24px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                      padding: '12px 20px'
                    }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Line
                    name="Trend"
                    type="monotone"
                    dataKey="trend"
                    stroke="#3b82f6"
                    strokeWidth={5}
                    dot={false}
                    animationDuration={2000}
                    filter="drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"
                  />
                  <Line
                    name="Actual"
                    type="monotone"
                    dataKey="value"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={2}
                    strokeDasharray="8 8"
                    dot={{ r: 4, fill: 'rgba(255,255,255,0.2)', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-white/10 font-black uppercase tracking-widest italic text-xs">
                Analyzing baseline...
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Row: Adaptive Intake */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div
          variants={cardVariants}
          className="glass-card p-8 rounded-[3rem]"
        >
          <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
            <Zap size={16} className="text-yellow-500" />
            Energy Balance History
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}
                  tickFormatter={(str) => str.split('-').slice(2).join('/')}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141414', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <Bar dataKey="calories" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <ReferenceLine
                  y={weeklyHistory[0]?.tdee}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  label={{ position: 'right', value: 'TARGET', fill: '#ef4444', fontSize: 8, fontWeight: 'black' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

      <motion.div
        variants={cardVariants}
        whileHover={cardHover}
        className="bg-blue-500/5 dark:bg-blue-900/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-blue-500/10 shadow-xl shadow-blue-500/5"
      >
        <h4 className="font-black text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2 tracking-tight">
          How it works
          <ChevronDown size={14} />
        </h4>
        <p className="text-xs text-blue-700/70 dark:text-blue-300/60 leading-relaxed font-bold">
          The blue line shows your 20-day weight trend (EMA). This filters out water weight
          fluctuations and gives you a better idea of your actual progress. Your TDEE is adapted
          based on how your trend weight changes relative to your calorie intake.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Trends;
