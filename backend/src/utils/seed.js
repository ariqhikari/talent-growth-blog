'use strict';

/**
 * Database Seeder
 *
 * Populates MongoDB with realistic demo data for local dev and staging.
 *
 * Usage:
 *   node src/utils/seed.js            # skip if data already exists
 *   node src/utils/seed.js --clean    # drop existing seed data first
 */

require('dotenv').config();

const mongoose = require('mongoose');
const { USERS, POSTS, COMMENTS } = require('./seedData');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { hash } = require('./hash');
const { computeReadTime, deriveExcerpt } = require('./textUtils');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const daysAgoDate = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const log = (msg) => console.log(`[seed] ${msg}`);
const err = (msg, e) => console.error(`[seed:error] ${msg}`, e?.message ?? '');

// ─── Connection ───────────────────────────────────────────────────────────────

async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set in .env');
  await mongoose.connect(uri);
  log('Connected to MongoDB');
}

// ─── Clean ────────────────────────────────────────────────────────────────────

async function clean() {
  log('Dropping existing seed data…');
  await Comment.deleteMany({});
  await Post.deleteMany({});
  // Only remove seed users (identified by known emails) to avoid deleting real accounts
  const seedEmails = USERS.map((u) => u.email);
  await User.deleteMany({ email: { $in: seedEmails } });
  log('Existing seed data removed');
}

// ─── Seed Users ───────────────────────────────────────────────────────────────

async function seedUsers() {
  log('Seeding users…');
  const created = {};

  for (const userData of USERS) {
    const hashedPassword = await hash(userData.password);
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      avatar: userData.avatar,
      bio: userData.bio,
    });
    created[userData.email] = user._id;
    log(`  ✓ ${userData.name} (${userData.email})`);
  }

  return created;
}

// ─── Seed Posts ───────────────────────────────────────────────────────────────

async function seedPosts(userMap) {
  log('Seeding posts…');
  const created = {};

  for (const postData of POSTS) {
    const authorId = userMap[postData.authorEmail];
    if (!authorId) {
      err(`No user found for email: ${postData.authorEmail}`);
      continue;
    }

    const readTime = computeReadTime(postData.content);
    const excerpt = deriveExcerpt(postData.content, 160);
    const createdAt = daysAgoDate(postData.daysAgo ?? 30);

    const post = await Post.create({
      title: postData.title,
      content: postData.content,
      excerpt,
      category: postData.category,
      readTime,
      author: authorId,
      createdAt,
      updatedAt: createdAt,
    });

    created[postData.title] = post._id;
    log(`  ✓ "${postData.title}" by ${postData.authorEmail}`);
  }

  return created;
}

// ─── Seed Comments ────────────────────────────────────────────────────────────

async function seedComments(userMap, postMap) {
  log('Seeding comments…');

  for (const commentData of COMMENTS) {
    const authorId = userMap[commentData.authorEmail];
    const postId = postMap[commentData.postTitle];

    if (!authorId) {
      err(`No user for comment author: ${commentData.authorEmail}`);
      continue;
    }
    if (!postId) {
      err(`No post found for title: "${commentData.postTitle}"`);
      continue;
    }

    const createdAt = daysAgoDate(commentData.daysAgo ?? 20);

    await Comment.create({
      content: commentData.content,
      author: authorId,
      post: postId,
      createdAt,
      updatedAt: createdAt,
    });
  }

  log(`  ✓ ${COMMENTS.length} comments created`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const isClean = process.argv.includes('--clean');

  try {
    await connect();

    // Idempotency guard: skip if data already exists and --clean not passed
    if (!isClean) {
      const existingCount = await User.countDocuments({
        email: { $in: USERS.map((u) => u.email) },
      });
      if (existingCount > 0) {
        log(`Seed data already present (${existingCount} seed users found). Pass --clean to re-seed.`);
        await mongoose.disconnect();
        process.exit(0);
      }
    }

    if (isClean) await clean();

    const userMap = await seedUsers();
    const postMap = await seedPosts(userMap);
    await seedComments(userMap, postMap);

    log('');
    log('─────────────────────────────────────────────────────');
    log(`Seeding complete:`);
    log(`  Users    : ${USERS.length}`);
    log(`  Posts    : ${POSTS.length}`);
    log(`  Comments : ${COMMENTS.length}`);
    log('─────────────────────────────────────────────────────');
    log('');
    log('Demo credentials (all accounts share the same password):');
    USERS.forEach((u) => log(`  ${u.email}  /  Password123!`));
    log('');

    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    err('Fatal error during seeding', e);
    try { await mongoose.disconnect(); } catch (_) {}
    process.exit(1);
  }
}

main();
