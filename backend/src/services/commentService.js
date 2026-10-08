'use strict';

const commentRepository = require('../repositories/commentRepository');
const postRepository = require('../repositories/postRepository');
const { NotFoundError, ForbiddenError } = require('../errors');

/**
 * Comment service — orchestrates comment operations with business rule enforcement.
 */

const getCommentsByPost = async (postId) => {
  // Verify the post exists before fetching its comments
  const postExists = await postRepository.findById(postId);
  if (!postExists) throw new NotFoundError('Post');

  return commentRepository.findByPost(postId);
};

const addComment = async (postId, authorId, content) => {
  const postExists = await postRepository.findById(postId);
  if (!postExists) throw new NotFoundError('Post');

  return commentRepository.create({ post: postId, author: authorId, content });
};

const updateComment = async (commentId, requesterId, content) => {
  const comment = await commentRepository.findById(commentId);
  if (!comment) throw new NotFoundError('Comment');

  if (comment.author._id.toString() !== requesterId.toString()) {
    throw new ForbiddenError('You can only edit your own comments');
  }

  return commentRepository.updateById(commentId, content);
};

const deleteComment = async (commentId, requesterId) => {
  const comment = await commentRepository.findById(commentId);
  if (!comment) throw new NotFoundError('Comment');

  if (comment.author._id.toString() !== requesterId.toString()) {
    throw new ForbiddenError('You can only delete your own comments');
  }

  await commentRepository.deleteById(commentId);
};

module.exports = { getCommentsByPost, addComment, updateComment, deleteComment };
