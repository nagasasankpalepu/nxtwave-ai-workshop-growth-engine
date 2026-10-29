import React, { useState } from 'react';
import {
  Code2,
  Menu,
  X,
  ArrowRight,
  BarChart3,
  Sparkles
} from 'lucide-react';

export default function LandingNavbar({ onOpenRegisterModal, onSwitchToOrganizer }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function scrollToSection(id) {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <span className="font-extrabold text-sm tracking-tight">NW</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm tracking-tight">
                NxtWave
              </span>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                AI Workshop
              </span>
            </div>
          </div>

          {/* Public Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button
              onClick={() => scrollToSection('project-preview')}
              className="hover:text-slate-950 transition-colors"
            >
              What You'll Build
            </button>
            <button
              onClick={() => scrollToSection('agenda-section')}
              className="hover:text-slate-950 transition-colors"
            >
              3-Step Agenda
            </button>
            <button
              onClick={() => scrollToSection('benefits-section')}
              className="hover:text-slate-950 transition-colors"
            >
              Benefits
            </button>
            <button
              onClick={() => scrollToSection('faq-section')}
              className="hover:text-slate-950 transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Organizer Dashboard Switcher Button */}
            <button
              onClick={onSwitchToOrganizer}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-white shadow-xs"
              title="Open organizer campaign analytics dashboard"
            >
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Organizer Portal</span>
            </button>

            {/* Primary Registration CTA */}
            <button
              onClick={onOpenRegisterModal}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all active:scale-[0.99]"
            >
              <span>Register Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden">
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="space-y-1 text-sm font-medium text-slate-700">
            <button
              onClick={() => scrollToSection('project-preview')}
              className="block w-full text-left py-2 px-2 rounded-lg hover:bg-slate-50"
            >
              What You'll Build
            </button>
            <button
              onClick={() => scrollToSection('agenda-section')}
              className="block w-full text-left py-2 px-2 rounded-lg hover:bg-slate-50"
            >
              3-Step Agenda
            </button>
            <button
              onClick={() => scrollToSection('benefits-section')}
              className="block w-full text-left py-2 px-2 rounded-lg hover:bg-slate-50"
            >
              Benefits
            </button>
            <button
              onClick={() => scrollToSection('faq-section')}
              className="block w-full text-left py-2 px-2 rounded-lg hover:bg-slate-50"
            >
              FAQ
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegisterModal();
              }}
              className="w-full text-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm"
            >
              Register for Free Workshop
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSwitchToOrganizer();
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200"
            >
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Switch to Organizer Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
