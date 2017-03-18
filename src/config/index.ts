'use strict';

import * as os from "os";

let env = process.env;
env.NODE_ENV = env.NODE_ENV || 'development';

export default {
  app : {
    instanceId : env.APP_INSTANCE_ID || 'storage-proxy',
    host : env.API_HOST || os.hostname() || 'localhost',
    port : env.API_PORT || 3000
  }
};
