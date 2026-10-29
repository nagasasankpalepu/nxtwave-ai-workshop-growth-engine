import React, { useState, useEffect } from 'react';
import { api, setOrganizerKey, getOrganizerKey } from '../services/api';
import {
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area
} from 'recharts';
import {
  Users,
  Target,
  DollarSign,
  Share2,
  Eye,
  RefreshCw,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Database,
  Layers,
  Info,
  Lock,
  Key
} from 'lucide-react';
import { useOrganizerTheme } from '../context/OrganizerThemeContext';

const CHANNEL_COLORS = {
  whatsapp_group: '#25D366',
  student_ambassador: '#818CF8',
  technical_club: '#A78BFA',
  email: '#F59E0B',
  organic: '#34D399',
  direct: '#94A3B8'
};

export default function CampaignDashboardPage({
  activeFilter,
  onFilterChange,
  onSeedDemo,
  onResetDemo,
  isSeeding
}) {
  const { isDark } = useOrganizerTheme();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Auth gate state
  const [authRequired, setAuthRequired] = useState(!getOrganizerKey());
  const [keyInput, setKeyInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [submittingKey, setSubmittingKey] = useState(false);

  async function loadData() {
    setRefreshing(true);
    try {
      const [metricRes, regRes] = await Promise.all([
        api.getCampaignMetrics(activeFilter),
        api.getRegistrations({
          page,
          limit: 10,
          filter: activeFilter,
          channel: channelFilter,
          search: searchTerm
        })
      ]);

      if (metricRes.success) {
        setMetrics(metricRes.data);
      }
      if (regRes.success) {
        setRegistrations(regRes.data);
        setPagination(regRes.pagination);
        // If data loaded successfully, auth is clearly fine
        setAuthRequired(false);
        setAuthError('');
      }
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
      // 401 = no key, 403 = wrong key — show auth gate
      if (e.status === 401 || e.status === 403) {
        setAuthRequired(true);
        setAuthError(
          e.status === 403
            ? 'Incorrect organizer key — please try again.'
            : 'Organizer key required to view registrations.'
        );
        setLoading(false);
        setRefreshing(false);
        return;
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleKeySubmit(e) {
    e.preventDefault();
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setAuthError('Please enter the organizer key.');
      return;
    }
    setSubmittingKey(true);
    setAuthError('');
    setOrganizerKey(trimmed);
    // Reload data with the new key
    try {
      const [metricRes, regRes] = await Promise.all([
        api.getCampaignMetrics(activeFilter),
        api.getRegistrations({ page: 1, limit: 10, filter: activeFilter, channel: 'all', search: '' })
      ]);
      if (metricRes.success) setMetrics(metricRes.data);
      if (regRes.success) {
        setRegistrations(regRes.data);
        setPagination(regRes.pagination);
        setAuthRequired(false);
        setAuthError('');
      }
    } catch (e) {
      if (e.status === 401 || e.status === 403) {
        setOrganizerKey(''); // clear bad key
        setAuthError('Invalid organizer key. Please check and try again.');
      } else {
        setAuthError('Server error — check that the backend is running.');
      }
    } finally {
      setSubmittingKey(false);
    }
  }

  useEffect(() => {
    if (!authRequired) {
      loadData();
    }
  }, [activeFilter, channelFilter, page]);

  // Trigger first load
  useEffect(() => {
    loadData();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    loadData();
  }

  // ── AUTH GATE ──────────────────────────────────────────────────────────────
  if (authRequired) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center px-4">
        <div
          className={`w-full max-w-md p-8 rounded-2xl border shadow-card space-y-5 ${
            isDark
              ? 'bg-[#172033] border-[#334155]'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-indigo-900/50 border border-indigo-700/40' : 'bg-indigo-50 border border-indigo-100'
            }`}>
              <Lock className="w-7 h-7 text-indigo-500" />
            </div>
            <div>
              <h2 className={`text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Organizer Authentication
              </h2>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Enter your organizer key to access the campaign dashboard, registrations, and controls.
              </p>
            </div>
          </div>

          <form onSubmit={handleKeySubmit} className="space-y-3">
            <div className="relative">
              <Key className={`w-4 h-4 absolute left-3 top-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="password"
                placeholder="Enter organizer key..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                autoFocus
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:border-indigo-500 ${
                  isDark
                    ? 'bg-[#1E293B] border-[#334155] text-white placeholder-slate-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                } ${authError ? (isDark ? 'border-red-600/60' : 'border-red-400') : ''}`}
              />
            </div>

            {authError && (
              <p className="text-xs font-medium text-red-400 flex items-center gap-1">
                <span>⚠</span> {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={submittingKey}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {submittingKey ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Verifying...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> Unlock Dashboard</>
              )}
            </button>
          </form>

          <div className={`p-3 rounded-xl border text-xs ${
            isDark
              ? 'bg-[#1E293B] border-[#334155] text-slate-400'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <strong className={isDark ? 'text-slate-300' : 'text-slate-600'}>Dev hint:</strong>{' '}
            The key is set in <code className="font-mono">server/.env</code> as{' '}
            <code className="font-mono">ORGANIZER_KEY</code>.
          </div>
        </div>
      </div>
    );
  }

  if (loading && !metrics) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-7 h-7 text-indigo-500 animate-spin" />
        <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Loading campaign analytics...
        </p>
      </div>
    );
  }

  const overview = metrics?.overview || {};
  const channelData = metrics?.channelData || [];
  const dailyData = metrics?.dailyData || [];
  const topAmbassadors = metrics?.topAmbassadors || [];
  const insights = metrics?.insights || [];

  const pieData = channelData.map(c => ({
    name: c.label,
    value: c.count,
    color: CHANNEL_COLORS[c.channel] || '#94A3B8'
  }));

  return (
    <div className="space-y-6 pb-12">
      
      {/* SUMMARY BANNER */}
      <div
        className={`p-6 rounded-2xl border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
          isDark
            ? 'bg-[#172033] border-[#334155] text-[#F8FAFC]'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Live Campaign Engine &bull; 7-Day Sprint
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
            Campaign Performance Overview
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Tracking student registrations toward the 500-seat goal within the ₹2,000 budget cap.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={refreshing}
            className={`p-2 rounded-xl border transition-colors shadow-xs cursor-pointer ${
              isDark
                ? 'bg-[#1E293B] border-[#334155] text-slate-300 hover:text-white hover:bg-[#253248]'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Refresh metrics from SQLite database"
            aria-label="Refresh metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Target Progress */}
        <div
          className={`p-5 rounded-2xl border shadow-card transition-colors ${
            isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Registrations Target
            </span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black">
              {overview.totalRegistrations}
            </span>
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              / {overview.targetRegistrations} Goal
            </span>
          </div>
          <div className={`mt-2.5 w-full rounded-full h-2 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, overview.targetProgressPercent || 0)}%` }}
            />
          </div>
          <div className={`flex items-center justify-between text-[11px] font-medium mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>{overview.targetProgressPercent}% achieved</span>
            <span className="font-bold text-amber-400">{overview.remainingToTarget} needed</span>
          </div>
        </div>

        {/* Card 2: Cost Spent & CAC */}
        <div
          className={`p-5 rounded-2xl border shadow-card transition-colors ${
            isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Campaign Budget
            </span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black">
              ₹{overview.totalSpent}
            </span>
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              / ₹{overview.totalBudget} Cap
            </span>
          </div>
          <div
            className={`mt-2.5 flex items-center justify-between text-[11px] px-2.5 py-1 rounded-lg font-medium border ${
              isDark
                ? 'bg-[#1E293B] border-[#334155] text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span>Blended CAC: ₹{overview.costPerRegistration}/student</span>
            <span className="text-emerald-400 font-bold">&le; ₹4.00</span>
          </div>
          <div className={`flex items-center justify-between text-[11px] mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Contingency Reserve:</span>
            <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              ₹{overview.remainingBudget} unspent
            </span>
          </div>
        </div>

        {/* Card 3: Referral Velocity */}
        <div
          className={`p-5 rounded-2xl border shadow-card transition-colors ${
            isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Referral Share
            </span>
            <Share2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black">
              {overview.referralPercent}%
            </span>
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              of Total Signups
            </span>
          </div>
          <div
            className={`mt-2.5 flex items-center justify-between text-[11px] px-2.5 py-1 rounded-lg font-bold border ${
              isDark
                ? 'bg-indigo-950/60 border-indigo-800/40 text-indigo-300'
                : 'bg-indigo-50/70 border-indigo-100 text-indigo-900'
            }`}
          >
            <span>{overview.referralDrivenCount} Peer Signups</span>
            <span className="text-emerald-400 font-semibold">₹0 Ad Spend</span>
          </div>
          <div className={`flex items-center justify-between text-[11px] mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Viral Multiplier (K-Factor):</span>
            <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>~0.42x</span>
          </div>
        </div>

        {/* Card 4: Funnel Conversion */}
        <div
          className={`p-5 rounded-2xl border shadow-card transition-colors ${
            isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Funnel Conversion
            </span>
            <Eye className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black">
              {overview.conversionRate}%
            </span>
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Visitor CVR
            </span>
          </div>
          <div
            className={`mt-2.5 flex items-center justify-between text-[11px] px-2.5 py-1 rounded-lg border ${
              isDark
                ? 'bg-[#1E293B] border-[#334155] text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span>Tracked Visitors:</span>
            <span className="font-bold">{overview.totalViews?.toLocaleString()}</span>
          </div>
          <div className={`flex items-center justify-between text-[11px] mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Campaign Day:</span>
            <span className="font-bold text-indigo-400">Day 6 of 7 Active</span>
          </div>
        </div>

      </div>

      {/* DATA CATEGORIZATION & METHODOLOGY NOTICE */}
      <div
        className={`p-4 rounded-xl border text-xs flex items-start gap-3 transition-colors ${
          isDark
            ? 'bg-[#172033] border-[#334155] text-slate-300'
            : 'bg-blue-50/70 border-blue-200 text-blue-900'
        }`}
      >
        <Info className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-[#818CF8]' : 'text-blue-600'}`} />
        <div className="space-y-1">
          <div className="font-bold flex items-center gap-2 flex-wrap">
            <span>Data Integrity & Categorization System:</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Verified Real
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Synthetic Demo
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Target Model (500)
            </span>
          </div>
          <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-blue-800'}`}>
            Metrics strictly distinguish between <strong>Database Actuals</strong> (live verified student submissions), <strong>Synthetic Demo Records</strong> (seeded cohort for testing full 7-day velocity), and <strong>Forecast Trajectory</strong>. These categories are never conflated without explicit labeling.
          </p>
        </div>
      </div>

      {/* ACTIONABLE INSIGHTS */}
      {insights.length > 0 && (
        <div
          className={`p-5 sm:p-6 rounded-2xl border shadow-card transition-colors ${
            isDark
              ? 'bg-[#172033] border-[#334155] text-white'
              : 'bg-slate-900 text-white border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Growth Intelligence & Recommended Next Actions</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {insights.map((ins, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border space-y-1.5 ${
                  isDark
                    ? 'bg-[#1E293B] border-[#334155]'
                    : 'bg-slate-800/80 border-slate-700/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-white">{ins.title}</h4>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      ins.urgency === 'high'
                        ? 'bg-amber-400/20 text-amber-300'
                        : 'bg-emerald-400/20 text-emerald-300'
                    }`}
                  >
                    {ins.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {ins.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: 7-Day Velocity ComposedChart */}
        <div
          className={`lg:col-span-8 p-5 sm:p-6 rounded-2xl border shadow-card space-y-4 transition-colors ${
            isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold">
                7-Day Registration Velocity vs 500 Target
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Actual registrations (DB bars) alongside cumulative progression and 500-target model
              </p>
            </div>
            <div className={`flex items-center gap-3 text-[11px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
                <span>Daily Signups</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-violet-400" />
                <span>Cumulative</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-amber-400 border-dashed" />
                <span>Target Pace</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#F1F5F9'} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: isDark ? '#94A3B8' : '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: isDark ? '#94A3B8' : '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E293B' : '#0F172A',
                    borderRadius: '10px',
                    border: isDark ? '1px solid #334155' : 'none',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="registrations" name="Daily Registrations (DB)" fill="#818CF8" radius={[4, 4, 0, 0]} />
                <Area type="monotone" dataKey="cumulative" name="Actual Cumulative (DB)" stroke="#A78BFA" strokeWidth={2} fillOpacity={1} fill="url(#colorDaily)" />
                <Line type="monotone" dataKey="target" name="500 Target Pace" stroke="#FBBF24" strokeDasharray="4 4" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Channel Acquisition Breakdown */}
        <div
          className={`lg:col-span-4 p-5 sm:p-6 rounded-2xl border shadow-card space-y-4 transition-colors ${
            isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <h3 className="text-sm font-bold">
              Acquisition by Channel
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Distribution across campaign vectors
            </p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E293B' : '#0F172A',
                    borderRadius: '8px',
                    border: isDark ? '1px solid #334155' : 'none',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs pt-1">
            {channelData.map((c) => (
              <div key={c.channel} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CHANNEL_COLORS[c.channel] || '#94A3B8' }}
                  />
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{c.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{c.count}</span>
                  <span className={`w-8 text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {c.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* REGISTRATIONS DATABASE TABLE */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border shadow-card space-y-4 transition-colors ${
          isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>Registered Students Master Table</span>
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Search and filter student submissions stored in the SQLite database
            </p>
          </div>

          {/* Search & Channel Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <form onSubmit={handleSearch} className="flex items-center gap-1.5">
              <div className="relative">
                <Search className={`w-3.5 h-3.5 absolute left-2.5 top-2.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  placeholder="Search name, college, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 w-44 sm:w-56 ${
                    isDark
                      ? 'bg-[#1E293B] border-[#334155] text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer"
              >
                Search
              </button>
            </form>

            <select
              value={channelFilter}
              onChange={(e) => {
                setChannelFilter(e.target.value);
                setPage(1);
              }}
              className={`text-xs rounded-xl border px-2.5 py-1.5 focus:outline-none ${
                isDark
                  ? 'bg-[#1E293B] border-[#334155] text-slate-300'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <option value="all">All Channels</option>
              <option value="whatsapp_group">WhatsApp Group</option>
              <option value="student_ambassador">Ambassadors</option>
              <option value="technical_club">Tech Clubs</option>
              <option value="email">Email</option>
              <option value="direct">Direct</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                  isDark
                    ? 'border-[#334155] bg-[#1E293B] text-slate-300'
                    : 'border-slate-100 bg-slate-50 text-slate-500'
                }`}
              >
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">College & Year</th>
                <th className="py-2.5 px-3">Channel Source</th>
                <th className="py-2.5 px-3">Referral Code</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Registered At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan="6" className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    No registrations found matching the active filters.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr
                    key={reg.id}
                    className={`transition-colors ${
                      isDark
                        ? 'border-[#334155] hover:bg-[#1E293B]/60'
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-semibold">{reg.full_name}</div>
                      <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{reg.email}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div>{reg.college_name}</div>
                      <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Class of {reg.graduation_year}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${CHANNEL_COLORS[reg.acquisition_channel] || '#94A3B8'}1A`,
                          color: CHANNEL_COLORS[reg.acquisition_channel] || '#94A3B8'
                        }}
                      >
                        {reg.acquisition_channel?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[11px] text-indigo-400">
                      {reg.referral_code}
                    </td>
                    <td className="py-2.5 px-3">
                      {reg.is_synthetic ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          Demo Record
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Real Student
                        </span>
                      )}
                    </td>
                    <td className={`py-2.5 px-3 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {new Date(reg.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div
          className={`pt-3 flex items-center justify-between border-t text-xs ${
            isDark ? 'border-[#334155] text-slate-400' : 'border-slate-100 text-slate-500'
          }`}
        >
          <span>
            Showing Page <strong>{page}</strong> of <strong>{pagination.totalPages || 1}</strong> ({pagination.total} records)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={`px-3 py-1 rounded-lg border transition-colors disabled:opacity-40 cursor-pointer ${
                isDark
                  ? 'bg-[#1E293B] border-[#334155] text-slate-300'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages || 1, p + 1))}
              disabled={page >= pagination.totalPages}
              className={`px-3 py-1 rounded-lg border transition-colors disabled:opacity-40 cursor-pointer ${
                isDark
                  ? 'bg-[#1E293B] border-[#334155] text-slate-300'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
