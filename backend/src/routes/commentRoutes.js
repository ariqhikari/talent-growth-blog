'use strict';

const router = require('express').Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateComment } = require('../validators/commentValidator');

// Comment-level operations (edit/delete by comment ID)
router.put('/:id', authenticate, validateComment, commentController.updateComment);
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;

