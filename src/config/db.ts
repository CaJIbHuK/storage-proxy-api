const env = process.env;
const nodeEnv = env.NODE_ENV || 'development';
const host = env.DB_HOST || 'localhost';
const port = env.DB_PORT || '27017';
const dbName = env.DB_NAME || 'storage';
const dbUser = env.DB_USER || 'api';
const dbPass = env.DB_PASS || 'storageapi';

export default {
  uri : `mongodb://${dbUser}:${dbPass}@${host}:${port}/api_${dbName}_${nodeEnv}`,
  options : {
    // user : dbUser,
    // pass : dbPass,
    server : {
      poolSize : 5,
      //ssl,
      //sslValidate,
      //checkServerIdentity,
      //sslCA,
      //sslCert,
      //sslKey,
      //sslPass
      socketOptions : {
        autoReconnect : true,
        keepAlive : 1,
        connectTimeoutMS : 30000
      }
    },
  }
};

