import * as Router from "koa-router";
import {controllers} from "./controllers/user";
import {NotAuthorized} from "handlers/accessControl";


const router = new Router();
router
  .post('/signup', NotAuthorized, controllers.signup)
  .post('/signin', controllers.signin)
  .get('/google', NotAuthorized, controllers.google);

export {router};

