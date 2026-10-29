import React from 'react';
import { ShieldCheck, BarChart3, ExternalLink } from 'lucide-react';

export default function LandingFooter({ onSwitchToOrganizer }) {
  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-500 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              NW
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm tracking-tight block">
                NxtWave AI Workshop
              </span>
              <span className="text-[11px] text-slate-500">
                Build Your First AI Project in 60 Minutes
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-slate-900 transition-colors"
            >
              Back to Top ↑
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={onSwitchToOrganizer}
              className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Organizer Campaign Portal &rarr;</span>
            </button>
          </div>
        </div>

        {/* Clear Disclaimer and Notice */}
        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] text-slate-400">
          <p className="max-w-2xl leading-relaxed">
            Educational project created for the <strong>NxtWave Growth Intern – Growth Challenge Round 1</strong>. Workshop dates, platform rooms, and mentor details are simulated configurable placeholders. No official commercial affiliation or job guarantees are made.
          </p>
          <div className="flex items-center gap-1.5 text-slate-500 flex-shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulated Growth Campaign</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
