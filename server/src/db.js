const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'data', 'nxtwave_growth.sqlite');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize database schema
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      college TEXT NOT NULL,
      grad_year INTEGER NOT NULL,
      whatsapp TEXT,
      referral_code TEXT NOT NULL UNIQUE,
      referred_by_code TEXT,
      acquisition_channel TEXT NOT NULL DEFAULT 'direct',
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      is_synthetic INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_reg_email ON registrations(email);
    CREATE INDEX IF NOT EXISTS idx_reg_referral_code ON registrations(referral_code);
    CREATE INDEX IF NOT EXISTS idx_reg_referred_by ON registrations(referred_by_code);
    CREATE INDEX IF NOT EXISTS idx_reg_synthetic ON registrations(is_synthetic);
    CREATE INDEX IF NOT EXISTS idx_reg_channel ON registrations(acquisition_channel);

    CREATE TABLE IF NOT EXISTS campaign_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      channel TEXT DEFAULT 'direct',
      referral_code TEXT,
      is_synthetic INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  // Default campaign settings if not set
  const getSetting = db.prepare('SELECT value FROM campaign_settings WHERE key = ?');
  const insertSetting = db.prepare('INSERT OR IGNORE INTO campaign_settings (key, value) VALUES (?, ?)');

  const defaultSettings = {
    target_registrations: '500',
    total_budget: '2000',
    campaign_days: '7',
    current_day: '6',
    channel_targets: JSON.stringify({
      whatsapp_group: 200,
      student_ambassador: 150,
      technical_club: 100,
      email: 50
    }),
    budget_breakdown: JSON.stringify({
      creative_assets: 500,
      targeted_promotion: 800,
      ambassador_activation: 400,
      contingency: 300
    }),
    spent_budget: JSON.stringify({
      creative_assets: 420,
      targeted_promotion: 550,
      ambassador_activation: 280,
      contingency: 0
    })
  };

  for (const [key, val] of Object.entries(defaultSettings)) {
    insertSetting.run(key, val);
  }
}

initSchema();

module.exports = db;
