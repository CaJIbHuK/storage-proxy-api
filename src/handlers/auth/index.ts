import {router} from "./router";
import {api_v1} from "../apiRouter";


export const auth = {
  name : 'auth',
  init : (app) => api_v1.mount('/auth', router)
};