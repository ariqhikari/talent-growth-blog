'use strict';

const AppError = require('../errors/AppError');
const env = require('../config/env');
const { error: errorResponse } = require('../utils/apiResponse');

/**
 * Global error handler middleware.
 * Catches all errors forwarded via next(error) and maps them to consistent JSON responses.
 *
 * - Operational errors (AppError subclasses): return their own statusCode and message.
 * - Mongoose validation errors: 400 with field-level detail.
 * - Mongoose CastError (invalid ObjectId): 400 with clear message.
 * - Unexpected errors: 500. Stack trace only logged in development.
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Operational domain errors
  if (err.isOperational) {
    return errorResponse(res, err.message, err.statusCode, err.errors || []);
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return errorResponse(res, 'Validation failed', 422, errors);
  }

  // Invalid MongoDB ObjectId
  if (err.name === 'CastError') {
    return errorResponse(res, `Invalid ${err.path}: ${err.value}`, 400);
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, `${field} already exists`, 409);
  }

  // Unexpected errors — log full stack in development
  if (!env.isProduction) {
    console.error('[Unhandled Error]', err);
  }

  return errorResponse(res, 'Something went wrong. Please try again later.', 500);
};

module.exports = { errorHandler };

