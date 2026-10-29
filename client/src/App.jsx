import React, { useState, useEffect } from 'react';
import LandingNavbar from './components/LandingNavbar';
import LandingFooter from './components/LandingFooter';
import OrganizerLayout from './components/OrganizerLayout';
import RegistrationForm from './components/RegistrationForm';
import ReferralShareCard from './components/ReferralShareCard';
import LandingPage from './pages/LandingPage';
import CampaignDashboardPage from './pages/CampaignDashboardPage';
import ReferralAmbassadorPage from './pages/ReferralAmbassadorPage';
import GrowthStrategyPlannerPage from './pages/GrowthStrategyPlannerPage';
import AiGrowthAssistantPage from './pages/AiGrowthAssistantPage';
import { api } from './services/api';
import { OrganizerThemeProvider } from './context/OrganizerThemeContext';
import { X } from 'lucide-react';

export default function App() {
  // Primary view: 'landing' (Public Student Workshop) or 'organizer' (Campaign Portal)
  const [currentView, setCurrentView] = useState('landing');

  // Organizer active navigation tab: 'overview', 'referrals', 'plan', 'budget', 'ai-assistant', 'messages'
  const [organizerTab, setOrganizerTab] = useState('overview');

  // Campaign filter: 'all', 'real', 'synthetic'
  const [activeFilter, setActiveFilter] = useState('all');

  // Quick Registration Modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [modalRegisteredData, setModalRegisteredData] = useState(null);

  const [isSeeding, setIsSeeding] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Initialize from URL params if present
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const viewParam = searchParams.get('view');
      const tabParam = searchParams.get('tab');
      const refCode = searchParams.get('ref') || searchParams.get('referral');
      const channel = searchParams.get('channel') || 'direct';

      if (viewParam === 'organizer' || ['dashboard', 'strategy', 'referrals', 'ai-assistant'].includes(viewParam)) {
        setCurrentView('organizer');
        if (viewParam === 'strategy') setOrganizerTab('plan');
        else if (viewParam === 'referrals') setOrganizerTab('referrals');
        else if (viewParam === 'ai-assistant') setOrganizerTab('ai-assistant');
        else setOrganizerTab('overview');
      }

      if (tabParam) {
        setOrganizerTab(tabParam);
      }

      api.trackPageView(window.location.pathname, channel, refCode);
    } catch (e) {}
  }, []);

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  async function handleSeedDemo() {
    setIsSeeding(true);
    try {
      const res = await api.seedSyntheticData();
      showToast(res.message || 'Synthetic demonstration records successfully reloaded.');
      window.dispatchEvent(new Event('refreshData'));
    } catch (e) {
      showToast('Error reloading demo data: ' + e.message);
    } finally {
      setIsSeeding(false);
    }
  }

  async function handleResetDemo() {
    if (!window.confirm('Clear synthetic demonstration data? Real student submissions will remain preserved.')) {
      return;
    }
    try {
      const res = await api.resetSyntheticData();
      showToast(res.message || 'Demo records cleared.');
      window.dispatchEvent(new Event('refreshData'));
    } catch (e) {
      showToast('Error resetting demo data: ' + e.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-slate-700">
          {toastMessage}
        </div>
      )}

      {/* VIEW 1: PUBLIC WORKSHOP LANDING PAGE */}
      {currentView === 'landing' && (
        <div className="min-h-screen flex flex-col bg-white">
          <LandingNavbar
            onOpenRegisterModal={() => {
              setModalRegisteredData(null);
              setIsRegisterModalOpen(true);
            }}
            onSwitchToOrganizer={() => {
              setCurrentView('organizer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          <main className="flex-1">
            <LandingPage
              onExploreDashboard={() => {
                setCurrentView('organizer');
                setOrganizerTab('overview');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </main>

          <LandingFooter
            onSwitchToOrganizer={() => {
              setCurrentView('organizer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {/* VIEW 2: INTERNAL ORGANIZER PORTAL */}
      {currentView === 'organizer' && (
        <OrganizerThemeProvider>
          <OrganizerLayout
            activeTab={organizerTab}
            onTabChange={(tab) => setOrganizerTab(tab)}
            onSwitchToPublic={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            activeFilter={activeFilter}
            onFilterChange={(f) => setActiveFilter(f)}
            onSeedDemo={handleSeedDemo}
            onResetDemo={handleResetDemo}
            isSeeding={isSeeding}
          >
            {organizerTab === 'overview' && (
              <CampaignDashboardPage
                activeFilter={activeFilter}
                onFilterChange={(f) => setActiveFilter(f)}
                onSeedDemo={handleSeedDemo}
                onResetDemo={handleResetDemo}
                isSeeding={isSeeding}
              />
            )}

            {organizerTab === 'referrals' && (
              <ReferralAmbassadorPage />
            )}

            {organizerTab === 'plan' && (
              <GrowthStrategyPlannerPage initialMode="plan" />
            )}

            {organizerTab === 'budget' && (
              <GrowthStrategyPlannerPage initialMode="budget" />
            )}

            {organizerTab === 'ai-assistant' && (
              <AiGrowthAssistantPage initialMode="ai" />
            )}

            {organizerTab === 'messages' && (
              <AiGrowthAssistantPage initialMode="messages" />
            )}
          </OrganizerLayout>
        </OrganizerThemeProvider>
      )}

      {/* Quick Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-md my-8">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white text-slate-700 hover:text-slate-950 shadow-md flex items-center justify-center border border-slate-200 cursor-pointer"
              aria-label="Close registration modal"
            >
              <X className="w-4 h-4" />
            </button>

            {modalRegisteredData ? (
              <ReferralShareCard
                registration={modalRegisteredData}
                onExploreDashboard={() => {
                  setIsRegisterModalOpen(false);
                  setCurrentView('organizer');
                  setOrganizerTab('overview');
                }}
              />
            ) : (
              <RegistrationForm
                onSuccess={(data) => setModalRegisteredData(data)}
              />
            )}
          </div>
        </div>
      )}

    </div>
  );
}
