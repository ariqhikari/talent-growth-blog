'use strict';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

const AUTHOR = { name: 'Post Author', email: 'author@example.com', password: 'password123' };
const OTHER = { name: 'Other User', email: 'other@example.com', password: 'password123' };

let authorToken;
let otherToken;
let postId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/talent-growth-test');

  const authorRes = await request(app).post('/api/auth/register').send(AUTHOR);
  authorToken = authorRes.body.data.token;

  const otherRes = await request(app).post('/api/auth/register').send(OTHER);
  otherToken = otherRes.body.data.token;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Post API', () => {
  describe('POST /api/posts', () => {
    it('creates a post for authenticated users', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({ title: 'My First Post', content: 'This is the body of the post with enough content.', category: 'Engineering' });

      expect(res.status).toBe(201);
      expect(res.body.data.post).toHaveProperty('title', 'My First Post');
      expect(res.body.data.post).toHaveProperty('readTime');
      expect(res.body.data.post).toHaveProperty('excerpt');
      postId = res.body.data.post._id;
    });

    it('returns 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ title: 'Unauthorized', content: 'Should not work.' });
      expect(res.status).toBe(401);
    });

    it('returns 400 for missing title', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({ content: 'No title here.' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/posts', () => {
    it('returns paginated posts list', async () => {
      const res = await request(app).get('/api/posts');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body).toHaveProperty('pagination');
      expect(res.body.pagination).toHaveProperty('total');
      expect(res.body.pagination).toHaveProperty('totalPages');
    });

    it('filters posts by search query', async () => {
      const res = await request(app).get('/api/posts?search=First');
      expect(res.status).toBe(200);
    });

    it('respects page and limit parameters', async () => {
      const res = await request(app).get('/api/posts?page=1&limit=5');
      expect(res.status).toBe(200);
      expect(res.body.pagination.limit).toBe(5);
    });
  });

  describe('GET /api/posts/:id', () => {
    it('retrieves a single post by ID', async () => {
      const res = await request(app).get(`/api/posts/${postId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.post._id).toBe(postId);
    });

    it('returns 404 for non-existent post ID', async () => {
      const res = await request(app).get('/api/posts/000000000000000000000000');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('allows the author to update their post', async () => {
      const res = await request(app)
        .put(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${authorToken}`)
        .send({ title: 'Updated Title' });
      expect(res.status).toBe(200);
      expect(res.body.data.post.title).toBe('Updated Title');
    });

    it('blocks a non-author from updating the post', async () => {
      const res = await request(app)
        .put(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ title: 'Hijack attempt' });
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('blocks a non-author from deleting the post', async () => {
      const res = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${otherToken}`);
      expect(res.status).toBe(403);
    });

    it('allows the author to delete their post', async () => {
      const res = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${authorToken}`);
      expect(res.status).toBe(200);
    });
  });
});
