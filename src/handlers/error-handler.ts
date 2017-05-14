import {Exception, Logger} from "common";
import {ValidationError} from "mongoose";
import {GoogleRequestError} from "lib/storage/google";
import {JsonWebTokenError} from "jsonwebtoken"
let log = Logger.getLogger('Exception');

interface ValidationApiError {
  message : string;
  errors : any;
}

function format(mongooseError : any) {
  let result : ValidationApiError = {message : "", errors : []};
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
    } else if (err instanceof JsonWebTokenError) {
      ctx.body = {message : "Bad authorization token"};
      ctx.status = 403;
    } else if (err instanceof GoogleRequestError) {
      ctx.body = {message : err.message};
      ctx.status = err.status || 500;
    } else if (err.statusCode && err.statusCode !== 500) {
      ctx.body = {message : err.message};
      ctx.status = err.statusCode;
    } else {
      ctx.body = {message : 'Unexpected error.'};
      ctx.status = 500;
    }
  }
};

export default {
  name : 'errorHandler',
  init : (app) => app.use(init)
};
