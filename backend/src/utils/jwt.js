'use strict';

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { UnauthorizedError } = require('../errors');

/**
 * Generates a signed JWT for the given user.
 * @param {string} userId - The user's MongoDB ObjectId as string
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Verifies and decodes a JWT, throwing UnauthorizedError on failure.
 * @param {string} token - Bearer token string
 * @returns {{ sub: string }} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Session expired, please log in again');
    }
    throw new UnauthorizedError('Invalid token');
  }
};

module.exports = { generateToken, verifyToken };
