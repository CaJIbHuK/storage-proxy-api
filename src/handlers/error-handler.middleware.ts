import Exception from "../common/exception";
import Logger from "../common/logger";
let log = Logger.getLogger('Exception');

let init = async (ctx, next) => {
  try {
    await next;
  } catch (err) {
    log.error(err.message, err.toObject());
    if (err instanceof Exception) {
      ctx.body = err.toObject();
      ctx.status = err.statusCode;
    } else {
      ctx.body = {message : 'Unexpected error.'};
      ctx.status = 500;
    }
  }
};

export default {
  name : 'errorHandler',
  init : init
};
