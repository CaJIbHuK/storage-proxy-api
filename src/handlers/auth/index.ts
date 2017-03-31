import {router} from "./router";
import {api_v1} from "handlers/apiRouter";


export const auth = {
  name : 'auth',
  init : (app) => api_v1.mount('/auth', router)
};