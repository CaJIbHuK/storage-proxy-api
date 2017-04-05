import {AppContext} from "application";
import {User} from "handlers/users";

export const controllers = {

  getFiles : async (ctx : AppContext, next) => {
    let google = await (<User>ctx.user).getGoogleDrive();
    ctx.body = await google.files.getAll();
    ctx.status = 200;
    await next();
  },

  getFile : async (ctx : AppContext, next) => {
    let google = await (<User>ctx.user).getGoogleDrive();
    let fileId = ctx.params.id;
    ctx.body = google.files.get(fileId);
    ctx.status = 200;
    await next();
  },

};