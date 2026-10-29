require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const { requireOrganizerAuth } = require('./middleware/auth');
const {
  registrationLimiter,
  aiGenerationLimiter,
  pageViewLimiter,
  organizerActionLimiter
} = require('./middleware/rateLimiter');
const { registerStudent, getReferralStats } = require('./services/referralService');
const {
  getCampaignMetrics,
  seedSyntheticData,
  resetAllData,
  getSettings,
  updateSettings,
  validateCampaignSettings
} = require('./services/campaignAnalyticsService');
const { generateAiContent } = require('./services/aiService');
const { getAllTemplates, getTemplateById } = require('./services/messageLibraryService');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Trust first proxy hop if running behind reverse proxy (e.g., Nginx / Cloudflare)
app.set('trust proxy', 1);

// --- CORS CONFIGURATION ---
const rawOrigins = process.env.ALLOWED_ORIGINS || '';
const configuredOrigins = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);
const devOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];
const allowedOrigins = [...new Set([...devOrigins, ...configuredOrigins])];

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests (same-origin, curl, server-to-server, test runner)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS request blocked by server security policy.'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-organizer-key'],
  credentials: true
}));

// Body parser with strict size limit to prevent payload flooding DoS
app.use(express.json({ limit: '100kb' }));

// --- ROUTES ---

// Health check
app.get('/api/health', (req, res) => {
  try {
    const totalCount = db.prepare('SELECT COUNT(*) as count FROM registrations').get().count;
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected (SQLite WAL mode)',
      totalRegistrations: totalCount
    });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

// Student Registration (Public endpoint protected by registration rate limiter)
app.post('/api/register', registrationLimiter, (req, res) => {
  try {
    // SECURITY FIX: Public registrations cannot manipulate is_synthetic or timestamps
    const result = registerStudent(req.body, { allowSynthetic: false, allowCustomTimestamp: false });
    if (!result.success) {
      return res.status(result.status || 400).json({
        success: false,
        errors: result.errors,
        existingReferralCode: result.existingReferralCode
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration confirmed for "Build Your First AI Project in 60 Minutes"!',
      registration: result.data
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      errors: ['A server database error occurred while saving your registration. Please try again.']
    });
  }
});

// Referral Stats for a Student
app.get('/api/referrals/:code', (req, res) => {
  try {
    const code = (req.params.code || '').trim().slice(0, 50);
    const stats = getReferralStats(code);
    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'Referral code not found in our records.'
      });
    }
    res.json({ success: true, data: stats });
  } catch (err) {
    console.error('Referral lookup error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Campaign Growth Metrics (Public dashboard aggregated metrics)
app.get('/api/campaign/metrics', (req, res) => {
  try {
    let filter = req.query.filter || 'all';
    if (!['all', 'real', 'synthetic'].includes(filter)) {
      filter = 'all';
    }
    const metrics = getCampaignMetrics(filter);
    res.json({ success: true, data: metrics });
  } catch (err) {
    console.error('Metrics fetch error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// List Registrations (ORGANIZER ONLY: Requires organizer authentication)
app.get('/api/campaign/registrations', requireOrganizerAuth, (req, res) => {
  try {
    const rawPage = parseInt(req.query.page || 1, 10);
    const rawLimit = parseInt(req.query.limit || 20, 10);
    const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage);
    const limit = Math.min(100, Math.max(1, isNaN(rawLimit) ? 20 : rawLimit));
    const offset = (page - 1) * limit;

    let filter = req.query.filter || 'all';
    if (!['all', 'real', 'synthetic'].includes(filter)) {
      filter = 'all';
    }

    const channel = req.query.channel && typeof req.query.channel === 'string'
      ? req.query.channel.slice(0, 50)
      : null;

    const search = req.query.search && typeof req.query.search === 'string'
      ? req.query.search.trim().slice(0, 100)
      : null;

    let whereClauses = [];
    let params = [];

    if (filter === 'real') {
      whereClauses.push('is_synthetic = 0');
    } else if (filter === 'synthetic') {
      whereClauses.push('is_synthetic = 1');
    }

    if (channel && channel !== 'all') {
      whereClauses.push('acquisition_channel = ?');
      params.push(channel);
    }

    if (search) {
      whereClauses.push('(name LIKE ? OR email LIKE ? OR college LIKE ? OR referral_code LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) as total FROM registrations ${whereStr}`;
    const total = db.prepare(countQuery).get(...params).total;

    const dataQuery = `
      SELECT id, name, name as full_name, email, college, college as college_name,
             grad_year, grad_year as graduation_year, referral_code, referred_by_code,
             acquisition_channel, is_synthetic, created_at
      FROM registrations
      ${whereStr}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const rows = db.prepare(dataQuery).all(...params, limit, offset);

    res.json({
      success: true,
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Registrations list error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Seed Synthetic Demo Data (ORGANIZER ONLY: Requires organizer authentication & rate limiter)
app.post('/api/campaign/seed', requireOrganizerAuth, organizerActionLimiter, (req, res) => {
  try {
    const result = seedSyntheticData();
    res.json({
      success: true,
      message: `Successfully seeded ${result.seeded} synthetic student registrations for the simulation. Real student registrations remain intact.`,
      result
    });
  } catch (err) {
    console.error('Seeding error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reset Synthetic Demo Data (ORGANIZER ONLY: Requires organizer authentication & rate limiter)
app.post('/api/campaign/reset', requireOrganizerAuth, organizerActionLimiter, (req, res) => {
  try {
    resetAllData();
    res.json({
      success: true,
      message: 'Synthetic demonstration data has been safely cleared. Real user registrations remain preserved.'
    });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Campaign Settings (GET: Public or Organizer view)
app.get('/api/campaign/settings', (req, res) => {
  try {
    const settings = getSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Campaign Settings Update (ORGANIZER ONLY: Requires organizer authentication, validation, & rate limiter)
app.put('/api/campaign/settings', requireOrganizerAuth, organizerActionLimiter, (req, res) => {
  try {
    const validation = validateCampaignSettings(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Campaign settings validation failed',
        errors: validation.errors
      });
    }

    updateSettings(validation.sanitized);
    const updated = getSettings();
    res.json({
      success: true,
      message: 'Campaign settings validated and updated successfully',
      data: updated
    });
  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// AI Growth Assistant (Protected by dedicated rate limiter and input validation)
app.post('/api/ai/generate', aiGenerationLimiter, async (req, res) => {
  try {
    const { taskType = 'daily_summary', customPrompt, context = {} } = req.body;

    // Validate inputs
    const allowedTasks = ['whatsapp_hook', 'tech_club_email', 'campaign_experiments', 'diagnose_channels', 'daily_summary', 'custom'];
    if (taskType && typeof taskType !== 'string') {
      return res.status(400).json({ success: false, error: 'taskType must be a string' });
    }
    const safeTask = allowedTasks.includes(taskType) ? taskType : 'daily_summary';

    let safePrompt = null;
    if (customPrompt) {
      if (typeof customPrompt !== 'string') {
        return res.status(400).json({ success: false, error: 'customPrompt must be a string' });
      }
      safePrompt = customPrompt.trim().slice(0, 1000);
    }

    const safeContext = (context && typeof context === 'object' && !Array.isArray(context)) ? { ...context } : {};

    // Attach latest campaign metrics to context if not provided
    if (!safeContext.totalRegistrations) {
      const metrics = getCampaignMetrics('all');
      safeContext.totalRegistrations = metrics.overview.totalRegistrations;
      safeContext.targetRegistrations = metrics.overview.targetRegistrations;
      safeContext.remainingToTarget = metrics.overview.remainingToTarget;
      safeContext.budgetSpent = metrics.overview.totalSpent;
      safeContext.totalBudget = metrics.overview.totalBudget;
      safeContext.remainingBudget = metrics.overview.remainingBudget;
    }

    const aiResult = await generateAiContent({ taskType: safeTask, context: safeContext, customPrompt: safePrompt });
    res.json(aiResult);
  } catch (err) {
    console.error('AI generation error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Campaign Message Library
app.get('/api/messages', (req, res) => {
  try {
    const templates = getAllTemplates();
    res.json({ success: true, data: templates });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/messages/:id', (req, res) => {
  try {
    const safeId = (req.params.id || '').trim().slice(0, 50);
    const template = getTemplateById(safeId);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, data: template });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Track Page Views for Conversion Rate (Protected by rate limiter and input sanitization)
app.post('/api/page-view', pageViewLimiter, (req, res) => {
  try {
    const { path = '/', channel = 'direct', referral_code = null } = req.body;
    const safePath = typeof path === 'string' ? path.slice(0, 200) : '/';
    const safeChannel = typeof channel === 'string' ? channel.slice(0, 50) : 'direct';
    const safeRef = typeof referral_code === 'string' ? referral_code.trim().slice(0, 50) : null;

    db.prepare(`
      INSERT INTO page_views (path, channel, referral_code, is_synthetic, created_at)
      VALUES (?, ?, ?, 0, ?)
    `).run(safePath, safeChannel, safeRef, new Date().toISOString());
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Automatically seed synthetic data on fresh startup if database has 0 records
try {
  const count = db.prepare('SELECT COUNT(*) as count FROM registrations').get().count;
  if (count === 0) {
    console.log('Database empty. Auto-seeding initial 342 synthetic registrations for demonstration...');
    seedSyntheticData();
    console.log('Initial synthetic data seeded successfully.');
  }
} catch (e) {
  console.warn('Auto-seed check notice:', e.message);
}

// Start server only when run directly
let server = null;
if (require.main === module) {
  server = app.listen(PORT, HOST, () => {
    console.log(`====================================================`);
    console.log(`NxtWave AI Workshop Growth Engine API Backend Running`);
    console.log(`Port: http://localhost:${PORT} (Bound to ${HOST})`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`AI Engine: ${process.env.GEMINI_API_KEY ? 'Google Gemini API' : 'Deterministic Growth Engine (Fallback Mode)'}`);
    console.log(`Organizer Auth: Active (Key Protection Enabled)`);
    console.log(`Rate Limiting: Active (Registration, AI, Views, Organizer)`);
    console.log(`====================================================`);
  });
}

module.exports = { app, server };
