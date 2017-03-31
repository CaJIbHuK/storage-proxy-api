const koaHelmet = require("koa-helmet");

export const helmet = {
  name : 'helmet',
  init : (app) => app.use(koaHelmet())
};