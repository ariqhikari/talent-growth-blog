'use strict';

const { connect } = require('./src/config/database');
const env = require('./src/config/env');
const app = require('./src/app');

const start = async () => {
  await connect();

  app.listen(env.PORT, () => {
    console.log(`[Server] Running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

start();

