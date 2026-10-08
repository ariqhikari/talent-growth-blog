'use strict';

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title must be at most 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: [10, 'Content must be at least 10 characters'],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, 'Excerpt must be at most 300 characters'],
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
      enum: {
        values: ['General', 'Engineering', 'Design', 'Product', 'Notes', 'Career'],
        message: 'Category must be one of: General, Engineering, Design, Product, Notes, Career',
      },
    },
    readTime: {
      type: Number,
      default: 1,
      min: 1,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Full-text search across title and content
postSchema.index({ title: 'text', content: 'text' });

// Fast descending sort by creation date (default listing order)
postSchema.index({ createdAt: -1 });

// Filter by category efficiently
postSchema.index({ category: 1 });

// Filter posts by a specific author
postSchema.index({ author: 1 });

module.exports = mongoose.model('Post', postSchema);

