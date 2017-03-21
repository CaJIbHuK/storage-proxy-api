
import Application from "./application";
import * as sysHandlers from "./handlers/system.middleware";

const app = new Application();
app.proxy = true;

let sHandlers = [
  sysHandlers.helmet,
  sysHandlers.mongoose,
  sysHandlers.cors,

  sysHandlers.nocache,
  sysHandlers.requestLogger,
  sysHandlers.errorHandler,
  sysHandlers.bodyparser,
  sysHandlers.api_v1,


];
sHandlers.forEach(handler => app.initHandler(handler));

import * as appHandlers from "./handlers/apps.middleware";
let aHandlers = [
  appHandlers.auth
];
aHandlers.forEach(handler => app.initHandler(handler));

export {app};