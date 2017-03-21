import * as koaBodyParser from "koa-bodyparser";

export const bodyparser  = {
  name : 'bodyparser',
  init : (app) => app.use(koaBodyParser())
};