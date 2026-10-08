'use strict';

const postRepository = require('../repositories/postRepository');
const commentRepository = require('../repositories/commentRepository');
const { computeReadTime, deriveExcerpt } = require('../utils/textUtils');
const { NotFoundError, ForbiddenError } = require('../errors');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

/**
 * Post service — orchestrates repository calls and enforces business rules.
 */

const getPosts = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit, 10) || DEFAULT_LIMIT));
  const search = query.search ? query.search.trim() : undefined;
  const category = query.category || undefined;
  const author = query.author || undefined;

  const { posts, total } = await postRepository.findAll({ search, category, author, page, limit });

  const totalPages = Math.ceil(total / limit);

  return {
    posts,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

const getPostById = async (id) => {
  const post = await postRepository.findById(id);
  if (!post) throw new NotFoundError('Post');
  return post;
};

const createPost = async (authorId, { title, content, category }) => {
  const excerpt = deriveExcerpt(content);
  const readTime = computeReadTime(content);

  const post = await postRepository.create({
    title,
    content,
    category,
    excerpt,
    readTime,
    author: authorId,
  });

  return post;
};

const updatePost = async (postId, requesterId, updates) => {
  const post = await postRepository.findById(postId);
  if (!post) throw new NotFoundError('Post');

  // Business rule: only the post author can update it
  if (post.author._id.toString() !== requesterId.toString()) {
    throw new ForbiddenError('You can only edit your own posts');
  }

  const patch = { ...updates };
  if (updates.content) {
    patch.excerpt = deriveExcerpt(updates.content);
    patch.readTime = computeReadTime(updates.content);
  }

  return postRepository.updateById(postId, patch);
};

const deletePost = async (postId, requesterId) => {
  const post = await postRepository.findById(postId);
  if (!post) throw new NotFoundError('Post');

  if (post.author._id.toString() !== requesterId.toString()) {
    throw new ForbiddenError('You can only delete your own posts');
  }

  // Cascade: remove all associated comments before deleting the post
  await commentRepository.deleteByPost(postId);
  await postRepository.deleteById(postId);
};

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
