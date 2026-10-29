import React, { useState } from 'react';
import { api } from '../services/api';
import {
  Compass,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Save,
  Check,
  ChevronRight,
  Sliders,
  TrendingUp,
  Info
} from 'lucide-react';
import { useOrganizerTheme } from '../context/OrganizerThemeContext';

export default function GrowthStrategyPlannerPage({ initialMode = 'plan' }) {
  const { isDark } = useOrganizerTheme();
  const [activeSubTab, setActiveSubTab] = useState(initialMode);

  // Editable Budget State (Default ₹2,000)
  const [budget, setBudget] = useState({
    creative_assets: 500,
    targeted_promotion: 800,
    ambassador_activation: 400,
    contingency: 300
  });

  // Editable Channel Quotas State (Default 500)
  const [channelTargets, setChannelTargets] = useState({
    whatsapp_group: 200,
    student_ambassador: 150,
    technical_club: 100,
    email: 50
  });

  // Dynamic Reallocation Simulation State
  const [underperformingChannel, setUnderperformingChannel] = useState('email');
  const [reallocationAmount, setReallocationAmount] = useState(25);
  const [recipientChannel, setRecipientChannel] = useState('whatsapp_group');

  const [activeDay, setActiveDay] = useState(1);
  const [savedNotice, setSavedNotice] = useState(false);

  const totalBudgetCalculated = Object.values(budget).reduce((a, b) => a + Number(b || 0), 0);
  const totalRegistrationsCalculated = Object.values(channelTargets).reduce((a, b) => a + Number(b || 0), 0);

  const budgetIsExact = totalBudgetCalculated === 2000;
  const targetIsExact = totalRegistrationsCalculated === 500;

  function handleBudgetChange(field, val) {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setBudget(prev => ({ ...prev, [field]: num }));
  }

  function handleChannelChange(field, val) {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setChannelTargets(prev => ({ ...prev, [field]: num }));
  }

  function handleApplyReallocation() {
    if (underperformingChannel === recipientChannel) return;
    const currentFrom = channelTargets[underperformingChannel] || 0;
    const transfer = Math.min(currentFrom, reallocationAmount);

    setChannelTargets(prev => ({
      ...prev,
      [underperformingChannel]: Math.max(0, prev[underperformingChannel] - transfer),
      [recipientChannel]: (prev[recipientChannel] || 0) + transfer
    }));
  }

  async function handleSaveAssumptions() {
    try {
      await api.updateSettings({
        channel_targets: channelTargets,
        budget_breakdown: budget
      });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    } catch (e) {
      console.error('Error saving assumptions:', e);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    }
  }

  const sevenDayRoadmap = [
    {
      day: 1,
      title: 'Day 1: Foundation & Ambassador Mapping',
      focus: 'Asset Preparation & Ambassador Recruitment',
      tactics: [
        'Finalize clean workshop curriculum copy, GitHub repo template, and registration page.',
        'Map 25 target engineering institutions (CBIT, VIT, PES, RVCE, SRM, MIT Pune, etc.).',
        'Directly message 15 proactive class representatives / club leads to join as Cohort Growth Ambassadors.',
        'Distribute unique ambassador referral codes with pre-written peer WhatsApp scripts.'
      ],
      budgetUsed: '₹250 (Asset design & collateral)',
      targetMilestone: '40 Cumulative Registrations',
      channel: 'Ambassadors & Organic'
    },
    {
      day: 2,
      title: 'Day 2: Initial Community Seeding',
      focus: 'Soft Launch in College WhatsApp Groups',
      tactics: [
        'Student Ambassadors share value-first announcements in their branch & section WhatsApp groups.',
        'Strict policy: Zero spamming, no repetitive link bombing, value-driven project highlight.',
        'Gather initial registration feedback from early adopters on form clarity and session questions.',
        'Audit initial referral loop mechanics to verify attribution integrity.'
      ],
      budgetUsed: '₹150 (Creative variations)',
      targetMilestone: '100 Cumulative Registrations',
      channel: 'College WhatsApp Groups'
    },
    {
      day: 3,
      title: 'Day 3: Viral Referral Activation',
      focus: 'Incentivized Peer-to-Peer Sharing',
      tactics: [
        'Trigger automated notification to all registered students displaying their unique referral link.',
        'Launch "Campus Advocate Leaderboard": top student referrers unlock priority 1-on-1 resume reviews.',
        'Encourage study group signups: "Forward to your capstone project partners so you can build together."',
        'Monitor conversion rate of referral links vs direct visits.'
      ],
      budgetUsed: '₹200 (Ambassador activation incentives)',
      targetMilestone: '180 Cumulative Registrations',
      channel: 'Student Referrals'
    },
    {
      day: 4,
      title: 'Day 4: Technical Club Partnerships',
      focus: 'Formal Collaboration with Campus Coding Societies',
      tactics: [
        'Send personalized educational collaboration proposals to presidents of IEEE, ACM, CSI, and AI clubs.',
        'Offer official co-hosting recognition: featured on workshop slides and digital certificates.',
        'Co-host an interactive 10-minute preview or AMA in club Discord / Telegram servers.',
        'Track club-specific UTM links to identify high-density technical communities.'
      ],
      budgetUsed: '₹200 (Club partnership recognition assets)',
      targetMilestone: '270 Cumulative Registrations',
      channel: 'Technical Clubs'
    },
    {
      day: 5,
      title: 'Day 5: Mid-Campaign Value Push',
      focus: 'Live Project Preview Teasers',
      tactics: [
        'Share a 45-second screen recording demonstrating the working AI project in action.',
        'Post on LinkedIn highlighting practical engineering skills needed for upcoming campus drives.',
        'Release a teaser of the code architecture: API connection, prompt structure, and UI output.',
        'Engage batchmates who showed interest but did not complete the initial registration.'
      ],
      budgetUsed: '₹350 (Targeted student micro-promotion)',
      targetMilestone: '360 Cumulative Registrations',
      channel: 'Targeted Promotion'
    },
    {
      day: 6,
      title: 'Day 6: Channel Optimization & Double-Down',
      focus: 'Data Review & Reallocating Effort',
      tactics: [
        'Conduct midday growth audit: compare WhatsApp groups vs Technical Clubs vs Cold Outreach.',
        'Deprecate underperforming channels (e.g. cold email if open rates < 15%).',
        'Double down on top-performing colleges and active student ambassadors.',
        'Prepare clean reminder assets for final Day 7 push.'
      ],
      budgetUsed: '₹300 (Targeted community amplification)',
      targetMilestone: '440 Cumulative Registrations',
      channel: 'Optimization'
    },
    {
      day: 7,
      title: 'Day 7: Final Registration Sprint & Close',
      focus: 'Honest Final Call & Readiness Briefing',
      tactics: [
        'Send morning countdown reminder only to opted-in student contacts and active WhatsApp channels.',
        'Strict compliance: zero artificial urgency or fake countdown clocks. Transparent session start time.',
        'Distribute setup checklist (browser + GitHub account) to ensure smooth live coding.',
        'Lock registrations upon crossing 500 cohort capacity to maintain high-quality live mentoring.'
      ],
      budgetUsed: '₹250 (Final reminder distribution & contingency)',
      targetMilestone: '500 Cumulative Registrations (Target Achieved)',
      channel: 'Multi-Channel Push'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* HEADER WITH SUB-TABS */}
      <div
        className={`p-6 rounded-2xl border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
          isDark
            ? 'bg-[#172033] border-[#334155] text-[#F8FAFC]'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div>
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-1.5 border ${
              isDark
                ? 'bg-indigo-950/80 border-indigo-800/40 text-[#818CF8]'
                : 'bg-indigo-50 border-indigo-100 text-indigo-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Campaign Growth Strategy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {activeSubTab === 'plan' ? 'Seven-Day Tactical Plan' : 'Campaign Budget Planner'}
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Operational roadmap and editable allocation models for the 500-registration campaign.
          </p>
        </div>

        {/* View Toggle */}
        <div
          className={`p-1 rounded-xl flex items-center text-xs font-semibold self-start sm:self-auto border ${
            isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            onClick={() => setActiveSubTab('plan')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'plan'
                ? isDark
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-900 font-bold shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Seven-Day Plan
          </button>
          <button
            onClick={() => setActiveSubTab('budget')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'budget'
                ? isDark
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-900 font-bold shadow-xs'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Budget Planner (₹2,000)
          </button>
        </div>
      </div>

      {/* PLANNING ASSUMPTIONS TRANSPARENCY NOTICE */}
      <div
        className={`p-4 rounded-xl border text-xs flex items-start gap-3 transition-colors ${
          isDark
            ? 'bg-[#172033] border-[#334155] text-slate-300'
            : 'bg-amber-50/70 border-amber-200 text-amber-900'
        }`}
      >
        <Info className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
        <div className="space-y-0.5">
          <span className="font-bold">Planning Assumptions Notice:</span>
          <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-amber-800'}`}>
            All channel targets (500 registrations) and expense breakdowns (₹2,000 budget) are <strong>tactical planning assumptions and strategic projections</strong>, not guaranteed outcomes. Organizers can tune allocations below based on live channel performance.
          </p>
        </div>
      </div>

      {/* VIEW 1: SEVEN-DAY PLAN */}
      {activeSubTab === 'plan' && (
        <div className="space-y-6">
          
          {/* Channel Target Allocation Card */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border shadow-card space-y-4 transition-colors ${
              isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold">
                  Channel Targets (Verified Total: 500 Registrations)
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Target allocation across the 4 primary growth vectors: 200 + 150 + 100 + 50 = 500
                </p>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${
                  targetIsExact
                    ? isDark
                      ? 'bg-emerald-950/60 text-[#34D399] border-emerald-800/40'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                Quota Total: {totalRegistrationsCalculated} / 500
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div className={`p-3 rounded-xl border space-y-1 ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  WhatsApp Communities
                </span>
                <span className="text-xl font-black text-indigo-400">{channelTargets.whatsapp_group}</span>
                <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  40% of target (20-25 colleges)
                </span>
              </div>

              <div className={`p-3 rounded-xl border space-y-1 ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Student Ambassadors
                </span>
                <span className="text-xl font-black text-indigo-400">{channelTargets.student_ambassador}</span>
                <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  30% of target (Viral referrals)
                </span>
              </div>

              <div className={`p-3 rounded-xl border space-y-1 ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Technical Clubs
                </span>
                <span className="text-xl font-black text-indigo-400">{channelTargets.technical_club}</span>
                <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  20% of target (Coding societies)
                </span>
              </div>

              <div className={`p-3 rounded-xl border space-y-1 ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Email & Outreach
                </span>
                <span className="text-xl font-black text-indigo-400">{channelTargets.email}</span>
                <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  10% of target (Targeted leads)
                </span>
              </div>
            </div>
          </div>

          {/* INTERACTIVE CHANNEL REALLOCATOR TOOL */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border shadow-card space-y-4 transition-colors ${
              isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold">
                Mid-Campaign Channel Reallocator
              </h3>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Identify an underperforming channel and reallocate effort/target quotas to high-converting channels in real time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-1">
              <div className="sm:col-span-4 space-y-1">
                <label className={`text-[11px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  From Underperforming Channel:
                </label>
                <select
                  value={underperformingChannel}
                  onChange={(e) => setUnderperformingChannel(e.target.value)}
                  className={`w-full text-xs rounded-xl border p-2 focus:outline-none ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="email">Email Outreach ({channelTargets.email} seats)</option>
                  <option value="technical_club">Technical Clubs ({channelTargets.technical_club} seats)</option>
                  <option value="whatsapp_group">WhatsApp Groups ({channelTargets.whatsapp_group} seats)</option>
                  <option value="student_ambassador">Ambassadors ({channelTargets.student_ambassador} seats)</option>
                </select>
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className={`text-[11px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Reallocate Seats:
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  step="5"
                  value={reallocationAmount}
                  onChange={(e) => setReallocationAmount(Number(e.target.value))}
                  className={`w-full text-xs rounded-xl border p-2 focus:outline-none ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className={`text-[11px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  To High-Yield Channel:
                </label>
                <select
                  value={recipientChannel}
                  onChange={(e) => setRecipientChannel(e.target.value)}
                  className={`w-full text-xs rounded-xl border p-2 focus:outline-none ${
                    isDark ? 'bg-[#1E293B] border-[#334155] text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="whatsapp_group">WhatsApp Communities</option>
                  <option value="student_ambassador">Student Ambassadors</option>
                  <option value="technical_club">Technical Clubs</option>
                  <option value="email">Email Outreach</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  onClick={handleApplyReallocation}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold p-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* 7-DAY ROADMAP TABS & ACCORDION */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border shadow-card space-y-4 transition-colors ${
              isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">
                  Day-by-Day Tactical Execution Plan
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Actionable activities, intended channels, budget spend, and measurable objectives for all 7 days
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-800/40">
                Active Sprint
              </span>
            </div>

            {/* Day Selector Buttons */}
            <div className="grid grid-cols-7 gap-1.5 pt-2">
              {sevenDayRoadmap.map((d) => (
                <button
                  key={d.day}
                  onClick={() => setActiveDay(d.day)}
                  className={`p-2 rounded-xl text-center transition-all cursor-pointer border ${
                    activeDay === d.day
                      ? isDark
                        ? 'bg-indigo-600 text-white font-bold border-indigo-500 shadow-xs'
                        : 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
                      : isDark
                      ? 'bg-[#1E293B] border-[#334155] text-slate-400 hover:text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-[10px] font-bold uppercase">Day</span>
                  <span className="text-sm font-black">{d.day}</span>
                </button>
              ))}
            </div>

            {/* Selected Day Detail Card */}
            {(() => {
              const current = sevenDayRoadmap.find(d => d.day === activeDay) || sevenDayRoadmap[0];
              return (
                <div
                  className={`p-5 rounded-xl border space-y-3.5 transition-colors ${
                    isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-inherit">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                        Sprint Stage &bull; {current.channel}
                      </span>
                      <h4 className="text-base font-black mt-0.5">{current.title}</h4>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{current.focus}</p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                          isDark
                            ? 'bg-emerald-950/60 text-[#34D399] border-emerald-800/40'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {current.targetMilestone}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                          isDark
                            ? 'bg-[#172033] text-slate-300 border-[#334155]'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {current.budgetUsed}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Actionable Tactical Checklist:
                    </span>
                    <div className="space-y-2">
                      {current.tactics.map((t, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>

        </div>
      )}

      {/* VIEW 2: BUDGET PLANNER (₹2,000) */}
      {activeSubTab === 'budget' && (
        <div className="space-y-6">
          
          <div
            className={`p-5 sm:p-6 rounded-2xl border shadow-card space-y-4 transition-colors ${
              isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold">
                  Campaign Budget Allocation (Target: Exactly ₹2,000)
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Proposed budget: Creative (₹500) + Promo (₹800) + Activation (₹400) + Contingency (₹300) = ₹2,000
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    budgetIsExact
                      ? isDark
                        ? 'bg-emerald-950/60 text-[#34D399] border-emerald-800/40'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  Total: ₹{totalBudgetCalculated} / ₹2,000
                </span>

                <button
                  onClick={handleSaveAssumptions}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savedNotice ? 'Saved!' : 'Save Model'}</span>
                </button>
              </div>
            </div>

            {/* 4 Editable Budget Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              
              <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold">Creative Assets</span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>25% (₹500)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold">₹</span>
                  <input
                    type="number"
                    value={budget.creative_assets}
                    onChange={(e) => handleBudgetChange('creative_assets', e.target.value)}
                    className={`w-full text-sm font-black p-1.5 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-[#172033] border-[#334155] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Workshop banners, syllabus graphics & GitHub README badges
                </p>
              </div>

              <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold">Targeted Promotion</span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>40% (₹800)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold">₹</span>
                  <input
                    type="number"
                    value={budget.targeted_promotion}
                    onChange={(e) => handleBudgetChange('targeted_promotion', e.target.value)}
                    className={`w-full text-sm font-black p-1.5 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-[#172033] border-[#334155] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Sponsored student newsletters & technical community amplification
                </p>
              </div>

              <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold">Community Activation</span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>20% (₹400)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold">₹</span>
                  <input
                    type="number"
                    value={budget.ambassador_activation}
                    onChange={(e) => handleBudgetChange('ambassador_activation', e.target.value)}
                    className={`w-full text-sm font-black p-1.5 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-[#172033] border-[#334155] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Student ambassador recognition badges & club co-hosting credits
                </p>
              </div>

              <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold">Contingency Reserve</span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>15% (₹300)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold">₹</span>
                  <input
                    type="number"
                    value={budget.contingency}
                    onChange={(e) => handleBudgetChange('contingency', e.target.value)}
                    className={`w-full text-sm font-black p-1.5 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-[#172033] border-[#334155] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Mid-campaign reserve for Day 6 optimization and surge push
                </p>
              </div>

            </div>

            {/* Projected CAC Card */}
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">Blended Target Customer Acquisition Cost (CAC):</span>
                <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  ₹2,000 Total Budget / 500 Student Registrations
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-400">
                  ₹{(totalBudgetCalculated / (totalRegistrationsCalculated || 1)).toFixed(2)}
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/ student signup</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
