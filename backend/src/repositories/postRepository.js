'use strict';

const Post = require('../models/Post');

/**
 * Data access layer for Post.
 */

const findAll = async ({ search, category, author, page, limit }) => {
  const filter = {};

  if (search) {
    filter.$text = { $search: search };
  }
  if (category) {
    filter.category = category;
  }
  if (author) {
    filter.author = author;
  }

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
  ]);

  return { posts, total };
};

const findById = (id) => Post.findById(id).populate('author', 'name avatar bio');

const create = (postData) => Post.create(postData);

const updateById = (id, updates) =>
  Post.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate('author', 'name avatar');

const deleteById = (id) => Post.findByIdAndDelete(id);

module.exports = { findAll, findById, create, updateById, deleteById };
