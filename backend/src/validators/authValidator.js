'use strict';

const { validate } = require('../middleware/validateMiddleware');

const registerRules = {
  name: { required: true, type: 'string', minLength: 2, maxLength: 50 },
  email: { required: true, type: 'email' },
  password: { required: true, type: 'string', minLength: 6, maxLength: 100 },
};

const loginRules = {
  email: { required: true, type: 'email' },
  password: { required: true, type: 'string', minLength: 1 },
};

const profileRules = {
  name: { required: false, type: 'string', minLength: 2, maxLength: 50 },
  bio: { required: false, type: 'string', maxLength: 250 },
  avatar: { required: false, type: 'string', maxLength: 500 },
};

module.exports = {
  validateRegister: validate(registerRules),
  validateLogin: validate(loginRules),
  validateProfile: validate(profileRules),
};

