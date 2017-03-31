import * as Koa from "koa"
import {Logger} from "common";
let log = Logger.getLogger('Request');

export const requestLogger = {
  name : 'requestLogger',
  init : (app) => app.use(async(ctx : Koa.Context, next) => {
    let logData = {
      request : {
        'url' : ctx.request.url,
        'method' : ctx.request.method,
        'body' : ctx.request.body,
        'host' : ctx.request.header.host,
        'user-agent' : ctx.request.header['user-agent'],
        'content-type' : ctx.request.header['content-type'],
      }
    };
    log.debug("\n"+JSON.stringify(logData, null, 4));
    await next();
  })
};
