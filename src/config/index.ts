import * as os from "os";
import handlers from "./handlers";
import db from "./db";

let env = process.env;
env.NODE_ENV = env.NODE_ENV || 'development';

export default {
  app : {
    instanceId : env.APP_INSTANCE_ID || 'storage-proxy',
    host : env.API_HOST || os.hostname() || 'localhost',
    port : env.API_PORT || 3000,
    secret : env.SECRET || "CWv5mJkKrtuv6PC3K3zUeRDsprPm7LwEWN4QpkRdBDfzBjaYhzslWL49ASoDK85Vd2SV"
  },
  db : db,
  handlers : handlers
};
