'use strict';

const userRepository = require('../repositories/userRepository');
const { hash, compare } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../errors');

/**
 * Authentication service — business logic only, no HTTP concerns.
 */

const register = async ({ name, email, password }) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new ConflictError('An account with this email already exists');
  }

  const hashedPassword = await hash(password);
  const user = await userRepository.create({ name, email, password: hashedPassword });

  const token = generateToken(user._id.toString());

  return { token, user };
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    // Use a generic message to prevent email enumeration attacks
    throw new UnauthorizedError('Invalid email or password');
  }

  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = generateToken(user._id.toString());

  // Remove password before returning user data
  const userObj = user.toObject();
  delete userObj.password;

  return { token, user: userObj };
};

const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new NotFoundError('User');
  return user;
};

const updateProfile = async (userId, updates) => {
  // Prevent users from updating sensitive fields via this route
  const { name, avatar, bio } = updates;
  const sanitized = { name, avatar, bio };

  const user = await userRepository.updateById(userId, sanitized);
  if (!user) throw new NotFoundError('User');
  return user;
};

module.exports = { register, login, getProfile, updateProfile };

