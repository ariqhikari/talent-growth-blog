'use strict';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

const COMMENTER = { name: 'Commenter', email: 'commenter@example.com', password: 'password123' };
const OTHER = { name: 'Intruder', email: 'intruder@example.com', password: 'password123' };

let commenterToken;
let otherToken;
let postId;
let commentId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/talent-growth-test');

  const commenterRes = await request(app).post('/api/auth/register').send(COMMENTER);
  commenterToken = commenterRes.body.data.token;

  const otherRes = await request(app).post('/api/auth/register').send(OTHER);
  otherToken = otherRes.body.data.token;

  const postRes = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${commenterToken}`)
    .send({ title: 'Post for Comments', content: 'Comment on this post with meaningful text.' });
  postId = postRes.body.data.post._id;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Comment API', () => {
  describe('POST /api/posts/:id/comments', () => {
    it('adds a comment to an existing post', async () => {
      const res = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${commenterToken}`)
        .send({ content: 'This is a comment.' });

      expect(res.status).toBe(201);
      expect(res.body.data.comment).toHaveProperty('content', 'This is a comment.');
      commentId = res.body.data.comment._id;
    });

    it('returns 401 for unauthenticated users', async () => {
      const res = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .send({ content: 'Anon comment' });
      expect(res.status).toBe(401);
    });

    it('returns 400 for empty comment content', async () => {
      const res = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${commenterToken}`)
        .send({ content: '' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/posts/:id/comments', () => {
    it('returns all comments for a post', async () => {
      const res = await request(app).get(`/api/posts/${postId}/comments`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.comments)).toBe(true);
      expect(res.body.data.comments.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/comments/:id', () => {
    it('allows the comment author to edit their comment', async () => {
      const res = await request(app)
        .put(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${commenterToken}`)
        .send({ content: 'Updated comment content.' });
      expect(res.status).toBe(200);
      expect(res.body.data.comment.content).toBe('Updated comment content.');
    });

    it('blocks a non-author from editing the comment', async () => {
      const res = await request(app)
        .put(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ content: 'Hijack attempt.' });
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/comments/:id', () => {
    it('blocks a non-author from deleting the comment', async () => {
      const res = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${otherToken}`);
      expect(res.status).toBe(403);
    });

    it('allows the comment author to delete their comment', async () => {
      const res = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${commenterToken}`);
      expect(res.status).toBe(200);
    });
  });
});
