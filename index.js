'use strict';

const loader = require('app-module-path');
loader.addPath(__dirname + '/dist');

const initApp = require('app').initApp;
const config = require('config').default.app;
let app = null;

class AppManager {
  constructor(app = null) {
    this.app = app;
  }

  async start() {
    await this.app.bootAndListen(config.port);
    console.log('app is listening');
  };

  async shutdown() {
    console.log('Closing the app...');
    try {
      await this.app.close();
      console.log('App closed');
      process.exit(0);
    } catch (err) {
      console.log(err);
    }
  };

}


initApp().then(app => new AppManager(app))
  .then(application => {
    application.start();
    bindEvents(application);
  });

function bindEvents(application) {
  process.on('SIGINT', async () => {
    await application.shutdown();
  });

  process.on('SIGTERM', async () => {
    await application.shutdown();
  });
}