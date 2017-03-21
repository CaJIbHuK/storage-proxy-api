const env = process.env;
const nodeEnv = env.NODE_ENV || 'development';
const host = env.DB_HOST || 'localhost';
const port = env.DB_PORT || '27017';
const dbName = env.DB_NAME || 'storage';
// const dbUser = env.DB_USER || 'root';
// const dbPass = env.DB_PASS || 'root';

export default {
  uri : `mongodb://${host}:${port}/api_${dbName}_${nodeEnv}`,
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

