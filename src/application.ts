'use strict';

/**
 * Custom application, inherits from Koa Application
 * Gets requireModules which adds a module to handlers.
 *
 * Handlers are called on:
 *   - init (sync) - initial requires
 *   - boot (async) - ensure ready to get a request
 *   - close (async) - close connections
 *
 * @type {Application}
 */

const KoaApplication = require('koa');
const log = require('log')('app', {bufferLowLevel: true});

class Application extends KoaApplication {
  constructor(){
    super(arguments);
    this.handlers = {};
    this.log = log;
  }
}

Application.prototype.waitBoot = function* () {
  for (var path in this.handlers) {
    if (this.handlers.hasOwnProperty(path)) {
      var handler = this.handlers[path];
      if (!handler.boot) continue;
      this.log.trace('-> ' + path);
      yield* handler.boot();
      this.log.trace('<- ' + path);
    }
  }
};

// adding middlewares only possible *before* app.run
// (before server.listen)
// assigns server instance (meaning only 1 app can be run)
//
// app.listen can also be called from tests directly (and synchronously), without waitBoot (many times w/ random port)
// it's ok for tests, db requests are buffered, no need to waitBoot
Application.prototype.waitBootAndListen = function* (port) {
  this.log.info('start boot ->');
  yield* this.waitBoot();
  this.log.info('<- end boot');
  yield function(callback) {
    this.server = this.listen(port, callback);
  }.bind(this);
  this.log.info('App listening %d', port);
};

Application.prototype.close = function* () {
  this.log.info('Closing app server...');
  yield function(callback) {
    this.server.close(callback);
  }.bind(this);
  this.log.info('App connections are closed');
  for (var path in this.handlers) {
    if (this.handlers.hasOwnProperty(path)) {
      var handler = this.handlers[path];
      if (!handler.close) continue;
      yield* handler.close();
    }
  }
  this.log.info('App stopped');
};

Application.prototype.requireHandler = function(path) {
  // if debug is on => will log the middleware travel chain
  /* eslint-disable no-shadow */
  let log = this.log;
  /* eslint-enable no-shadow */
  if (process.env.NODE_ENV === 'development' || process.env.LOG_LEVEL) {
    this.use(function* (next) {
      log.trace('-> setup ' + path);
      var d = new Date();
      yield* next;
      log.trace('<- setup ' + path, new Date() - d);
    });
  }
  var handler = require(path);
  // init is always sync, for tests to run fast
  // boot is async
  if (handler.init) {
    handler.init(this);
  }
  this.handlers[path] = handler;
};

module.exports = Application;