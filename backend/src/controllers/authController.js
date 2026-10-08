'use strict';

const authService = require('../services/authService');
const { success, created } = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants/httpStatus');

/**
 * Auth controller — thin HTTP adapter.
 * Delegates all business logic to authService.
 */

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    return created(res, result, 'Account created successfully');
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return success(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);
    return success(res, { user }, 'Profile retrieved');
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user._id, req.body);
    return success(res, { user }, 'Profile updated');
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile };
