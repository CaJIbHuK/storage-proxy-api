const koaCors = require("koa2-cors");


export default {
  name : 'cors',
  init : (app) => app.use(koaCors())
};