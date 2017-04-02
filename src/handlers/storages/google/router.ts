import * as Router from "koa-router";
import {controllers} from "./controllers/user";


const router = new Router();
router
  .get('/files', controllers.getFiles);

export {router};

