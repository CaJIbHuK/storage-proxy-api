import {AppContext} from "application";
import {User} from "../models";

export const controllers = {

  getMe : async (ctx : AppContext, next) => {
    //TODO remove when rbac will has been implemented
    if (!ctx.user) ctx.throw(404, 'User not found');
    ctx.body = User.formatUser(<User>ctx.user);
    ctx.status = 200;
    await next();
  }

};