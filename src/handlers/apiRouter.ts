import * as Router from "koa-router";
import {mount} from "lib";

export const api_v1 = {
  name : 'api_v1',
  app : null,
  api : null,
  mount : (prefix : string, router : Router) => mount(this.api, prefix, router),
  init : (app) => {this.api = new Router(); this.api.prefix("/api/v1"); this.app = app;},
  boot : () => {this.app.use(this.api.routes(), this.api.allowedMethods())}
};
