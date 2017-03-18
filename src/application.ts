'use strict';

import * as Koa from "koa";
import Logger from "./common/logger";
import {Handler} from "./common/handler";

export default class Application extends Koa {

  handlers : any;
  log : Logger;

  constructor() {
    super();
    this.handlers = {};
    this.log = Logger.getLogger('Boot');
  }

  initHandler(handler : Handler) {
    if (handler.init) {
      this.log.silly(`init -> ${handler.name}`);
      handler.init(this);
      this.log.silly(`init <- ${handler.name}`);
    }
  }

  async waitBoot() {
    for (let path in this.handlers) {
      if (this.handlers.hasOwnProperty(path)) {
        let handler = this.handlers[path];
        if (!handler.boot) continue;
        this.log.silly('-> ' + path);
        await handler.boot();
        this.log.silly('<- ' + path);
      }
    }
  }

  async bootAndListen(port) {
    this.log.debug('start boot ->');
    await this.waitBoot();
    this.log.debug('<- end boot');
    this.listen(port);
    this.log.info('App listening %d', port);
  }

  async close() {
    this.log.debug('Closing app server...');
    await function (callback) {
      this.server.close(callback);
    }.bind(this);
    this.log.debug('App connections are closed');
    for (let path in this.handlers) {
      if (this.handlers.hasOwnProperty(path)) {
        let handler = this.handlers[path];
        if (!handler.close) continue;
        await handler.close();
      }
    }
    this.log.info('App stopped');
  };
}
