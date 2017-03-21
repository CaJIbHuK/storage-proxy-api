import * as Router from "koa-router";
import {controllers} from "./controllers/user";


const router = new Router();
router
  .post('/signup', controllers.signup);

export {router};

