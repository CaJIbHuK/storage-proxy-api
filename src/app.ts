
import Application from "./application";
import config from "config";

const app = new Application();
app.proxy = true;

const BASE = "./handlers";

const handlers = [
  `mongoose`,
  `helmet`,
  `cors`,
  `nocache`,
  `reqLogger`,
  `error-handler`,
  `bodyparser`,
  `authtokenparser`,
  `apiRouter`
].concat(config.handlers.v1);

export const initApp = async () => {
  for(let handler of handlers) {
    await app.initHandler(require(`${BASE}/${handler}`).default);
  }
  return app;
};