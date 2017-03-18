
import Application from "./application";
import errorHandler from "./handlers/error-handler.middleware";


const app = new Application();
app.proxy = true;

let handlers = [
  errorHandler
];

for(let handler of handlers) {
  app.initHandler(handler);
}

export {app};