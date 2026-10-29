import React, { useState } from 'react';
import {
  Sparkles,
  BarChart3,
  Users,
  Compass,
  Bot,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenRegisterModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Workshop Landing', shortLabel: 'Landing', icon: Sparkles },
    { id: 'dashboard', label: 'Campaign Dashboard', shortLabel: 'Dashboard', icon: BarChart3, badge: '500 Goal' },
    { id: 'referrals', label: 'Referral Engine', shortLabel: 'Referrals', icon: Users },
    { id: 'strategy', label: '7-Day Plan & Budget', shortLabel: 'Plan & Budget', icon: Compass, badge: '₹2,000' },
    { id: 'ai-assistant', label: 'AI Growth Assistant', shortLabel: 'AI Assistant', icon: Bot, isNew: true },
  ];

  function handleNavClick(id) {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer flex-shrink-0"
            onClick={() => handleNavClick('landing')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
              <span className="font-extrabold text-sm tracking-wider">NW</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight tracking-tight">
                  NxtWave
                </span>
                <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Growth Engine
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5 hidden xl:block">
                Build Your First AI Project in 60 Minutes
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-shrink">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="hidden xl:inline">{item.label}</span>
                  <span className="inline xl:hidden">{item.shortLabel}</span>
                  {item.badge && (
                    <span className="hidden 2xl:inline-block ml-0.5 text-[9px] font-bold px-1 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {item.badge}
                    </span>
                  )}
                  {item.isNew && (
                    <span className="ml-0.5 text-[9px] font-bold px-1 py-0.2 rounded-full bg-emerald-100 text-emerald-700">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            {activePage === 'landing' ? (
              <button
                onClick={onOpenRegisterModal}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm shadow-blue-500/20 hover:shadow-md transition-all flex items-center gap-1"
              >
                <span>Free Registration</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('landing')}
                className="text-blue-600 hover:text-blue-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-all flex items-center gap-1"
              >
                <span>Preview Workshop</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegisterModal();
              }}
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-xs text-center shadow-sm"
            >
              Register for Free Workshop
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
