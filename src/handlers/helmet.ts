const koaHelmet = require("koa-helmet");

export default {
  name : 'helmet',
  init : (app) => app.use(koaHelmet())
};