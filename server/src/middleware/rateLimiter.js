/**
 * Robust in-memory rate limiter middleware with IP resolution and header standards
 */

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded && typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.ip || '127.0.0.1';
}

function createRateLimiter({
  windowMs = 60 * 1000,
  max = 30,
  message = 'Too many requests. Please try again later.'
} = {}) {
  const rateLimitMap = new Map();

  // Periodic cleanup
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, data] of rateLimitMap.entries()) {
      if (now > data.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, Math.max(windowMs, 30000));

  // Allow Node to exit cleanly without keeping interval alive
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  const middleware = function (req, res, next) {
    const ip = getClientIp(req);
    const now = Date.now();
    const clientData = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > clientData.resetTime) {
      clientData.count = 1;
      clientData.resetTime = now + windowMs;
    } else {
      clientData.count++;
    }

    rateLimitMap.set(ip, clientData);

    const remaining = Math.max(0, max - clientData.count);
    const resetSeconds = Math.ceil((clientData.resetTime - now) / 1000);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(clientData.resetTime / 1000));

    if (clientData.count > max) {
      res.setHeader('Retry-After', resetSeconds);
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds: resetSeconds
      });
    }

    next();
  };

  middleware.reset = () => {
    rateLimitMap.clear();
  };

  middleware.getMap = () => rateLimitMap;

  return middleware;
}

const registrationLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many registration attempts. Please wait a minute and try again.'
});

const aiGenerationLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 15,
  message: 'AI generation request rate limit exceeded. Please wait a moment before trying again.'
});

const pageViewLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Page view tracking rate limit exceeded.'
});

const organizerActionLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Organizer action rate limit exceeded. Please wait a moment.'
});

module.exports = {
  createRateLimiter,
  getClientIp,
  registrationLimiter,
  aiGenerationLimiter,
  pageViewLimiter,
  organizerActionLimiter
};

