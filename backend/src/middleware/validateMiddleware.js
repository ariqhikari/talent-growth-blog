'use strict';

const { BadRequestError } = require('../errors');

/**
 * Validates incoming request bodies against a rules schema.
 *
 * Rules schema format:
 * {
 *   fieldName: {
 *     required: boolean,
 *     type: 'string' | 'email',
 *     minLength: number,
 *     maxLength: number,
 *     enum: string[],
 *   }
 * }
 */
const validate = (rules) => (req, res, next) => {
  const errors = [];
  const body = req.body;

  for (const [field, constraints] of Object.entries(rules)) {
    const value = body[field];

    if (constraints.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }

    // Skip optional fields that are not provided
    if (value === undefined || value === null || value === '') continue;

    if (constraints.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} must be a string`);
      continue;
    }

    if (constraints.type === 'email') {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(value)) {
        errors.push(`${field} must be a valid email address`);
        continue;
      }
    }

    const str = String(value).trim();

    if (constraints.minLength && str.length < constraints.minLength) {
      errors.push(`${field} must be at least ${constraints.minLength} characters`);
    }

    if (constraints.maxLength && str.length > constraints.maxLength) {
      errors.push(`${field} must be at most ${constraints.maxLength} characters`);
    }

    if (constraints.enum && !constraints.enum.includes(str)) {
      errors.push(`${field} must be one of: ${constraints.enum.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    return next(new BadRequestError('Validation failed', errors));
  }

  next();
};

module.exports = { validate };

