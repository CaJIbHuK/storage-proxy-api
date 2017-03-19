
import Application from "./application";
import * as handlers from "./handlers";

const app = new Application();
app.proxy = true;
Object.keys(handlers).forEach(handler => app.initHandler(handlers[handler]));
export {app};