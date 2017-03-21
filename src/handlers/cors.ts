import koaCors = require("koa2-cors");


export const cors = {
  name : 'cors',
  init : (app) => app.use(koaCors())
};