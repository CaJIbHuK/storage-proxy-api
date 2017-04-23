import * as Router from "koa-router";
import {controllers} from "./controllers/user";

const filesRouter = new Router();
filesRouter
  .get('/', controllers.getFiles)
  .get('/:id', controllers.getFile)
  .get('/:id/download', controllers.downloadFile)
  .post('/', controllers.createFile)
  .put('/:id', controllers.updateFile)
  .put('/:id/upload', controllers.uploadFile)
  .del('/:id', controllers.removeFile)
;

const router = new Router();
router
  .get('/access', controllers.getAccess)
  .use('/files', controllers.hasAccess, filesRouter.routes(), filesRouter.allowedMethods())
;

export {router};

