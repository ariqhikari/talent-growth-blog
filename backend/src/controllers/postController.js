'use strict';

const postService = require('../services/postService');
const { success, created, paginated } = require('../utils/apiResponse');

/**
 * Post controller — thin HTTP adapter.
 */

const getPosts = async (req, res, next) => {
  try {
    const { posts, pagination } = await postService.getPosts(req.query);
    return paginated(res, posts, pagination, 'Posts retrieved');
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id);
    return success(res, { post }, 'Post retrieved');
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    const post = await postService.createPost(req.user._id, { title, content, category });
    return created(res, { post }, 'Post published');
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await postService.updatePost(req.params.id, req.user._id, req.body);
    return success(res, { post }, 'Post updated');
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    await postService.deletePost(req.params.id, req.user._id);
    return success(res, null, 'Post deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = { getPosts, getPost, createPost, updatePost, deletePost };

