import * as Router from "koa-router";
import {controllers} from "./controllers/user";
import {Authorized} from "handlers/accessControl";

const router = new Router();
router
  .get('/me', Authorized, controllers.getMe);

export {router};
