'use strict';

const mongoose = require('mongoose');
const env = require('./env');

/**
 * Cached Mongoose connection for serverless environments.
 * Prevents new connections on every cold-start invocation on Vercel.
 */
let cachedConnection = null;

const connect = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
  };

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, options);
    cachedConnection = conn;

    if (!env.isTest) {
      console.log(`[Database] Connected to MongoDB: ${conn.connection.host}`);
    }

    return conn;
  } catch (error) {
    console.error('[Database] Connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { connect };
