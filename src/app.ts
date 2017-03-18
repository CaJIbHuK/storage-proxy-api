'use strict';

const Application = require('application');
const app = new Application();
const config = require('config');

app.proxy = true;

const handlers = [
  'helmet',
  'mongooseHandler',
  'rabbit',
  'cors',
  'requestId',
  'requestLog',
  'nocache',
  'errorHandler',
  'accessLogger',
  'verifyCloudPayments',
  'i18n',
  'authTokenParser',
  'validateJSON',
  'bodyParser',
  'multipartParser',
  'verboseLogger',
  'rbac',
  'reqLogger',
  'auth',
  'lastActivityHandler',
  'resolveResponseBody',
];

handlers.concat(config.handlers.v1);

for (let handler of handlers) {
  app.requireHandler(handler);
}

app.requireHandler('404');

module.exports = app;