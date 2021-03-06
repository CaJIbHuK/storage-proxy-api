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
    secret : env.SECRET || "CWv5mJkKrtuv6PC3K3zUeRDsprPm7LwEWN4QpkRdBDfzBjaYhzslWL49ASoDK85Vd2SV",
    token : {
      ttl : env.TOKEN_TTL || 86400,
      maxCount : env.TOKEN_COUNT || 10,
    },
    google : {
      id : env.GOOGLE_ID || "897872170485-mktar7o1p7inajbgruvlq6vbsdb187g6.apps.googleusercontent.com",
      secret : env.GOOGLE_SECRET || "P_LaBqliIaRC1YQFSaYlzKlj",
      redirect : env.GOOGLE_REDIRECT || "http://localhost:3000/api/v1/auth/google"
    }
  },
  db : db,
  handlers : handlers
};
