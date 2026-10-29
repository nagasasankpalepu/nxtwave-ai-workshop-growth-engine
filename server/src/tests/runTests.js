// Automated Test Suite for NxtWave AI Workshop Growth Engine
// Tests registration validation, duplicate prevention, referral attribution,
// synthetic separation, target calculations, and budget integrity.
// Also tests all security fixes: Organizer Authentication, is_synthetic field protection,
// campaign settings validation, rate limiting, and compliance guardrails.

const assert = require('assert');
// Dedicated key for automated tests only; never use in production.
process.env.ORGANIZER_KEY = 'automated-test-key-only';
const path = require('path');

// Use deterministic test database
process.env.DATABASE_PATH = path.join(__dirname, 'test_database.sqlite');
const db = require('../db');
const {
  validateRegistrationPayload,
  registerStudent,
  getReferralStats,
  normalizeEmail
} = require('../services/referralService');
const {
  getCampaignMetrics,
  seedSyntheticData,
  resetAllData,
  getSettings,
  updateSettings,
  validateCampaignSettings
} = require('../services/campaignAnalyticsService');
const { generateAiContent } = require('../services/aiService');
const { getAllTemplates, getTemplateById } = require('../services/messageLibraryService');
const { requireOrganizerAuth, getExpectedKey, safeEqual } = require('../middleware/auth');
const { createRateLimiter, getClientIp } = require('../middleware/rateLimiter');

let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (error) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${error.message}`);
    failedTests++;
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (error) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${error.message}`);
    failedTests++;
  }
}

function createMockReqRes({ headers = {}, socket = {} } = {}) {
  let statusCode = 200;
  let responseData = null;
  const resHeaders = {};
  let nextCalled = false;

  const req = {
    headers: { ...headers },
    socket: { remoteAddress: '127.0.0.1', ...socket }
  };

  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      responseData = data;
      return res;
    },
    setHeader(key, val) {
      resHeaders[key] = val;
    },
    getHeader(key) {
      return resHeaders[key];
    }
  };

  const next = () => {
    nextCalled = true;
  };

  return {
    req,
    res,
    next,
    getStatus: () => statusCode,
    getData: () => responseData,
    isNextCalled: () => nextCalled,
    getHeaders: () => resHeaders
  };
}

async function startSuite() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING AUTOMATED GROWTH ENGINE TEST SUITE');
  console.log('======================================================\n');

  // Clean test tables
  db.exec('DELETE FROM registrations; DELETE FROM page_views;');

  // --- SUITE 1: Validation Tests ---
  console.log('--- Test Suite 1: Registration Validation ---');

  runTest('Rejects missing full name', () => {
    const res = validateRegistrationPayload({
      name: '',
      email: 'student@college.edu',
      college: 'VIT',
      grad_year: 2025
    });
    assert.strictEqual(res.isValid, false);
    assert.ok(res.errors.some(e => e.includes('Full name')));
  });

  runTest('Rejects invalid email format', () => {
    const res = validateRegistrationPayload({
      name: 'Aditi Sharma',
      email: 'not-an-email',
      college: 'VIT',
      grad_year: 2025
    });
    assert.strictEqual(res.isValid, false);
    assert.ok(res.errors.some(e => e.includes('valid email')));
  });

  runTest('Rejects out-of-range graduation year', () => {
    const res = validateRegistrationPayload({
      name: 'Aditi Sharma',
      email: 'aditi@college.edu',
      college: 'VIT',
      grad_year: 2018
    });
    assert.strictEqual(res.isValid, false);
    assert.ok(res.errors.some(e => e.includes('Graduation year')));
  });

  runTest('Accepts valid payload and normalizes email', () => {
    const res = validateRegistrationPayload({
      name: '  Aditi Sharma  ',
      email: '  Aditi.Sharma@College.EDU  ',
      college: 'CBIT Hyderabad',
      grad_year: 2025,
      whatsapp: '9876543210'
    });
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.normalizedEmail, 'aditi.sharma@college.edu');
  });

  // --- SUITE 2: Registration & Duplicate Prevention ---
  console.log('\n--- Test Suite 2: Registration & Duplicate Prevention ---');

  let studentARefCode = null;
  runTest('Registers a new student successfully and generates unique referral code', () => {
    const res = registerStudent({
      name: 'Rahul Varma',
      email: 'rahul.varma@cbit.ac.in',
      college: 'CBIT Hyderabad',
      grad_year: 2025,
      whatsapp: '9876543211',
      acquisition_channel: 'whatsapp_group'
    });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.status, 201);
    assert.ok(res.data.referral_code.startsWith('NXT-'));
    studentARefCode = res.data.referral_code;
  });

  runTest('Rejects duplicate email (exact match)', () => {
    const res = registerStudent({
      name: 'Rahul Varma Duplicate',
      email: 'rahul.varma@cbit.ac.in',
      college: 'CBIT Hyderabad',
      grad_year: 2025
    });
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.existingReferralCode, studentARefCode);
  });

  runTest('Rejects duplicate email with mixed case and leading/trailing whitespace', () => {
    const res = registerStudent({
      name: 'Rahul Varma Mixed Case',
      email: '  RAHUL.VARMA@cbit.ac.in  ',
      college: 'CBIT Hyderabad',
      grad_year: 2025
    });
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.status, 409);
  });

  // --- SUITE 3: Referral Attribution & Integrity ---
  console.log('\n--- Test Suite 3: Referral Attribution & Anti-Fraud ---');

  let studentBRefCode = null;
  runTest('Attributes referral when a peer registers using a referral code', () => {
    const res = registerStudent({
      name: 'Sneha Rao',
      email: 'sneha.rao@cbit.ac.in',
      college: 'CBIT Hyderabad',
      grad_year: 2025,
      referred_by_code: studentARefCode,
      acquisition_channel: 'student_ambassador'
    });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.referred_by_code, studentARefCode);
    studentBRefCode = res.data.referral_code;

    // Check Rahul's stats
    const rahulStats = getReferralStats(studentARefCode);
    assert.strictEqual(rahulStats.totalReferrals, 1);
    assert.strictEqual(rahulStats.referredUsers[0].name, 'Sneha R.');
  });

  runTest('Prevents self-referral inflation', () => {
    const res = registerStudent({
      name: 'Sneha Rao Alternative',
      email: 'sneha.alternate@cbit.ac.in',
      college: 'CBIT Hyderabad',
      grad_year: 2025,
      referred_by_code: 'NON_EXISTENT_CODE'
    });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.referred_by_code, null);
  });

  // --- SUITE 4: Synthetic vs Real Separation ---
  console.log('\n--- Test Suite 4: Real vs Synthetic Metric Separation ---');

  runTest('Seeds synthetic data and correctly isolates real vs synthetic records', () => {
    const seedResult = seedSyntheticData();
    assert.strictEqual(seedResult.seeded, 342);

    const allMetrics = getCampaignMetrics('all');
    assert.strictEqual(allMetrics.overview.realCount, 3); // Rahul, Sneha, Sneha Alternative
    assert.strictEqual(allMetrics.overview.syntheticCount, 342);
    assert.strictEqual(allMetrics.overview.totalRegistrations, 345);

    const realOnlyMetrics = getCampaignMetrics('real');
    assert.strictEqual(realOnlyMetrics.overview.totalRegistrations, 3);

    const synthOnlyMetrics = getCampaignMetrics('synthetic');
    assert.strictEqual(synthOnlyMetrics.overview.totalRegistrations, 342);
  });

  // --- SUITE 5: Campaign Calculations & Budget Constraints ---
  console.log('\n--- Test Suite 5: Campaign Budget & Target Calculations ---');

  runTest('Campaign targets total exactly 500 registrations', () => {
    const settings = getSettings();
    const target = parseInt(settings.target_registrations, 10);
    assert.strictEqual(target, 500);

    const channels = settings.channel_targets;
    const sumChannels = Object.values(channels).reduce((a, b) => a + Number(b), 0);
    assert.strictEqual(sumChannels, 500, 'Sum of channel targets must equal 500');
  });

  runTest('Total budget allocation equals exactly ₹2,000', () => {
    const settings = getSettings();
    const totalBudget = parseFloat(settings.total_budget);
    assert.strictEqual(totalBudget, 2000);

    const breakdown = settings.budget_breakdown;
    const sumBreakdown = Object.values(breakdown).reduce((a, b) => a + Number(b), 0);
    assert.strictEqual(sumBreakdown, 2000, 'Budget breakdown items must sum to exactly ₹2,000');
  });

  runTest('Remaining registrations to target calculated accurately', () => {
    const metrics = getCampaignMetrics('all');
    const expectedRemaining = Math.max(0, 500 - metrics.overview.totalRegistrations);
    assert.strictEqual(metrics.overview.remainingToTarget, expectedRemaining);
  });

  // --- SUITE 6: AI Fallback Engine ---
  console.log('\n--- Test Suite 6: AI Growth Assistant Fallback Engine ---');

  await runAsyncTest('AI Assistant responds reliably in deterministic fallback mode', async () => {
    const res = await generateAiContent({
      taskType: 'whatsapp_hook',
      context: { totalRegistrations: 345, targetRegistrations: 500 }
    });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.isAiPowered, false);
    assert.ok(res.data.content.includes('Build Your First AI Project in 60 Minutes'));
    assert.ok(res.data.content.includes('Free'));
  });

  // --- SUITE 7: Security Fix: Organizer Authentication & Authorization ---
  console.log('\n--- Test Suite 7: Organizer Authentication & Authorization ---');

  runTest('requireOrganizerAuth rejects request with missing credentials (401)', () => {
    const mock = createMockReqRes({ headers: {} });
    requireOrganizerAuth(mock.req, mock.res, mock.next);
    assert.strictEqual(mock.getStatus(), 401);
    assert.strictEqual(mock.getData().success, false);
    assert.ok(mock.getData().error.includes('Unauthorized'));
    assert.strictEqual(mock.isNextCalled(), false);
  });

  runTest('requireOrganizerAuth rejects request with invalid key (403)', () => {
    const mock = createMockReqRes({ headers: { 'x-organizer-key': 'attacker-fake-key-123' } });
    requireOrganizerAuth(mock.req, mock.res, mock.next);
    assert.strictEqual(mock.getStatus(), 403);
    assert.strictEqual(mock.getData().success, false);
    assert.ok(mock.getData().error.includes('Forbidden'));
    assert.strictEqual(mock.isNextCalled(), false);
  });

  runTest('requireOrganizerAuth allows request with valid x-organizer-key', () => {
    const expectedKey = getExpectedKey();
    const mock = createMockReqRes({ headers: { 'x-organizer-key': expectedKey } });
    requireOrganizerAuth(mock.req, mock.res, mock.next);
    assert.strictEqual(mock.isNextCalled(), true);
  });

  runTest('requireOrganizerAuth allows request with valid Authorization Bearer header', () => {
    const expectedKey = getExpectedKey();
    const mock = createMockReqRes({ headers: { authorization: `Bearer ${expectedKey}` } });
    requireOrganizerAuth(mock.req, mock.res, mock.next);
    assert.strictEqual(mock.isNextCalled(), true);
  });

  runTest('safeEqual uses constant-time comparison and correctly validates strings', () => {
    assert.strictEqual(safeEqual('secret-key-123', 'secret-key-123'), true);
    assert.strictEqual(safeEqual('secret-key-123', 'wrong-key-456'), false);
    assert.strictEqual(safeEqual('short', 'longer-string'), false);
    assert.strictEqual(safeEqual(null, 'test'), false);
  });

  // --- SUITE 8: Security Fix: Public Registration is_synthetic Protection ---
  console.log('\n--- Test Suite 8: Public Registration Synthetic Field Protection ---');

  runTest('Public registration cannot set is_synthetic = 1 (default / allowSynthetic: false)', () => {
    const maliciousPayload = {
      name: 'Tamper Attempt User',
      email: 'tamper.user@cbit.ac.in',
      college: 'CBIT Hyderabad',
      grad_year: 2025,
      whatsapp: '9876543299',
      is_synthetic: 1 // Malicious payload attempting to set synthetic flag
    };

    const res = registerStudent(maliciousPayload, { allowSynthetic: false });
    assert.strictEqual(res.success, true);

    const savedRecord = db.prepare('SELECT is_synthetic FROM registrations WHERE email = ?').get('tamper.user@cbit.ac.in');
    assert.strictEqual(savedRecord.is_synthetic, 0, 'Public registration MUST NOT have is_synthetic = 1');
  });

  runTest('Public registration cannot set is_synthetic = true via boolean', () => {
    const maliciousPayload = {
      name: 'Tamper Boolean User',
      email: 'tamper.boolean@cbit.ac.in',
      college: 'CBIT Hyderabad',
      grad_year: 2025,
      whatsapp: '9876543298',
      is_synthetic: true
    };

    const res = registerStudent(maliciousPayload); // Default options has allowSynthetic: false
    assert.strictEqual(res.success, true);

    const savedRecord = db.prepare('SELECT is_synthetic FROM registrations WHERE email = ?').get('tamper.boolean@cbit.ac.in');
    assert.strictEqual(savedRecord.is_synthetic, 0, 'Public registration with boolean true MUST NOT have is_synthetic = 1');
  });

  runTest('Internal registration explicitly sets is_synthetic when allowSynthetic: true is provided', () => {
    const internalPayload = {
      name: 'Internal Demo User',
      email: 'internal.demo@cbit.ac.in',
      college: 'CBIT Hyderabad',
      grad_year: 2025,
      is_synthetic: 1
    };

    const res = registerStudent(internalPayload, { allowSynthetic: true });
    assert.strictEqual(res.success, true);

    const savedRecord = db.prepare('SELECT is_synthetic FROM registrations WHERE email = ?').get('internal.demo@cbit.ac.in');
    assert.strictEqual(savedRecord.is_synthetic, 1, 'Internal registration with explicit allowSynthetic flag should preserve synthetic flag');
  });

  // --- SUITE 9: Security Fix: Campaign Settings Validation ---
  console.log('\n--- Test Suite 9: Campaign Settings Validation & Sanitization ---');

  runTest('Rejects non-object campaign settings payload', () => {
    const res = validateCampaignSettings('not-an-object');
    assert.strictEqual(res.isValid, false);
    assert.ok(res.errors.some(e => e.includes('must be a JSON object')));
  });

  runTest('Rejects unauthorized or unexpected settings keys', () => {
    const res = validateCampaignSettings({
      admin_backdoor: 'injected_value',
      arbitrary_setting: 123
    });
    assert.strictEqual(res.isValid, false);
    assert.ok(res.errors.some(e => e.includes('Disallowed or unrecognized')));
  });

  runTest('Rejects negative or invalid budget values', () => {
    const res = validateCampaignSettings({
      total_budget: -500,
      target_registrations: -100
    });
    assert.strictEqual(res.isValid, false);
    assert.ok(res.errors.some(e => e.includes('total_budget')));
    assert.ok(res.errors.some(e => e.includes('target_registrations')));
  });

  runTest('Accepts valid campaign settings and updateSettings saves cleanly', () => {
    const validUpdate = {
      channel_targets: {
        whatsapp_group: 220,
        student_ambassador: 140,
        technical_club: 90,
        email: 50
      },
      budget_breakdown: {
        creative_assets: 450,
        targeted_promotion: 850,
        ambassador_activation: 400,
        contingency: 300
      }
    };

    const validation = validateCampaignSettings(validUpdate);
    assert.strictEqual(validation.isValid, true);

    updateSettings(validUpdate);
    const settings = getSettings();
    assert.strictEqual(settings.channel_targets.whatsapp_group, 220);
    assert.strictEqual(settings.budget_breakdown.targeted_promotion, 850);
  });

  // --- SUITE 10: Security Fix: Rate Limiting ---
  console.log('\n--- Test Suite 10: Rate Limiting & Abuse Prevention ---');

  runTest('createRateLimiter enforces threshold and blocks requests exceeding limit with 429', () => {
    const limiter = createRateLimiter({
      windowMs: 5000,
      max: 3,
      message: 'Rate limit test exceeded'
    });

    let lastStatus = 200;
    for (let i = 0; i < 4; i++) {
      const mock = createMockReqRes({ socket: { remoteAddress: '192.168.1.100' } });
      limiter(mock.req, mock.res, () => {
        mock.res.status(200);
      });
      lastStatus = mock.getStatus();
      if (i === 3) {
        assert.strictEqual(mock.getStatus(), 429);
        assert.strictEqual(mock.getData().success, false);
        assert.ok(mock.getData().message.includes('Rate limit test exceeded'));
        assert.ok(mock.getHeaders()['Retry-After'] !== undefined);
      }
    }
  });

  runTest('getClientIp extracts first IP from comma-separated X-Forwarded-For header', () => {
    const req = {
      headers: {
        'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178'
      }
    };
    const ip = getClientIp(req);
    assert.strictEqual(ip, '203.0.113.195');
  });

  // --- SUITE 11: Security Fix: Unsupported Claims & Ethical Marketing Guardrails ---
  console.log('\n--- Test Suite 11: Unsupported Claims & Ethical Marketing Guardrails ---');

  runTest('All message templates have jobGuaranteeClaim: false and valid compliance disclosures', () => {
    const templates = getAllTemplates();
    assert.ok(templates.length >= 5);
    for (const t of templates) {
      assert.strictEqual(t.jobGuaranteeClaim, false, `Template ${t.id} must explicitly flag jobGuaranteeClaim as false`);
      assert.ok(t.complianceDisclosure && t.complianceDisclosure.length > 5, `Template ${t.id} must include compliance disclosure`);
    }
  });

  runTest('AI Assistant does not claim unverified shortlist rate boosts in tech club email pitch', () => {
    const templates = getAllTemplates();
    const techClubTpl = templates.find(t => t.id === 'tech_club_outreach');
    assert.ok(techClubTpl);
    assert.ok(!techClubTpl.content.includes('significantly boosts shortlist rates'), 'Must not make unverified shortlist claims');
  });

  await runAsyncTest('AI Content generator provides compliance disclosures on generated advice', async () => {
    const res = await generateAiContent({
      taskType: 'campaign_experiments',
      context: { totalRegistrations: 345, targetRegistrations: 500, remainingToTarget: 155, remainingBudget: 750 }
    });
    assert.strictEqual(res.success, true);
    assert.ok(res.data.metadata.complianceDisclosure, 'AI metadata must include complianceDisclosure');
    assert.ok(res.data.content.includes('tactical planning estimates'), 'Experiments content must state projections are planning estimates');
  });

  // --- SUITE 12: End-to-End Express HTTP Route Integration Tests ---
  console.log('\n--- Test Suite 12: Express HTTP Route Security & Access Control ---');

  const { app } = require('../server');
  const validKey = getExpectedKey();

  function testHttpCall(method, url, headers = {}, bodyObj = null) {
    return new Promise((resolve) => {
      let statusCode = 200;
      let responseHeaders = {};

      const req = {
        method: method.toUpperCase(),
        url,
        headers: {
          'content-type': 'application/json',
          ...headers
        },
        body: bodyObj || {},
        _body: true,
        socket: { remoteAddress: '127.0.0.1' },
        get(header) {
          return this.headers[header.toLowerCase()];
        }
      };

      const res = {
        statusCode: 200,
        headers: {},
        status(code) {
          statusCode = code;
          this.statusCode = code;
          return this;
        },
        setHeader(name, val) {
          responseHeaders[name.toLowerCase()] = val;
        },
        getHeader(name) {
          return responseHeaders[name.toLowerCase()];
        },
        json(data) {
          resolve({ status: statusCode, data, headers: responseHeaders });
        },
        send(data) {
          let parsed = data;
          if (typeof data === 'string') {
            try { parsed = JSON.parse(data); } catch (e) { }
          }
          resolve({ status: statusCode, data: parsed, headers: responseHeaders });
        },
        end() {
          resolve({ status: statusCode, data: null, headers: responseHeaders });
        }
      };

      app.handle(req, res);
    });
  }

  await runAsyncTest('HTTP: GET /api/health returns healthy status', async () => {
    const res = await testHttpCall('GET', '/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'healthy');
  });

  await runAsyncTest('HTTP: GET /api/campaign/registrations blocks unauthenticated client (401)', async () => {
    const res = await testHttpCall('GET', '/api/campaign/registrations');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.success, false);
    assert.ok(res.data.error.includes('Unauthorized'));
  });

  await runAsyncTest('HTTP: GET /api/campaign/registrations rejects wrong key (403)', async () => {
    const res = await testHttpCall('GET', '/api/campaign/registrations', {
      'x-organizer-key': 'attacker-invalid-key'
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.data.success, false);
    assert.ok(res.data.error.includes('Forbidden'));
  });

  await runAsyncTest('HTTP: GET /api/campaign/registrations grants access with valid x-organizer-key', async () => {
    const res = await testHttpCall('GET', '/api/campaign/registrations', {
      'x-organizer-key': validKey
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data));
    assert.ok(res.data.pagination);
  });

  await runAsyncTest('HTTP: POST /api/register ignores is_synthetic manipulation in request body', async () => {
    const uniqueEmail = `http.tamper.${Date.now()}@cbit.ac.in`;
    const res = await testHttpCall('POST', '/api/register', {}, {
      name: 'HTTP Tamper User',
      email: uniqueEmail,
      college: 'CBIT Hyderabad',
      grad_year: 2025,
      whatsapp: '9876543210',
      is_synthetic: 1
    });
    assert.strictEqual(res.status, 201);
    const row = db.prepare('SELECT is_synthetic FROM registrations WHERE email = ?').get(uniqueEmail);
    assert.strictEqual(row.is_synthetic, 0, 'Database is_synthetic must remain 0 despite client input');
  });

  await runAsyncTest('HTTP: POST /api/campaign/seed rejects unauthenticated client (401)', async () => {
    const res = await testHttpCall('POST', '/api/campaign/seed');
    assert.strictEqual(res.status, 401);
  });

  await runAsyncTest('HTTP: POST /api/campaign/reset rejects unauthenticated client (401)', async () => {
    const res = await testHttpCall('POST', '/api/campaign/reset');
    assert.strictEqual(res.status, 401);
  });

  await runAsyncTest('HTTP: PUT /api/campaign/settings rejects unauthenticated client (401)', async () => {
    const res = await testHttpCall('PUT', '/api/campaign/settings', {}, { target_registrations: 600 });
    assert.strictEqual(res.status, 401);
  });

  await runAsyncTest('HTTP: PUT /api/campaign/settings rejects invalid settings with 400 Bad Request', async () => {
    const res = await testHttpCall('PUT', '/api/campaign/settings', {
      'x-organizer-key': validKey
    }, {
      total_budget: -100, // Invalid negative
      unauthorized_key: 'malicious'
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
    assert.ok(res.data.errors.length >= 2);
  });

  await runAsyncTest('HTTP: PUT /api/campaign/settings updates valid settings with valid key', async () => {
    const res = await testHttpCall('PUT', '/api/campaign/settings', {
      'x-organizer-key': validKey
    }, {
      channel_targets: {
        whatsapp_group: 200,
        student_ambassador: 150,
        technical_club: 100,
        email: 50
      }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
  });

  console.log('\n======================================================');
  console.log(`SUMMARY: ${passedTests} passed, ${failedTests} failed`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

startSuite();
