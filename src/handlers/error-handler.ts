import {Exception, Logger} from "../common";
import {ValidationError} from "mongoose";
let log = Logger.getLogger('Exception');

interface ValidationApiError {
  message : string;
  errors : any;
}

function format(mongooseError : any) {
  let result : ValidationApiError = {};
  result.message = mongooseError.message || 'Validation error';
  if (mongooseError.errors) {
    result.errors = Object.keys(mongooseError.errors).map(field => ({[field] : mongooseError.errors[field].message}));
  }

  return result;
}

let init = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    log.error(err);
    log.error(err.stack);
    if (err.name === 'ValidationError') {
      ctx.body = format(err);
      ctx.status = 400;
    } else if (err instanceof Exception) {
      ctx.body = err.toObject();
      ctx.status = err.statusCode;
    } else {
      ctx.body = {message : 'Unexpected error.'};
      ctx.status = 500;
    }
  }
};

export const errorHandler = {
  name : 'errorHandler',
  init : (app) => app.use(init)
};
