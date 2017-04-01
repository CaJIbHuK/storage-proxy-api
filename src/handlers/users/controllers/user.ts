import {AppContext} from "application";
import {User} from "../models";

import Google from "lib/googleApi";

export const controllers = {

  getMe : async (ctx : AppContext, next) => {
    if (!ctx.user) ctx.throw(404, 'User not found');

    let g = Google.getAPI();
    g.requestAccess(ctx.user.id);

    ctx.body = User.formatUser(<User>ctx.user);
    ctx.status = 200;
    await next();
  }

};