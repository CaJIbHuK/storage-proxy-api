import * as koaBodyParser from "koa-bodyparser";

export default {
  name : 'bodyparser',
  init : (app) => app.use(koaBodyParser())
};