'use strict';

const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * Hashes a plain text password.
 * @param {string} plainText - Raw password string
 * @returns {Promise<string>} Bcrypt hash
 */
const hash = (plainText) => bcrypt.hash(plainText, SALT_ROUNDS);

/**
 * Compares a plain text password against a stored hash.
 * @param {string} plainText - Raw password to compare
 * @param {string} hashed - Stored bcrypt hash
 * @returns {Promise<boolean>} True if match
 */
const compare = (plainText, hashed) => bcrypt.compare(plainText, hashed);

module.exports = { hash, compare };
