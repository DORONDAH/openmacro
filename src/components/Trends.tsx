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
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts';
import { useMetrics } from '../hooks/useMetrics';
import { Scale, Zap, TrendingUp, Activity } from 'lucide-react';

const Trends: React.FC = () => {
  const { t, i18n } = useTranslation();
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
      className="space-y-10 pb-32 px-2"
    >
      <div className="flex flex-col gap-1 px-4 mb-8">
        <div className="text-[10px] font-black text-purple-500 uppercase tracking-[0.6em] mb-2 animate-pulse flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
          {t('dashboard.performance_analytics')}
        </div>
        <h2 className="text-5xl font-black text-white tracking-tighter uppercase">{t('dashboard.trends')}</h2>
        <div className="h-1 w-16 bg-purple-600 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.6)] mt-2" />
      </div>

      {/* Hero Trend Card */}
      <motion.div
        variants={cardVariants}
        whileHover={cardHover}
        className="glass-card p-10 rounded-[3.5rem] flex items-center justify-between relative overflow-hidden group shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/10 to-transparent -z-10 group-hover:opacity-20 transition-opacity" />
        <div className="absolute -end-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
          <TrendingUp size={200} className="text-purple-500" />
        </div>

        <div>
          <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <Scale size={16} className="text-purple-500" />
            {t('dashboard.weight_trend')}
          </div>
          <div className="text-7xl font-black text-white tracking-tighter">
            {currentTrendWeight ? currentTrendWeight.toFixed(1) : '--.-'}
            <span className="text-xl font-bold text-white/20 ms-2">kg</span>
          </div>
        </div>

        <div className="text-end z-10">
          <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            {t('dashboard.seven_day_delta')}
          </div>
          <div className={`text-4xl font-black tracking-tighter flex items-center justify-end gap-2 ${weeklyChange && weeklyChange > 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
            {weeklyChange !== null && (
               <TrendingUp size={24} className={weeklyChange > 0 ? 'rotate-0' : 'rotate-180'} />
            )}
            {weeklyChange !== null ? (weeklyChange > 0 ? '+' : '') + weeklyChange.toFixed(2) : '--.--'}
            <span className="text-sm font-bold opacity-30">kg</span>
          </div>
        </div>
      </motion.div>

      {/* Section: Weight Analysis */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-4">
          <Activity size={16} className="text-blue-500" />
          <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{t('dashboard.trend_trajectory')}</h3>
        </div>

        <motion.div
          variants={cardVariants}
          className="glass-card p-8 rounded-[3rem] relative overflow-hidden"
        >
          <div className="h-72 w-full">
            {weightTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightTrendData}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 'black' }}
                    tickFormatter={(str) => str.split('-').slice(2).join('/')}
                    dy={10}
                  />
                  <YAxis
                    hide
                    domain={['dataMin - 1', 'dataMax + 1']}
                  />
                  <Tooltip
                    cursor={{ stroke: 'rgba(59, 130, 246, 0.2)', strokeWidth: 2 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-card p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-3xl animate-in fade-in zoom-in duration-300">
                            <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">
                              {payload[0].payload.date}
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center justify-between gap-8">
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{t('common.trend')}</span>
                                <span className="text-sm font-black text-white">{Number(payload[0].value).toFixed(1)}kg</span>
                              </div>
                              {payload[1] && (
                                <div className="flex items-center justify-between gap-8">
                                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t('common.actual')}</span>
                                  <span className="text-sm font-black text-white/60">{Number(payload[1].value).toFixed(1)}kg</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="trend"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#trendGradient)"
                    filter="drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))"
                    animationDuration={2500}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={2}
                    strokeDasharray="8 8"
                    dot={{ r: 4, fill: 'rgba(255,255,255,0.2)', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative">
                  <div className="w-24 h-24 bg-purple-500/10 rounded-[2.5rem] flex items-center justify-center text-purple-500 blur-sm group-hover:blur-0 transition-all duration-700">
                     <TrendingUp size={48} />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 bg-purple-500/20 rounded-[2.5rem] -z-10 blur-xl"
                  />
                </div>

                <div className="text-center space-y-3 z-10">
                  <div className="text-white font-black text-xl tracking-[0.2em] uppercase">{t('dashboard.calibration_required')}</div>
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] max-w-[220px] mx-auto leading-relaxed">
                    {t('dashboard.insufficient_data')}
                    <span className="block mt-2 text-purple-500/50 italic">{t('dashboard.log_daily')}</span>
                  </p>
                </div>

                {/* Cinematic progress bar simulator */}
                <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="h-full w-1/2 bg-purple-500/30"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Row: Adaptive Intake */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-4">
          <Zap size={16} className="text-yellow-500" />
          <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{t('dashboard.intake_vs_tdee')}</h3>
        </div>

        <motion.div
          variants={cardVariants}
          className="glass-card p-10 rounded-[3rem] relative"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 'black' }}
                  tickFormatter={(str) => {
                    const d = new Date(str);
                    return d.toLocaleDateString(i18n.language, { weekday: 'short' }).toUpperCase();
                  }}
                  dy={10}
                />
                <YAxis
                  hide
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 12 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass-card p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-3xl">
                          <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">
                            {new Date(data.date).toLocaleDateString(i18n.language, { weekday: 'long', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-8">
                              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{t('common.intake')}</span>
                              <span className="text-sm font-black text-white">{data.calories.toLocaleString()} <span className="text-[10px] text-white/20">kcal</span></span>
                            </div>
                            <div className="flex items-center justify-between gap-8">
                              <span className="text-[10px] font-black text-red-500/50 uppercase tracking-widest">{t('common.target')}</span>
                              <span className="text-sm font-black text-white/60">{data.tdee.toLocaleString()} <span className="text-[10px] text-white/20">kcal</span></span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full mt-1 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-1000 ${data.calories > data.tdee ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min((data.calories / data.tdee) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="calories"
                  fill="#3b82f6"
                  radius={[12, 12, 12, 12]}
                  barSize={32}
                  className="drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                />
                <ReferenceLine
                  y={weeklyHistory[weeklyHistory.length - 1]?.tdee || 2500}
                  stroke="#ef4444"
                  strokeDasharray="8 8"
                  strokeWidth={2}
                  label={{ position: 'top', value: t('common.target').toUpperCase(), fill: '#ef4444', fontSize: 10, fontWeight: 'black', letterSpacing: '0.2em' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Trends;
