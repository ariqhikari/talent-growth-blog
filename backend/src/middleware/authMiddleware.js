'use strict';

const { verifyToken } = require('../utils/jwt');
const userRepository = require('../repositories/userRepository');
const { UnauthorizedError } = require('../errors');

/**
 * Auth middleware — extracts and validates the Bearer JWT from the Authorization header.
 * Injects the authenticated user into req.user for downstream handlers.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await userRepository.findById(decoded.sub);
    if (!user) {
      throw new UnauthorizedError('User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticate };

