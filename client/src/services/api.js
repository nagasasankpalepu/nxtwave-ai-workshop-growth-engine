// API Client for NxtWave AI Workshop Growth Engine

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function getOrganizerKey() {
  try {
    return localStorage.getItem('nxtwave_organizer_key') || '';
  } catch {
    return '';
  }
}

export function setOrganizerKey(key) {
  try {
    if (key) {
      localStorage.setItem('nxtwave_organizer_key', key.trim());
    } else {
      localStorage.removeItem('nxtwave_organizer_key');
    }
  } catch (e) { }
}

async function fetchJson(url, options = {}, isOrganizerRequest = false) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (isOrganizerRequest) {
    const key = getOrganizerKey();
    if (key) {
      headers['x-organizer-key'] = key;
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.errors
        ? data.errors.join(', ')
        : (data.error || data.message || 'API request failed');
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    if (err.status) throw err;
    throw new Error('Unable to connect to backend server. Make sure the Node.js API server is running on port 5000.');
  }
}

export const api = {
  // Public Student Registration
  registerStudent: (formData) => {
    return fetchJson('/register', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  },

  // Student Referral Lookup
  getReferralStats: (referralCode) => {
    return fetchJson(`/referrals/${encodeURIComponent(referralCode)}`);
  },

  // Campaign Metrics (Overview)
  getCampaignMetrics: (filter = 'all') => {
    return fetchJson(`/campaign/metrics?filter=${encodeURIComponent(filter)}`, {}, true);
  },

  // Registrations Table List (ORGANIZER PROTECTED)
  getRegistrations: ({ page = 1, limit = 20, filter = 'all', channel = 'all', search = '' }) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      filter,
      channel,
      search
    });
    return fetchJson(`/campaign/registrations?${params.toString()}`, {}, true);
  },

  // Seed Demo Data (ORGANIZER PROTECTED)
  seedSyntheticData: () => {
    return fetchJson('/campaign/seed', { method: 'POST' }, true);
  },

  // Reset Demo Data (ORGANIZER PROTECTED)
  resetSyntheticData: () => {
    return fetchJson('/campaign/reset', { method: 'POST' }, true);
  },

  // Campaign Settings & Budget Assumptions
  getSettings: () => {
    return fetchJson('/campaign/settings', {}, true);
  },

  // Update Campaign Settings (ORGANIZER PROTECTED)
  updateSettings: (settings) => {
    return fetchJson('/campaign/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    }, true);
  },

  // AI Growth Assistant
  generateAi: ({ taskType, customPrompt, context }) => {
    return fetchJson('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ taskType, customPrompt, context })
    });
  },

  // Message Library
  getMessages: () => {
    return fetchJson('/messages');
  },

  // Track page visit for conversion calculation
  trackPageView: (path = '/', channel = 'direct', referralCode = null) => {
    return fetchJson('/page-view', {
      method: 'POST',
      body: JSON.stringify({ path, channel, referral_code: referralCode })
    }).catch(() => { });
  }
};
