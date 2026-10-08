'use strict';

const commentService = require('../services/commentService');
const { success, created } = require('../utils/apiResponse');

/**
 * Comment controller — thin HTTP adapter.
 */

const getComments = async (req, res, next) => {
  try {
    const comments = await commentService.getCommentsByPost(req.params.id);
    return success(res, { comments }, 'Comments retrieved');
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const comment = await commentService.addComment(
      req.params.id,
      req.user._id,
      req.body.content
    );
    return created(res, { comment }, 'Comment added');
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const comment = await commentService.updateComment(
      req.params.id,
      req.user._id,
      req.body.content
    );
    return success(res, { comment }, 'Comment updated');
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    await commentService.deleteComment(req.params.id, req.user._id);
    return success(res, null, 'Comment deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = { getComments, addComment, updateComment, deleteComment };
