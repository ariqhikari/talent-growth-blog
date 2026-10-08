'use strict';

const router = require('express').Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateCreatePost, validateUpdatePost } = require('../validators/postValidator');
const { validateComment } = require('../validators/commentValidator');

// Public routes
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.get('/:id/comments', commentController.getComments);

// Protected routes
router.post('/', authenticate, validateCreatePost, postController.createPost);
router.put('/:id', authenticate, validateUpdatePost, postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);
router.post('/:id/comments', authenticate, validateComment, commentController.addComment);

module.exports = router;

