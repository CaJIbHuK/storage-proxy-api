'use strict';

const app = require('./dist/app').app;
const config = require('./config');

async function shutdown() {
  console.log('Closing the app...');
  try {
    await app.close();
    console.log('App closed');
    process.exit(0);
  } catch (err) {
    console.log(err);
  }
}

process.on('SIGINT', async () => {
  await shutdown();
});

process.on('SIGTERM', async () => {
  await shutdown();
});

async function start() {
  console.log(app);
  await app.bootAndListen(config.port);
  console.log('app is listening');
}

start();

