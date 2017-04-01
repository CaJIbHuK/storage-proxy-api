import * as Router from "koa-router";
import {controllers} from "./controllers/user";


const router = new Router();
router
  .post('/signup', controllers.signup)
  .post('/signin', controllers.signin);

export {router};

