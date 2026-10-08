'use strict';

const User = require('../models/User');

/**
 * Data access layer for User.
 * All Mongoose queries are isolated here — services never call User.find() directly.
 */

const findByEmail = (email) => User.findOne({ email }).select('+password');

const findById = (id) => User.findById(id);

const create = (userData) => User.create(userData);

const updateById = (id, updates) =>
  User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

module.exports = { findByEmail, findById, create, updateById };
