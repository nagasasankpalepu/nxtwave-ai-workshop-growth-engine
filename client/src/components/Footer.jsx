import React from 'react';
import { ShieldCheck, Sparkles, Heart, Code2, ExternalLink } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Project Scope */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                NW
              </div>
              <span className="text-white font-bold text-sm tracking-wide">
                NxtWave AI Workshop Growth Engine
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              A comprehensive growth marketing simulation designed for the <strong>NxtWave Growth Intern – Growth Challenge Round 1</strong>. Demonstrates end-to-end viral referral mechanics, acquisition tracking, dynamic ₹2,000 budget allocation, and AI-assisted campaign operations.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulated Educational Project • Zero Unsolicited Messages</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Campaign System
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">
                  Workshop Landing Page
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Campaign Analytics Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('referrals')} className="hover:text-white transition-colors">
                  Referral & Ambassador Hub
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('strategy')} className="hover:text-white transition-colors">
                  7-Day Tactical Roadmap & Budget
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-assistant')} className="hover:text-white transition-colors">
                  AI Growth Assistant & Copy Library
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Tech Stack & Compliance */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Architecture Stack
            </h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Frontend: React 19 + Vite + Tailwind CSS</li>
              <li>• Backend: Node.js + Express API</li>
              <li>• Database: SQLite (WAL Mode)</li>
              <li>• Visuals: Recharts + Lucide Icons</li>
              <li>• Intelligence: Google Gemini API / Fallback</li>
            </ul>
          </div>

        </div>

        {/* Disclaimer Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div className="text-center md:text-left">
            <p>
              Disclaimer: This web application is a candidate demonstration project for the NxtWave Growth Intern Challenge. All workshop logistics, times, dates, and student records are simulated placeholders. No official commercial claims or affiliations are made.
            </p>
          </div>
          <div className="flex items-center gap-2 text-slate-400 flex-shrink-0">
            <span>Built with ownership & craft for NxtWave Growth Challenge</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
