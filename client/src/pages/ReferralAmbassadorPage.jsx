import React, { useState } from 'react';
import { api } from '../services/api';
import {
  Users,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Award,
  Trophy,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Link as LinkIcon,
  Info
} from 'lucide-react';
import { useOrganizerTheme } from '../context/OrganizerThemeContext';

export default function ReferralAmbassadorPage() {
  const { isDark } = useOrganizerTheme();
  const [lookupCode, setLookupCode] = useState('');
  const [lookupStats, setLookupStats] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState(null);

  // Custom Link Generator State
  const [builderCollege, setBuilderCollege] = useState('CBIT Hyderabad');
  const [builderChannel, setBuilderChannel] = useState('whatsapp_group');
  const [builderCustomRef, setBuilderCustomRef] = useState('NXT-AMBASSADOR');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const customGeneratedUrl = `${origin}/?ref=${encodeURIComponent(builderCustomRef)}&channel=${encodeURIComponent(builderChannel)}&utm_source=${encodeURIComponent(builderCollege.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase())}&utm_medium=growth_engine&utm_campaign=ai_workshop_60min`;

  const customShareMessage = `Hey everyone 👋 If you're looking to add a practical, working AI project to your resume for upcoming internships and campus placement drives, check out this free workshop:

🚀 *"Build Your First AI Project in 60 Minutes"*
• Hands-on guided build (clean GitHub repo ready)
• Beginner-friendly, 100% Free
• Co-learning initiative for ${builderCollege} engineering students

Register your free seat here: ${customGeneratedUrl}`;

  async function handleLookup(e) {
    e.preventDefault();
    if (!lookupCode.trim()) return;

    setLookupLoading(true);
    setLookupError(null);
    setLookupStats(null);

    try {
      const res = await api.getReferralStats(lookupCode.trim());
      if (res.success) {
        setLookupStats(res.data);
      }
    } catch (err) {
      setLookupError('Referral code not found in our database records. Please check the code.');
    } finally {
      setLookupLoading(false);
    }
  }

  function copyText(text, isMsg = false) {
    navigator.clipboard.writeText(text).then(() => {
      if (isMsg) {
        setCopiedMsg(true);
        setTimeout(() => setCopiedMsg(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    });
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* HEADER */}
      <div
        className={`p-6 rounded-2xl border shadow-card transition-colors ${
          isDark
            ? 'bg-[#172033] border-[#334155] text-[#F8FAFC]'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="max-w-3xl">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-2 border ${
              isDark
                ? 'bg-indigo-950/80 border-indigo-800/40 text-[#818CF8]'
                : 'bg-indigo-50 border-indigo-100 text-indigo-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Organic Growth & Ambassador Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Referral & Student Ambassador System
          </h2>
          <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            The referral engine turns every registered engineering student into an active advocate. Authentic peer-to-peer sharing in college WhatsApp groups and campus clubs drives registrations at ₹0 marginal ad spend.
          </p>
        </div>
      </div>

      {/* VIRAL MECHANICS TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-xl border shadow-card space-y-1.5 transition-colors ${
            isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-md font-bold flex items-center justify-center text-xs ${
              isDark ? 'bg-indigo-900/60 text-[#818CF8]' : 'bg-indigo-50 text-indigo-700'
            }`}
          >
            1
          </span>
          <h4 className="font-bold text-xs">Student Registration</h4>
          <p className={`text-[11px] leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Student submits name and verified email. Backend normalizes input and prevents duplicate alias inflation.
          </p>
        </div>

        <div
          className={`p-4 rounded-xl border shadow-card space-y-1.5 transition-colors ${
            isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-md font-bold flex items-center justify-center text-xs ${
              isDark ? 'bg-indigo-900/60 text-[#818CF8]' : 'bg-indigo-50 text-indigo-700'
            }`}
          >
            2
          </span>
          <h4 className="font-bold text-xs">Unique Code Issued</h4>
          <p className={`text-[11px] leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Server creates a clean alphanumeric code (e.g. <code>NXT-NAME####</code>) and tailored WhatsApp share link.
          </p>
        </div>

        <div
          className={`p-4 rounded-xl border shadow-card space-y-1.5 transition-colors ${
            isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-md font-bold flex items-center justify-center text-xs ${
              isDark ? 'bg-indigo-900/60 text-[#818CF8]' : 'bg-indigo-50 text-indigo-700'
            }`}
          >
            3
          </span>
          <h4 className="font-bold text-xs">Attribution Verified</h4>
          <p className={`text-[11px] leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            When batchmates sign up, anti-fraud rules verify the referrer exists and reject self-referral attempts.
          </p>
        </div>

        <div
          className={`p-4 rounded-xl border shadow-card space-y-1.5 transition-colors ${
            isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-md font-bold flex items-center justify-center text-xs ${
              isDark ? 'bg-indigo-900/60 text-[#818CF8]' : 'bg-indigo-50 text-indigo-700'
            }`}
          >
            4
          </span>
          <h4 className="font-bold text-xs">Milestone Recognition</h4>
          <p className={`text-[11px] leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Student referrers unlock Campus Advocate & Lead Ambassador recognition with priority resume reviews.
          </p>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Code Inspector */}
        <div
          className={`lg:col-span-6 p-5 sm:p-6 rounded-2xl border shadow-card space-y-4 transition-colors ${
            isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <h3 className="text-sm font-bold">
              Referral Code Live Inspector
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Query any student's code to audit verified referrals and network status in real time.
            </p>
          </div>

          <form onSubmit={handleLookup} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. NXT-ADIA35E or NXT-SNE2C42"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value.toUpperCase())}
              className={`flex-1 px-3 py-2 text-xs rounded-xl border font-mono focus:outline-none uppercase ${
                isDark
                  ? 'bg-[#1E293B] border-[#334155] text-white focus:border-indigo-400'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
              }`}
            />
            <button
              type="submit"
              disabled={lookupLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {lookupLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Inspect</span>
            </button>
          </form>

          {lookupError && (
            <div
              className={`p-3 rounded-xl border text-xs ${
                isDark
                  ? 'bg-red-950/40 border-red-900/40 text-red-300'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
              role="alert"
            >
              {lookupError}
            </div>
          )}

          {lookupStats ? (
            <div
              className={`p-4 rounded-xl border space-y-3 ${
                isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-2 border-inherit">
                <div>
                  <span className="font-bold text-xs block">{lookupStats.student.name}</span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {lookupStats.student.college}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    isDark
                      ? 'bg-indigo-900/60 text-[#818CF8] border-indigo-700/50'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}
                >
                  {lookupStats.tier}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div
                  className={`p-2.5 rounded-lg border ${
                    isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
                  }`}
                >
                  <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Confirmed Signups
                  </span>
                  <span className="text-xl font-black text-indigo-400">{lookupStats.totalReferrals}</span>
                </div>
                <div
                  className={`p-2.5 rounded-lg border ${
                    isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
                  }`}
                >
                  <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Next Milestone
                  </span>
                  <span className="text-xs font-bold block mt-0.5">{lookupStats.nextTier}</span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {lookupStats.remainingForNext} more required
                  </span>
                </div>
              </div>

              {lookupStats.referredUsers.length > 0 ? (
                <div>
                  <span className={`text-[11px] font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Direct Attributed Students ({lookupStats.referredUsers.length}):
                  </span>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {lookupStats.referredUsers.map((u, i) => (
                      <div
                        key={i}
                        className={`text-[11px] px-2.5 py-1 rounded border flex justify-between ${
                          isDark
                            ? 'bg-[#172033] border-[#334155] text-slate-200'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <span className="font-medium">{u.name}</span>
                        <span className={`truncate max-w-[160px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {u.college}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className={`text-xs italic text-center py-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  No peer registrations attributed to this code yet.
                </p>
              )}
            </div>
          ) : !lookupError && (
            <div
              className={`p-6 rounded-xl border border-dashed text-center text-xs ${
                isDark ? 'border-[#334155] text-slate-500' : 'border-slate-200 text-slate-400'
              }`}
            >
              Enter any student referral code above to inspect live attribution stats.
            </div>
          )}

          <div
            className={`p-3 rounded-xl border text-xs space-y-1 ${
              isDark
                ? 'bg-[#1E293B] border-[#334155] text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <span className="font-bold flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Built-in Anti-Fraud Protocol:
            </span>
            <p className={`text-[11px] leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Self-referrals are automatically blocked by the database. Duplicate emails return existing referral records without inflating referral counters.
            </p>
          </div>
        </div>

        {/* Right: Campaign Link & WhatsApp Script Generator */}
        <div
          className={`lg:col-span-6 p-5 sm:p-6 rounded-2xl border shadow-card space-y-4 transition-colors ${
            isDark ? 'bg-[#172033] border-[#334155]' : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <h3 className="text-sm font-bold">
              Campaign Link & WhatsApp Generator
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Generate custom tracked URLs with UTM tags for college WhatsApp groups or ambassador outreach.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Target College / Campus Community
              </label>
              <input
                type="text"
                value={builderCollege}
                onChange={(e) => setBuilderCollege(e.target.value)}
                placeholder="e.g. CBIT, VIT, PES..."
                className={`w-full px-3 py-1.5 text-xs rounded-xl border focus:outline-none ${
                  isDark
                    ? 'bg-[#1E293B] border-[#334155] text-white focus:border-indigo-400'
                    : 'border-slate-300 text-slate-900 focus:border-indigo-600'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Channel Vector
                </label>
                <select
                  value={builderChannel}
                  onChange={(e) => setBuilderChannel(e.target.value)}
                  className={`w-full px-3 py-1.5 text-xs rounded-xl border focus:outline-none ${
                    isDark
                      ? 'bg-[#1E293B] border-[#334155] text-white'
                      : 'border-slate-300 bg-white text-slate-900'
                  }`}
                >
                  <option value="whatsapp_group">WhatsApp Class Group</option>
                  <option value="student_ambassador">Student Ambassador</option>
                  <option value="technical_club">Technical Club Partner</option>
                  <option value="email">Personal Email</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Referral Code Tag
                </label>
                <input
                  type="text"
                  value={builderCustomRef}
                  onChange={(e) => setBuilderCustomRef(e.target.value.toUpperCase())}
                  className={`w-full px-3 py-1.5 text-xs rounded-xl border font-mono focus:outline-none uppercase ${
                    isDark
                      ? 'bg-[#1E293B] border-[#334155] text-white'
                      : 'border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            {/* Generated URL */}
            <div className="pt-1">
              <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Generated Tracked URL:
              </label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={customGeneratedUrl}
                  className={`flex-1 px-3 py-1.5 text-xs rounded-xl border font-mono truncate ${
                    isDark
                      ? 'bg-[#1E293B] border-[#334155] text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => copyText(customGeneratedUrl, false)}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Formatted WhatsApp Script */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Pre-Formatted WhatsApp Copy:
                </span>
                <button
                  type="button"
                  onClick={() => copyText(customShareMessage, true)}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedMsg ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMsg ? 'Copied!' : 'Copy Script'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={3}
                value={customShareMessage}
                className={`w-full p-2.5 text-xs rounded-xl border font-sans resize-none ${
                  isDark
                    ? 'bg-[#1E293B] border-[#334155] text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              />
            </div>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(customShareMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Launch in WhatsApp</span>
            </a>

          </div>
        </div>

      </div>

    </div>
  );
}
