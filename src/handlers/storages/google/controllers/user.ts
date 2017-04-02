import {AppContext} from "application";
import {User} from "handlers/users";
import {GoogleAPI} from "lib/storage";

export const controllers = {

  getFiles : async (ctx : AppContext, next) => {
    let google = new GoogleAPI((<User>ctx.user).googleTokens);
    ctx.body = await google.files.getAll();
    ctx.status = 200;
    await next();
  },

};