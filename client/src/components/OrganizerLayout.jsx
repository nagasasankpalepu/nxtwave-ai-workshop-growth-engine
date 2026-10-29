import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  Bot,
  BookOpen,
  ArrowLeft,
  ExternalLink,
  Database,
  RefreshCw,
  Menu,
  X,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useOrganizerTheme } from '../context/OrganizerThemeContext';

export default function OrganizerLayout({
  activeTab,
  onTabChange,
  onSwitchToPublic,
  activeFilter,
  onFilterChange,
  onSeedDemo,
  onResetDemo,
  isSeeding,
  children
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isDark, toggleTheme, sidebarCollapsed, toggleSidebar } = useOrganizerTheme();

  const navItems = [
    { id: 'overview', label: 'Campaign Overview', icon: BarChart3, badge: '500 Goal' },
    { id: 'referrals', label: 'Referral Engine', icon: Users },
    { id: 'plan', label: 'Seven-Day Plan', icon: Calendar },
    { id: 'budget', label: 'Budget Planner', icon: DollarSign, badge: '₹2,000' },
    { id: 'ai-assistant', label: 'AI Growth Assistant', icon: Bot, isNew: true },
    { id: 'messages', label: 'Message Library', icon: BookOpen }
  ];

  function handleNav(id) {
    onTabChange(id);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const currentNav = navItems.find(n => n.id === activeTab) || navItems[0];

  return (
    <div
      className={`min-h-screen flex font-sans transition-colors duration-200 ${
        isDark ? 'bg-[#0B1120] text-[#F8FAFC]' : 'bg-slate-50 text-slate-900'
      }`}
    >
      
      {/* DESKTOP COLLAPSIBLE SIDEBAR */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto transition-all duration-300 border-r ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          isDark
            ? 'bg-[#111827] border-[#334155]'
            : 'bg-white border-slate-200'
        }`}
      >
        
        {/* Sidebar Brand Header & Collapse Toggle */}
        <div
          className={`p-4 border-b flex items-center ${
            sidebarCollapsed ? 'justify-center' : 'justify-between'
          } ${isDark ? 'border-[#334155]' : 'border-slate-100'}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs flex-shrink-0">
              <span className="font-black text-xs">NW</span>
            </div>
            {!sidebarCollapsed && (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    NxtWave
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      isDark ? 'bg-indigo-900/60 text-[#818CF8]' : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    Growth
                  </span>
                </div>
                <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Campaign Organizer
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Collapse Toggle Button */}
          {!sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* If sidebar is collapsed, show expand button */}
        {sidebarCollapsed && (
          <div className="p-2 border-b flex justify-center border-inherit">
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Items List */}
        <div className="p-3 flex-1 space-y-1">
          {!sidebarCollapsed && (
            <div
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Campaign Operations
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center ${
                  sidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                } rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'bg-indigo-600/20 text-[#818CF8] font-bold border border-indigo-500/30'
                      : 'bg-indigo-50 text-indigo-700 font-bold shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-100 hover:bg-[#1E293B]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive
                        ? isDark
                          ? 'text-[#818CF8]'
                          : 'text-indigo-600'
                        : isDark
                        ? 'text-slate-400'
                        : 'text-slate-400'
                    }`}
                  />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>

                {!sidebarCollapsed && item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      isDark
                        ? 'bg-[#1E293B] text-slate-300 border-[#334155]'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {!sidebarCollapsed && item.isNew && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      isDark
                        ? 'bg-emerald-950 text-[#34D399] border border-emerald-800/40'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Link */}
        <div
          className={`p-3 border-t space-y-2 ${
            isDark ? 'border-[#334155]' : 'border-slate-100'
          }`}
        >
          <button
            onClick={onSwitchToPublic}
            className={`w-full flex items-center ${
              sidebarCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-2'
            } rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-300 hover:text-white hover:bg-[#1E293B] border-[#334155]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border-slate-200'
            }`}
            title="Return to Public Workshop Landing Page"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              {!sidebarCollapsed && <span>Public Workshop Page</span>}
            </div>
            {!sidebarCollapsed && <ExternalLink className="w-3 h-3 text-slate-400" />}
          </button>

          {!sidebarCollapsed && (
            <div
              className={`px-2.5 py-1.5 rounded-lg border text-[10px] leading-tight ${
                isDark
                  ? 'bg-amber-950/40 border-amber-800/40 text-amber-300'
                  : 'bg-amber-50/80 border-amber-200/60 text-amber-900'
              }`}
            >
              <strong>Simulation Mode:</strong> Synthetic demo data labeled.
            </div>
          )}
        </div>

      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* COMPACT TOP APP BAR */}
        <header
          className={`sticky top-0 z-30 h-14 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b backdrop-blur-md transition-colors duration-200 ${
            isDark
              ? 'bg-[#0B1120]/95 border-[#334155]'
              : 'bg-white/95 border-slate-200/90'
          }`}
        >
          
          {/* Left: Mobile Menu Toggle & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className={`p-1.5 rounded-lg lg:hidden focus:outline-none ${
                isDark
                  ? 'text-slate-300 hover:bg-[#1E293B]'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1
                className={`text-sm sm:text-base font-extrabold tracking-tight leading-tight flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                <span>{currentNav.label}</span>
                <span
                  className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isDark
                      ? 'bg-emerald-950/60 text-[#34D399] border-emerald-800/40'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Target: 500</span>
                </span>
              </h1>
            </div>
          </div>

          {/* Right: Data Toggles, Theme Switcher & Simulation Controls */}
          <div className="flex items-center gap-2">
            
            {/* Filter Toggle: All vs Real vs Demo */}
            <div
              className={`p-0.5 rounded-lg flex items-center text-[11px] font-semibold ${
                isDark ? 'bg-[#172033] border border-[#334155]' : 'bg-slate-100'
              }`}
            >
              <button
                onClick={() => onFilterChange('all')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  activeFilter === 'all'
                    ? isDark
                      ? 'bg-[#1E293B] text-white shadow-xs font-bold'
                      : 'bg-white text-slate-900 shadow-xs font-bold'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View combined actual and demo data"
              >
                All Data
              </button>
              <button
                onClick={() => onFilterChange('real')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  activeFilter === 'real'
                    ? isDark
                      ? 'bg-indigo-900/60 text-[#818CF8] shadow-xs font-bold border border-indigo-700/50'
                      : 'bg-white text-indigo-700 shadow-xs font-bold'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View verified real student submissions only"
              >
                Real Only
              </button>
              <button
                onClick={() => onFilterChange('synthetic')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  activeFilter === 'synthetic'
                    ? isDark
                      ? 'bg-amber-950/60 text-amber-300 shadow-xs font-bold border border-amber-800/50'
                      : 'bg-white text-amber-700 shadow-xs font-bold'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View synthetic demonstration records only"
              >
                Demo Only
              </button>
            </div>

            {/* Quick Demo Controls */}
            <button
              onClick={onSeedDemo}
              disabled={isSeeding}
              className={`hidden md:inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors border shadow-xs cursor-pointer ${
                isDark
                  ? 'bg-[#172033] hover:bg-[#1E293B] text-slate-300 border-[#334155]'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
              title="Reload 342 synthetic registrations across 6 days"
            >
              <Database className="w-3 h-3 text-indigo-400" />
              <span>{isSeeding ? 'Seeding...' : 'Reload Demo'}</span>
            </button>

            <button
              onClick={onResetDemo}
              className={`hidden md:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg transition-colors border cursor-pointer ${
                isDark
                  ? 'bg-red-950/40 hover:bg-red-900/50 text-red-300 border-red-900/40'
                  : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
              }`}
              title="Reset synthetic demo records (preserves real student records)"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>

            {/* Organizer Auth Status Badge */}
            <div
              className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border ${
                isDark
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-900/40'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
              title="Organizer API Key Authentication Active"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Organizer Auth</span>
            </div>

            {/* THEME TOGGLE: DARK / LIGHT */}
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-center ${
                isDark
                  ? 'bg-[#172033] hover:bg-[#1E293B] text-amber-300 border-[#334155]'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
              }`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Back to Public Site CTA */}
            <button
              onClick={onSwitchToPublic}
              className="inline-flex items-center gap-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer"
            >
              <span className="hidden sm:inline">Student View</span>
              <span className="sm:hidden">Site</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </button>

          </div>

        </header>

        {/* MAIN BODY CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

      {/* MOBILE DRAWER */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-xs">
          <div
            className={`w-64 h-full flex flex-col p-4 shadow-xl border-r ${
              isDark ? 'bg-[#111827] border-[#334155]' : 'bg-white border-slate-200'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-4 border-b ${
                isDark ? 'border-[#334155]' : 'border-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-extrabold">
                  NW
                </div>
                <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Organizer Portal
                </span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className={`p-1 rounded-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-1 flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive
                        ? isDark
                          ? 'bg-indigo-600/20 text-[#818CF8] font-bold border border-indigo-500/30'
                          : 'bg-indigo-50 text-indigo-700 font-bold'
                        : isDark
                        ? 'text-slate-300 hover:bg-[#1E293B]'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div
              className={`pt-3 border-t space-y-2 ${
                isDark ? 'border-[#334155]' : 'border-slate-100'
              }`}
            >
              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  onSwitchToPublic();
                }}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold ${
                  isDark
                    ? 'border-[#334155] text-slate-200 hover:bg-[#1E293B]'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Workshop Landing</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
