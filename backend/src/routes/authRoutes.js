'use strict';

const router = require('express').Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateRegister, validateLogin, validateProfile } = require('../validators/authValidator');

router.post('/register', authLimiter, validateRegister, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);
router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, validateProfile, authController.updateProfile);

module.exports = router;

