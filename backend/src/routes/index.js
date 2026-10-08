'use strict';

const router = require('express').Router();
const authRoutes = require('./authRoutes');
const postRoutes = require('./postRoutes');
const commentRoutes = require('./commentRoutes');
const { success } = require('../utils/apiResponse');

// API health check
router.get('/health', (req, res) => {
  success(res, { status: 'ok', timestamp: new Date().toISOString() }, 'API is running');
});

// Mount feature routers
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
