'use strict';

const Comment = require('../models/Comment');

/**
 * Data access layer for Comment.
 */

const findByPost = (postId) =>
  Comment.find({ post: postId })
    .populate('author', 'name avatar')
    .sort({ createdAt: 1 })
    .lean();

const findById = (id) => Comment.findById(id).populate('author', 'name avatar');

const create = (commentData) => Comment.create(commentData);

const updateById = (id, content) =>
  Comment.findByIdAndUpdate(id, { content }, { new: true, runValidators: true }).populate('author', 'name avatar');

const deleteById = (id) => Comment.findByIdAndDelete(id);

const deleteByPost = (postId) => Comment.deleteMany({ post: postId });

module.exports = { findByPost, findById, create, updateById, deleteById, deleteByPost };
