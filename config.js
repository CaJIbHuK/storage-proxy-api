'use strict';
const os = require('os');
let env = process.env;

module.exports = {
  instanceId : env.APP_INSTANCE_ID || 'proxy-storage',
  host : env.API_HOST || os.hostname() || 'localhost',
  port : env.API_PORT || 3000,
};
