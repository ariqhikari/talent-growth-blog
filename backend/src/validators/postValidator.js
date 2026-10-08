'use strict';

const { validate } = require('../middleware/validateMiddleware');

const CATEGORIES = ['General', 'Engineering', 'Design', 'Product', 'Notes', 'Career'];

const createRules = {
  title: { required: true, type: 'string', minLength: 3, maxLength: 200 },
  content: { required: true, type: 'string', minLength: 10 },
  category: { required: false, type: 'string', enum: CATEGORIES },
};

const updateRules = {
  title: { required: false, type: 'string', minLength: 3, maxLength: 200 },
  content: { required: false, type: 'string', minLength: 10 },
  category: { required: false, type: 'string', enum: CATEGORIES },
};

module.exports = {
  validateCreatePost: validate(createRules),
  validateUpdatePost: validate(updateRules),
};
