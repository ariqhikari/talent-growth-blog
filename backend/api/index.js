'use strict';

/**
 * Vercel Serverless Function entry point.
 * Connects to MongoDB on cold-start (cached on subsequent requests via database.js pool).
 */
const { connect } = require('../src/config/database');
const app = require('../src/app');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await connect();
    isConnected = true;
  }
  return app(req, res);
};
