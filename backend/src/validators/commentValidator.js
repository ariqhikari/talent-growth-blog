'use strict';

const { validate } = require('../middleware/validateMiddleware');

const commentRules = {
  content: { required: true, type: 'string', minLength: 1, maxLength: 1000 },
};

module.exports = {
  validateComment: validate(commentRules),
};

