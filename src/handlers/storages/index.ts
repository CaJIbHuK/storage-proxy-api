import {router} from "./router";
import api_v1 from "handlers/apiRouter";

export default {
  name : 'storages',
  init : (app) => api_v1.mount('/storages', router)
};

export * from "./google";