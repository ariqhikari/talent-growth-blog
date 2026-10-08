'use strict';

const rateLimit = require('express-rate-limit');
const { HTTP_STATUS } = require('../constants/httpStatus');

/**
 * Rate limiter for authentication routes.
 * Prevents brute-force attacks on login and registration endpoints.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    message: 'Too many requests. Please try again in 15 minutes.',
  },
});

/**
 * General API rate limiter.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    message: 'Too many requests. Please slow down.',
  },
});

module.exports = { authLimiter, apiLimiter };

