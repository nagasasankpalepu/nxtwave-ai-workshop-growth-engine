import React from 'react';
import { AlertTriangle, Database, RefreshCw, Sparkles } from 'lucide-react';

export default function SimulationBanner({ onSeed, onReset, isSeeding, activeFilter, onFilterChange }) {
  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white text-xs md:text-sm py-2 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-200" />
            Simulation Data
          </span>
          <span className="font-medium text-amber-50">
            NxtWave Growth Challenge Prototype • Synthetic demonstration data is clearly tagged. Real student submissions are preserved separately.
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {onFilterChange && (
            <div className="flex items-center bg-black/20 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => onFilterChange('all')}
                className={`px-2 py-1 rounded transition-colors ${activeFilter === 'all' ? 'bg-white text-slate-900 font-semibold' : 'text-white/80 hover:text-white'}`}
              >
                All Data
              </button>
              <button
                onClick={() => onFilterChange('real')}
                className={`px-2 py-1 rounded transition-colors ${activeFilter === 'real' ? 'bg-white text-slate-900 font-semibold' : 'text-white/80 hover:text-white'}`}
              >
                Real Only
              </button>
              <button
                onClick={() => onFilterChange('synthetic')}
                className={`px-2 py-1 rounded transition-colors ${activeFilter === 'synthetic' ? 'bg-white text-slate-900 font-semibold' : 'text-white/80 hover:text-white'}`}
              >
                Demo Only
              </button>
            </div>
          )}

          {onSeed && (
            <button
              onClick={onSeed}
              disabled={isSeeding}
              className="bg-white/15 hover:bg-white/25 text-white px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1"
              title="Seed 342 synthetic registrations across 6 days"
            >
              <Database className="w-3 h-3" />
              {isSeeding ? 'Seeding...' : 'Reload Demo Data'}
            </button>
          )}

          {onReset && (
            <button
              onClick={onReset}
              className="bg-red-900/30 hover:bg-red-900/50 text-red-100 px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 border border-red-300/30"
              title="Clear synthetic data while keeping real registrations"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Demo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
