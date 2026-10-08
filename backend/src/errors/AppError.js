'use strict';

/**
 * Base application error class.
 * All domain-specific errors extend this to get consistent status codes and structure.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes known errors from unexpected crashes

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
