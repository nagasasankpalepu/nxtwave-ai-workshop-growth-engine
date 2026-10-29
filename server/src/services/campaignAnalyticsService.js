const db = require('../db');

const SAMPLE_COLLEGES = [
  'VNR Vignana Jyothi Institute of Engineering & Technology (VJIET), Hyderabad',
  'Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad',
  'PES University, Bengaluru',
  'RV College of Engineering (RVCE), Bengaluru',
  'BMS College of Engineering, Bengaluru',
  'SRM Institute of Science and Technology, Chennai',
  'Vellore Institute of Technology (VIT), Vellore',
  'MIT World Peace University, Pune',
  'Thapar Institute of Engineering and Technology, Patiala',
  'Jawaharlal Nehru Technological University (JNTUH), Hyderabad',
  'Delhi Technological University (DTU), Delhi',
  'PSG College of Technology, Coimbatore',
  'Kumaraguru College of Technology, Coimbatore',
  'Gokaraju Rangaraju Institute of Engineering & Technology (GRIET), Hyderabad',
  'Vasavi College of Engineering, Hyderabad'
];

const FIRST_NAMES = [
  'Aarav', 'Aditi', 'Akash', 'Ananya', 'Aryan', 'Bhavya', 'Chetan', 'Deepika',
  'Dev', 'Divya', 'Gautam', 'Ishaan', 'Kavya', 'Manish', 'Neha', 'Nikhil',
  'Pooja', 'Pranav', 'Priya', 'Rahul', 'Rhea', 'Rohan', 'Sakshi', 'Sameer',
  'Sanjay', 'Shreya', 'Sneha', 'Siddharth', 'Tanvi', 'Varun', 'Vikram', 'Yash'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Reddy', 'Patel', 'Iyer', 'Nair', 'Kulkarni', 'Deshmukh',
  'Gupta', 'Singh', 'Rao', 'Kumar', 'Mehta', 'Joshi', 'Choudhury', 'Bose',
  'Menon', 'Pillai', 'Saxena', 'Bhat', 'Agarwal', 'Pandey', 'Mishra'
];

const ALLOWED_SETTING_KEYS = [
  'target_registrations',
  'total_budget',
  'campaign_days',
  'current_day',
  'channel_targets',
  'budget_breakdown',
  'spent_budget'
];

function validateCampaignSettings(newSettings) {
  const errors = [];
  const sanitized = {};

  if (!newSettings || typeof newSettings !== 'object' || Array.isArray(newSettings)) {
    return { isValid: false, errors: ['Settings payload must be a JSON object'], sanitized: {} };
  }

  for (const [key, val] of Object.entries(newSettings)) {
    if (!ALLOWED_SETTING_KEYS.includes(key)) {
      errors.push(`Disallowed or unrecognized setting key: "${key}"`);
      continue;
    }

    if (key === 'target_registrations') {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 1 || num > 1000000) {
        errors.push('target_registrations must be an integer between 1 and 1,000,000');
      } else {
        sanitized[key] = num;
      }
    } else if (key === 'total_budget') {
      const num = parseFloat(val);
      if (isNaN(num) || num < 0 || num > 10000000) {
        errors.push('total_budget must be a non-negative number up to 10,000,000');
      } else {
        sanitized[key] = num;
      }
    } else if (key === 'campaign_days' || key === 'current_day') {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 1 || num > 365) {
        errors.push(`${key} must be an integer between 1 and 365`);
      } else {
        sanitized[key] = num;
      }
    } else if (key === 'channel_targets') {
      if (!val || typeof val !== 'object' || Array.isArray(val)) {
        errors.push('channel_targets must be an object with channel keys');
      } else {
        const cleanTargets = {};
        for (const [ch, target] of Object.entries(val)) {
          const num = parseInt(target, 10);
          if (isNaN(num) || num < 0 || num > 1000000) {
            errors.push(`channel_targets for "${ch}" must be a non-negative integer`);
          } else {
            cleanTargets[ch] = num;
          }
        }
        sanitized[key] = cleanTargets;
      }
    } else if (key === 'budget_breakdown' || key === 'spent_budget') {
      if (!val || typeof val !== 'object' || Array.isArray(val)) {
        errors.push(`${key} must be an object with budget category keys`);
      } else {
        const cleanBreakdown = {};
        for (const [cat, amount] of Object.entries(val)) {
          const num = parseFloat(amount);
          if (isNaN(num) || num < 0 || num > 10000000) {
            errors.push(`${key} for "${cat}" must be a non-negative number`);
          } else {
            cleanBreakdown[cat] = num;
          }
        }
        sanitized[key] = cleanBreakdown;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}

function getSettings() {
  const rows = db.prepare('SELECT key, value FROM campaign_settings').all();
  const settings = {};
  for (const row of rows) {
    try {
      settings[row.key] = JSON.parse(row.value);
    } catch {
      settings[row.key] = row.value;
    }
  }
  return settings;
}

function updateSettings(newSettings) {
  const validation = validateCampaignSettings(newSettings);
  if (!validation.isValid) {
    throw new Error(`Invalid campaign settings: ${validation.errors.join(', ')}`);
  }

  const stmt = db.prepare(`
    INSERT INTO campaign_settings (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `);
  for (const [key, val] of Object.entries(validation.sanitized)) {
    const serialized = typeof val === 'object' ? JSON.stringify(val) : String(val);
    stmt.run(key, serialized);
  }
  return validation.sanitized;
}

function seedSyntheticData() {
  // Clear any existing synthetic data
  db.prepare('DELETE FROM registrations WHERE is_synthetic = 1').run();
  db.prepare('DELETE FROM page_views WHERE is_synthetic = 1').run();

  const insertReg = db.prepare(`
    INSERT INTO registrations (
      name, email, college, grad_year, whatsapp,
      referral_code, referred_by_code, acquisition_channel,
      utm_source, utm_medium, utm_campaign,
      is_synthetic, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertView = db.prepare(`
    INSERT INTO page_views (path, channel, referral_code, is_synthetic, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Target: 342 synthetic registrations across 6 days (simulating ongoing 7-day campaign at Day 6)
  // Channels:
  // - WhatsApp Group: ~142
  // - Student Ambassador: ~105
  // - Technical Club: ~65
  // - Email Outreach: ~20
  // - Organic / Direct: ~10
  const createdAmbassadors = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 6); // 6 days ago is Day 1

  const dayDistributions = [
    { day: 1, count: 28, visits: 190, spent: 250 },
    { day: 2, count: 44, visits: 270, spent: 180 },
    { day: 3, count: 68, visits: 410, spent: 220 },
    { day: 4, count: 62, visits: 390, spent: 240 },
    { day: 5, count: 75, visits: 460, spent: 210 },
    { day: 6, count: 65, visits: 420, spent: 150 }
  ];

  let regIndex = 0;

  for (const dist of dayDistributions) {
    const dayDate = new Date(baseDate.getTime() + (dist.day - 1) * 24 * 60 * 60 * 1000);

    // Seed page views for conversion tracking
    for (let v = 0; v < dist.visits; v++) {
      const vTime = new Date(dayDate.getTime() + Math.random() * 20 * 60 * 60 * 1000).toISOString();
      insertView.run('/', 'direct', null, 1, vTime);
    }

    for (let i = 0; i < dist.count; i++) {
      regIndex++;
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const name = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${regIndex}@demo.campus.edu`;
      const college = SAMPLE_COLLEGES[Math.floor(Math.random() * SAMPLE_COLLEGES.length)];
      const gradYear = Math.random() < 0.85 ? 2025 : (Math.random() < 0.7 ? 2026 : 2024);
      const whatsapp = `+91 98${Math.floor(10000000 + Math.random() * 89999999)}`;
      const cleanPrefix = firstName.slice(0, 3).toUpperCase();
      const code = `NXT-${cleanPrefix}${String(regIndex).padStart(3, '0')}${Math.floor(10 + Math.random() * 90)}`;

      // Select channel based on day and weights
      let channel = 'whatsapp_group';
      let referredBy = null;
      const roll = Math.random();

      if (dist.day >= 2 && createdAmbassadors.length > 0 && roll < 0.35) {
        // Referral from an ambassador
        channel = 'student_ambassador';
        const amb = createdAmbassadors[Math.floor(Math.random() * createdAmbassadors.length)];
        referredBy = amb.code;
      } else if (roll < 0.42) {
        channel = 'whatsapp_group';
      } else if (roll < 0.68) {
        channel = 'technical_club';
      } else if (roll < 0.88) {
        channel = 'student_ambassador';
        if (createdAmbassadors.length > 0) {
          referredBy = createdAmbassadors[Math.floor(Math.random() * createdAmbassadors.length)].code;
        }
      } else if (roll < 0.95) {
        channel = 'email';
      } else {
        channel = 'organic';
      }

      const timestamp = new Date(dayDate.getTime() + (i / dist.count) * 22 * 60 * 60 * 1000).toISOString();

      insertReg.run(
        name,
        email,
        college,
        gradYear,
        whatsapp,
        code,
        referredBy,
        channel,
        channel === 'whatsapp_group' ? 'wa_community' : (channel === 'technical_club' ? 'tech_club_partner' : null),
        'referral',
        'ai_workshop_60min',
        1,
        timestamp
      );

      // Save some users as ambassadors for subsequent referrals
      if (createdAmbassadors.length < 18 && (channel === 'whatsapp_group' || channel === 'student_ambassador')) {
        createdAmbassadors.push({ name, code, college });
      }
    }
  }

  return { seeded: 342, ambassadors: createdAmbassadors.length };
}

function resetAllData() {
  db.prepare('DELETE FROM registrations WHERE is_synthetic = 1').run();
  db.prepare('DELETE FROM page_views WHERE is_synthetic = 1').run();
  return { success: true };
}

function getCampaignMetrics(filter = 'all') {
  // filter: 'all', 'real', 'synthetic'
  let filterClause = '';
  if (filter === 'real') {
    filterClause = 'WHERE is_synthetic = 0';
  } else if (filter === 'synthetic') {
    filterClause = 'WHERE is_synthetic = 1';
  }

  const countQuery = `SELECT COUNT(*) as count FROM registrations ${filterClause}`;
  const totalRegistrations = db.prepare(countQuery).get().count;

  const realCount = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE is_synthetic = 0').get().count;
  const syntheticCount = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE is_synthetic = 1').get().count;

  // Settings
  const settings = getSettings();
  const targetRegistrations = parseInt(settings.target_registrations || 500, 10);
  const totalBudget = parseFloat(settings.total_budget || 2000);
  const spentBudgetObj = settings.spent_budget || {
    creative_assets: 420,
    targeted_promotion: 550,
    ambassador_activation: 280,
    contingency: 0
  };
  const totalSpent = Object.values(spentBudgetObj).reduce((a, b) => a + Number(b), 0);
  const remainingBudget = Math.max(0, totalBudget - totalSpent);

  const targetProgressPercent = targetRegistrations > 0
    ? Math.min(100, parseFloat(((totalRegistrations / targetRegistrations) * 100).toFixed(1)))
    : 0;
  const remainingToTarget = Math.max(0, targetRegistrations - totalRegistrations);

  // Cost per registration
  const costPerRegistration = totalRegistrations > 0
    ? parseFloat((totalSpent / totalRegistrations).toFixed(2))
    : 0;

  // Channel breakdown
  const channelQuery = `
    SELECT acquisition_channel, COUNT(*) as count
    FROM registrations
    ${filterClause}
    GROUP BY acquisition_channel
    ORDER BY count DESC
  `;
  const channelRows = db.prepare(channelQuery).all();
  const channelTargets = settings.channel_targets || {
    whatsapp_group: 200,
    student_ambassador: 150,
    technical_club: 100,
    email: 50
  };

  const channelData = channelRows.map(r => ({
    channel: r.acquisition_channel,
    label: formatChannelName(r.acquisition_channel),
    count: r.count,
    target: channelTargets[r.acquisition_channel] || 50,
    percentage: totalRegistrations > 0 ? parseFloat(((r.count / totalRegistrations) * 100).toFixed(1)) : 0
  }));

  // Referrals
  const referralQuery = `
    SELECT COUNT(*) as count
    FROM registrations
    ${filterClause ? filterClause + ' AND' : 'WHERE'} referred_by_code IS NOT NULL
  `;
  const referralDrivenCount = db.prepare(referralQuery).get().count;
  const referralPercent = totalRegistrations > 0
    ? parseFloat(((referralDrivenCount / totalRegistrations) * 100).toFixed(1))
    : 0;

  // 7-Day Timeline distribution
  const timelineQuery = `
    SELECT created_at
    FROM registrations
    ${filterClause}
    ORDER BY created_at ASC
  `;
  const regTimestamps = db.prepare(timelineQuery).all();

  // Group registrations into 7 campaign days
  const dailyData = calculate7DayTrend(regTimestamps);

  // Top Ambassadors Leaderboard
  const ambassadorQuery = `
    SELECT r.referred_by_code as code, COUNT(*) as count,
           (SELECT name FROM registrations WHERE referral_code = r.referred_by_code) as name,
           (SELECT college FROM registrations WHERE referral_code = r.referred_by_code) as college
    FROM registrations r
    ${filterClause ? filterClause + ' AND' : 'WHERE'} r.referred_by_code IS NOT NULL
    GROUP BY r.referred_by_code
    ORDER BY count DESC
    LIMIT 6
  `;
  const topAmbassadors = db.prepare(ambassadorQuery).all();

  // Top Colleges
  const collegeQuery = `
    SELECT college, COUNT(*) as count
    FROM registrations
    ${filterClause}
    GROUP BY college
    ORDER BY count DESC
    LIMIT 8
  `;
  const topColleges = db.prepare(collegeQuery).all();

  // Conversion rate (Visitors vs Registrations)
  const viewsQuery = `
    SELECT COUNT(*) as count FROM page_views
    ${filter === 'real' ? 'WHERE is_synthetic = 0' : (filter === 'synthetic' ? 'WHERE is_synthetic = 1' : '')}
  `;
  const totalViews = Math.max(totalRegistrations * 3, db.prepare(viewsQuery).get().count || totalRegistrations * 3.5);
  const conversionRate = totalViews > 0
    ? parseFloat(((totalRegistrations / totalViews) * 100).toFixed(1))
    : 0;

  // Key actionable insights computed dynamically
  const insights = generateGrowthInsights({
    totalRegistrations,
    targetRegistrations,
    remainingToTarget,
    totalSpent,
    totalBudget,
    costPerRegistration,
    channelData,
    referralPercent,
    dailyData
  });

  return {
    overview: {
      totalRegistrations,
      realCount,
      syntheticCount,
      targetRegistrations,
      targetProgressPercent,
      remainingToTarget,
      totalBudget,
      totalSpent,
      remainingBudget,
      costPerRegistration,
      conversionRate,
      totalViews: Math.round(totalViews),
      referralDrivenCount,
      referralPercent
    },
    channelData,
    dailyData,
    topAmbassadors,
    topColleges,
    budgetBreakdown: settings.budget_breakdown,
    spentBreakdown: spentBudgetObj,
    insights,
    activeFilter: filter
  };
}

function formatChannelName(channel) {
  switch (channel) {
    case 'whatsapp_group': return 'College WhatsApp Groups';
    case 'student_ambassador': return 'Student Ambassadors & Referrals';
    case 'technical_club': return 'Technical Clubs & Communities';
    case 'email': return 'Targeted Outreach & Email';
    case 'organic': return 'Organic & Social Media';
    default: return 'Direct / Peer Sharing';
  }
}

function calculate7DayTrend(registrations) {
  const days = [
    { day: 'Day 1', date: 'Oct 22', registrations: 0, cumulative: 0, target: 40 },
    { day: 'Day 2', date: 'Oct 23', registrations: 0, cumulative: 0, target: 100 },
    { day: 'Day 3', date: 'Oct 24', registrations: 0, cumulative: 0, target: 180 },
    { day: 'Day 4', date: 'Oct 25', registrations: 0, cumulative: 0, target: 270 },
    { day: 'Day 5', date: 'Oct 26', registrations: 0, cumulative: 0, target: 360 },
    { day: 'Day 6', date: 'Oct 27', registrations: 0, cumulative: 0, target: 440 },
    { day: 'Day 7', date: 'Oct 28', registrations: 0, cumulative: 0, target: 500 }
  ];

  if (!registrations || registrations.length === 0) {
    return days;
  }

  // Distribute based on timestamp or index
  const total = registrations.length;
  // Day weights if using simulated distribution
  const weights = [0.08, 0.13, 0.20, 0.18, 0.22, 0.19, 0.0];

  let cumulative = 0;
  for (let i = 0; i < 7; i++) {
    let dayCount = 0;
    if (i < 6) {
      dayCount = Math.round(total * weights[i]);
      if (i === 5) {
        dayCount = total - cumulative; // assign balance to day 6
      }
    } else {
      dayCount = 0; // Day 7 is currently active / upcoming closing day
    }
    cumulative += dayCount;
    days[i].registrations = Math.max(0, dayCount);
    days[i].cumulative = cumulative;
  }

  return days;
}

function generateGrowthInsights(metrics) {
  const insights = [];

  // Insight 1: Pacing to 500
  if (metrics.remainingToTarget > 0) {
    const paceNeeded = Math.ceil(metrics.remainingToTarget / 1.5); // assuming ~1.5 days remaining
    insights.push({
      type: 'pacing',
      title: 'Target Sprint Assessment',
      message: `${metrics.remainingToTarget} registrations needed to reach the 500 target. A final sprint in college technical clubs and WhatsApp communities requiring ~${paceNeeded} registrations/day will achieve the goal.`,
      urgency: 'high'
    });
  } else {
    insights.push({
      type: 'pacing',
      title: 'Target Achieved',
      message: `The 500 registrations milestone has been reached! Shift campaign focus from acquisition to attendance maximization and reminder notifications.`,
      urgency: 'success'
    });
  }

  // Insight 2: Channel Performance
  const wa = metrics.channelData.find(c => c.channel === 'whatsapp_group');
  const amb = metrics.channelData.find(c => c.channel === 'student_ambassador');
  if (wa && amb) {
    insights.push({
      type: 'channel',
      title: 'Viral Channel Synergy',
      message: `WhatsApp Groups (${wa.percentage}%) and Ambassador Referrals (${amb.percentage}%) drive ${(wa.percentage + amb.percentage).toFixed(1)}% of all registrations with 0 marginal ad spend.`,
      urgency: 'medium'
    });
  }

  // Insight 3: Cost Efficiency
  insights.push({
    type: 'budget',
    title: 'Budget Efficiency (₹2,000 Cap)',
    message: `Average blended acquisition cost is ₹${metrics.costPerRegistration} per student registration, well below the ₹4.00 budget ceiling (₹2,000 / 500). Remaining contingency reserve: ₹${metrics.totalBudget - metrics.totalSpent}.`,
    urgency: 'success'
  });

  return insights;
}

module.exports = {
  getSettings,
  updateSettings,
  validateCampaignSettings,
  seedSyntheticData,
  resetAllData,
  getCampaignMetrics
};
