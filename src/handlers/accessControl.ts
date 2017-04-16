import {AppContext} from "application";

export const Authorized = async (ctx : AppContext, next) => {
  if (!ctx.user) ctx.throw(403);
  await next();
};

export const NotAuthorized = async (ctx : AppContext, next) => {
  if (ctx.user) ctx.throw(403);
  await next();
};
