import {router} from "./router";
import api_v1 from "handlers/apiRouter";

export * from "./models";

export default {
  name : 'users',
  init : (app) => api_v1.mount('/users', router)
};