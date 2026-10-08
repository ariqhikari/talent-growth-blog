'use strict';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/talent-growth-test');
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Auth API', () => {
  let token;

  describe('POST /api/auth/register', () => {
    it('registers a new user and returns token + user data', async () => {
      const res = await request(app).post('/api/auth/register').send(TEST_USER);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', TEST_USER.email);
      expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('returns 409 when email is already registered', async () => {
      const res = await request(app).post('/api/auth/register').send(TEST_USER);
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('returns 400 when required fields are missing', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: 'x@x.com' });
      expect(res.status).toBe(400);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('returns 400 for invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'not-an-email', password: 'pass123' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('logs in with correct credentials and returns token', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: TEST_USER.email,
        password: TEST_USER.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('token');
      token = res.body.data.token;
    });

    it('returns 401 for wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: TEST_USER.email,
        password: 'wrongpassword',
      });
      expect(res.status).toBe(401);
    });

    it('returns 401 for non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'pass123' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns current user profile with valid token', async () => {
      const loginRes = await request(app).post('/api/auth/login').send({
        email: TEST_USER.email,
        password: TEST_USER.password,
      });
      const validToken = loginRes.body.data.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user).toHaveProperty('email', TEST_USER.email);
    });

    it('returns 401 without authorization header', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });
});

