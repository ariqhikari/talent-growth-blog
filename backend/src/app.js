'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const env = require('./config/env');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { error: errorResponse } = require('./utils/apiResponse');
const { HTTP_STATUS } = require('./constants/httpStatus');

const app = express();

// Security headers
app.use(helmet());

// CORS — allow frontend origin only
app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// HTTP request logging (disabled during tests)
if (!env.isTest) {
  app.use(morgan('dev'));
}

// Global API rate limiter
app.use('/api', apiLimiter);

// Mount all routes under /api
app.use('/api', routes);

// 404 handler for unknown routes
app.use((req, res) => {
  errorResponse(res, `Route ${req.originalUrl} not found`, HTTP_STATUS.NOT_FOUND);
});

// Global error handler (must be last middleware, 4 params)
app.use(errorHandler);

module.exports = app;
