import * as Router from "koa-router";
import {router as googleRouter} from "./google";

const router = new Router();
router
  .use("/google", googleRouter.routes(), googleRouter.allowedMethods());
export {router};

