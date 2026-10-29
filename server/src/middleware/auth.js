const crypto = require('crypto');

function getExpectedKey() {
  const key = process.env.ORGANIZER_KEY;
  return typeof key === 'string' ? key.trim() : '';
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Middleware to require organizer-level authorization
 * Checks:
 *   1. 'x-organizer-key' header
 *   2. 'Authorization: Bearer <key>' header
 */
function requireOrganizerAuth(req, res, next) {
  const expectedKey = getExpectedKey();

  if (!expectedKey) {
    return res.status(500).json({
      success: false,
      error: 'Server configuration error: ORGANIZER_KEY is not configured in server environment variables.'
    });
  }

  // Extract from headers
  const headerKey = req.headers['x-organizer-key'];
  let bearerKey = null;
  const authHeader = req.headers['authorization'];
  if (authHeader && typeof authHeader === 'string') {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && /^bearer$/i.test(parts[0])) {
      bearerKey = parts[1];
    }
  }

  const providedKey = headerKey || bearerKey;

  if (!providedKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Organizer access key is required to access this endpoint. Provide x-organizer-key or Authorization header.'
    });
  }

  if (!safeEqual(providedKey, expectedKey)) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid organizer access key.'
    });
  }

  next();
}

module.exports = {
  requireOrganizerAuth,
  getExpectedKey,
  safeEqual
};

