import {AppContext} from "application";
import {User} from "../models";

export const controllers = {

  getMe : async (ctx : AppContext, next) => {
    ctx.body = User.formatUser(<User>ctx.user);
    ctx.status = 200;
    await next();
  }

};