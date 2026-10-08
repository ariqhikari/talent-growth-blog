'use strict';

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post reference is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      minlength: [1, 'Comment cannot be empty'],
      maxlength: [1000, 'Comment must be at most 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Retrieve all comments for a specific post efficiently
commentSchema.index({ post: 1, createdAt: 1 });

// Allow finding comments by their author
commentSchema.index({ author: 1 });

module.exports = mongoose.model('Comment', commentSchema);
