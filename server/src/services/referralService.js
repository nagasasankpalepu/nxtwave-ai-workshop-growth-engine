const crypto = require('crypto');
const db = require('../db');

function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

function generateReferralCode(name = 'STUDENT') {
  const cleanName = name.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'NXT';
  const randomSuffix = crypto.randomBytes(3).toString('hex').slice(0, 4).toUpperCase();
  const code = `NXT-${cleanName}${randomSuffix}`;

  // Check if unique, if collision regenerate
  const existing = db.prepare('SELECT id FROM registrations WHERE referral_code = ?').get(code);
  if (existing) {
    return generateReferralCode(name);
  }
  return code;
}

function validateRegistrationPayload(data) {
  const errors = [];

  // Name validation
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Full name must be at least 2 characters long');
  }

  // Email validation
  const email = normalizeEmail(data.email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('A valid email address is required');
  }

  // College validation
  if (!data.college || typeof data.college !== 'string' || data.college.trim().length < 2) {
    errors.push('College / University name is required');
  }

  // Graduation year validation (focused on final year & engineering batches 2024-2028)
  const gradYear = parseInt(data.grad_year, 10);
  if (isNaN(gradYear) || gradYear < 2024 || gradYear > 2028) {
    errors.push('Graduation year must be between 2024 and 2028');
  }

  // Optional WhatsApp validation
  if (data.whatsapp) {
    const cleanedPhone = data.whatsapp.replace(/[^0-9]/g, '');
    if (cleanedPhone.length < 10 || cleanedPhone.length > 13) {
      errors.push('WhatsApp number should be a valid 10-digit mobile number');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    normalizedEmail: email,
    gradYear
  };
}

function registerStudent(payload, options = {}) {
  const validation = validateRegistrationPayload(payload);
  if (!validation.isValid) {
    return { success: false, status: 400, errors: validation.errors };
  }

  const normalizedEmail = validation.normalizedEmail;

  // Check duplicate registration
  const duplicate = db.prepare('SELECT id, referral_code FROM registrations WHERE email = ?').get(normalizedEmail);
  if (duplicate) {
    return {
      success: false,
      status: 409,
      errors: ['This email is already registered for the workshop. Use your existing referral code!'],
      existingReferralCode: duplicate.referral_code
    };
  }

  // Handle Referral Attribution
  let validReferrerCode = null;
  const providedRefCode = payload.referred_by_code ? payload.referred_by_code.trim().toUpperCase() : null;

  if (providedRefCode) {
    const referrer = db.prepare('SELECT id, email, referral_code FROM registrations WHERE referral_code = ?').get(providedRefCode);
    if (referrer) {
      // Prevent self-referral
      if (referrer.email.toLowerCase() === normalizedEmail) {
        // Self-referral attempt
        validReferrerCode = null;
      } else {
        validReferrerCode = referrer.referral_code;
      }
    }
  }

  // Generate unique referral code for this new registrant
  const referralCode = generateReferralCode(payload.name);

  // Normalize acquisition channel
  const allowedChannels = ['whatsapp_group', 'student_ambassador', 'technical_club', 'email', 'organic', 'direct'];
  let channel = (payload.acquisition_channel || 'direct').toLowerCase();
  if (validReferrerCode && (!payload.acquisition_channel || payload.acquisition_channel === 'direct')) {
    channel = 'student_ambassador';
  }
  if (!allowedChannels.includes(channel)) {
    channel = 'direct';
  }

  const createdAt = (options.allowCustomTimestamp && payload.created_at) ? payload.created_at : new Date().toISOString();
  // SECURITY FIX: Public registrations cannot set or manipulate is_synthetic.
  // Synthetic status is strictly rejected unless explicitly enabled via options.allowSynthetic (e.g. testing/internal).
  const isSynthetic = (options.allowSynthetic === true && (payload.is_synthetic === 1 || payload.is_synthetic === true)) ? 1 : 0;

  const insertStmt = db.prepare(`
    INSERT INTO registrations (
      name, email, college, grad_year, whatsapp,
      referral_code, referred_by_code, acquisition_channel,
      utm_source, utm_medium, utm_campaign,
      is_synthetic, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insertStmt.run(
    payload.name.trim(),
    normalizedEmail,
    payload.college.trim(),
    validation.gradYear,
    payload.whatsapp ? payload.whatsapp.trim() : null,
    referralCode,
    validReferrerCode,
    channel,
    payload.utm_source || null,
    payload.utm_medium || null,
    payload.utm_campaign || null,
    isSynthetic,
    createdAt
  );

  return {
    success: true,
    status: 201,
    data: {
      id: result.lastInsertRowid,
      name: payload.name.trim(),
      email: normalizedEmail,
      college: payload.college.trim(),
      grad_year: validation.gradYear,
      referral_code: referralCode,
      referred_by_code: validReferrerCode,
      acquisition_channel: channel,
      created_at: createdAt
    }
  };
}

function getReferralStats(referralCode) {
  if (!referralCode) return null;
  const code = referralCode.trim().toUpperCase();

  const student = db.prepare(`
    SELECT id, name, email, college, grad_year, referral_code, acquisition_channel, is_synthetic, created_at
    FROM registrations
    WHERE referral_code = ?
  `).get(code);

  if (!student) return null;

  const referredUsers = db.prepare(`
    SELECT id, name, college, grad_year, acquisition_channel, is_synthetic, created_at
    FROM registrations
    WHERE referred_by_code = ?
    ORDER BY created_at DESC
  `).all(code);

  // Anonymize names partially for privacy (e.g., "Rahul S." or "Priya V.")
  const anonymizedReferred = referredUsers.map(u => {
    const parts = u.name.trim().split(' ');
    const display = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
    return {
      name: display,
      college: u.college,
      grad_year: u.grad_year,
      channel: u.acquisition_channel,
      created_at: u.created_at,
      is_synthetic: u.is_synthetic
    };
  });

  const totalReferrals = referredUsers.length;

  // Determine ambassador tier
  let tier = 'Advocate';
  let nextTier = 'Silver Ambassador';
  let remainingForNext = 3 - totalReferrals;
  if (totalReferrals >= 10) {
    tier = 'Platinum Growth Leader';
    nextTier = 'Top Ambassador (Unlocked)';
    remainingForNext = 0;
  } else if (totalReferrals >= 5) {
    tier = 'Gold Campus Champion';
    nextTier = 'Platinum Growth Leader';
    remainingForNext = 10 - totalReferrals;
  } else if (totalReferrals >= 3) {
    tier = 'Silver Ambassador';
    nextTier = 'Gold Campus Champion';
    remainingForNext = 5 - totalReferrals;
  }

  return {
    student: {
      name: student.name,
      college: student.college,
      referral_code: student.referral_code,
      created_at: student.created_at
    },
    totalReferrals,
    tier,
    nextTier,
    remainingForNext: Math.max(0, remainingForNext),
    referredUsers: anonymizedReferred
  };
}

module.exports = {
  normalizeEmail,
  generateReferralCode,
  validateRegistrationPayload,
  registerStudent,
  getReferralStats
};
