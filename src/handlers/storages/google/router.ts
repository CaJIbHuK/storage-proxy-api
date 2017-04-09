import * as Router from "koa-router";
import {controllers} from "./controllers/user";


const router = new Router();
router
  .get('/files', controllers.getFiles)
  .get('/files/:id', controllers.getFile)
  .get('/files/:id/download', controllers.downloadFile)
  .post('/files', controllers.createFile)
  .put('/files/:id', controllers.updateFile)
  .put('/files/:id/upload', controllers.uploadFile)
  .del('/files/:id', controllers.removeFile)
;

export {router};

