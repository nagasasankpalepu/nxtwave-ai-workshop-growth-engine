import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Share2,
  Copy,
  Check,
  Award,
  Users,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  Trophy,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function ReferralShareCard({ registration, onExploreDashboard }) {
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const referralCode = registration?.referral_code || 'NXT-SAMPLE';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const shareUrl = `${origin}/?ref=${referralCode}&channel=student_ambassador`;

  const whatsappMessage = `Hey! 👋 I just registered for the free workshop: *"Build Your First AI Project in 60 Minutes"*. It is designed for final-year engineering students preparing for internships and campus placements. We'll build and deploy a working AI project from scratch. Grab your free seat using my link: ${shareUrl}`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;

  async function fetchStats() {
    if (!referralCode) return;
    setLoadingStats(true);
    try {
      const res = await api.getReferralStats(referralCode);
      if (res.success) {
        setStats(res.data);
      }
    } catch (e) {
      console.warn('Could not load referral stats:', e);
    } finally {
      setLoadingStats(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, [referralCode]);

  function copyToClipboard() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden w-full max-w-md mx-auto transition-all">
      
      {/* Top Header Card */}
      <div className="bg-slate-900 text-white p-6 sm:p-7 relative">
        <div className="flex items-center gap-1.5 text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-2">
          <span>● Registration Confirmed</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          Welcome aboard, {registration?.name || 'Student'}! 🎉
        </h2>
        <p className="text-slate-300 text-xs mt-1 leading-relaxed">
          Your seat for <strong>"Build Your First AI Project in 60 Minutes"</strong> is locked.
        </p>

        {/* Unique Referral Code Badge */}
        <div className="mt-4 p-3 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Your Referral Code
            </span>
            <span className="font-mono text-xl font-black text-white tracking-wider">
              {referralCode}
            </span>
          </div>
          <button
            onClick={copyToClipboard}
            className="bg-white hover:bg-slate-100 text-slate-900 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Link' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Actions */}
      <div className="p-6 space-y-5">

        {/* 1-Click Sharing */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Share with College Classmates:
          </label>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Live Referral Stats Card */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h5 className="font-bold text-slate-900 text-xs">
                Your Ambassador Status
              </h5>
            </div>
            <button
              onClick={fetchStats}
              disabled={loadingStats}
              className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200 transition-colors"
              title="Refresh referral count"
            >
              <RefreshCw className={`w-3 h-3 ${loadingStats ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Confirmed Referrals</span>
              <span className="text-xl font-black text-indigo-600">{stats?.totalReferrals ?? 0}</span>
              <span className="text-[10px] text-slate-500 block">Peer Signups</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Tier</span>
              <span className="text-xs font-bold text-slate-800 block mt-1">{stats?.tier ?? 'Advocate'}</span>
              <span className="text-[10px] text-slate-500 block">
                {stats?.remainingForNext > 0
                  ? `${stats.remainingForNext} more to next tier`
                  : 'Top Tier Reached!'}
              </span>
            </div>
          </div>

          {stats?.referredUsers && stats.referredUsers.length > 0 && (
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 block mb-1">
                Batchmates Joined ({stats.referredUsers.length}):
              </span>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {stats.referredUsers.map((u, i) => (
                  <div key={i} className="text-[11px] bg-white px-2 py-1 rounded border border-slate-200 flex justify-between">
                    <span className="font-medium text-slate-800">{u.name}</span>
                    <span className="text-slate-500 truncate max-w-[120px]">{u.college}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Organizer Switch Link */}
        {onExploreDashboard && (
          <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Organizer tracking campaign?</span>
            <button
              onClick={onExploreDashboard}
              className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline flex items-center gap-1"
            >
              <span>Campaign Portal &rarr;</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
