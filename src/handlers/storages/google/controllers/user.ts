import {AppContext} from "application";
import {User} from "handlers/users";

export const controllers = {

  getFiles : async (ctx : AppContext, next) => {
    let google = await (<User>ctx.user).getGoogleDrive();
    let rootFiles = await google.files.listFolder();
    ctx.body = {nextPage : rootFiles.nextPageToken, files : rootFiles.files.map(file => file.toApiFile())};
    ctx.status = 200;
    await next();
  },

  getFile : async (ctx : AppContext, next) => {
    let google = await (<User>ctx.user).getGoogleDrive();
    let fileId = ctx.params.id;
    let file = await google.files.getInfo(fileId).then(file => file.toApiFile());

    let result = {};
    if (file.folder) {
      let list = await google.files.listFolder(file.id);
      result = {nextPage : list.nextPageToken, files : list.files.map(file => file.toApiFile())}
    } else {
      result = file;
    }

    ctx.body = result;
    ctx.status = 200;
    await next();
  },

  downloadFile : async (ctx : AppContext, next) => {
    let google = await (<User>ctx.user).getGoogleDrive();
    let fileId = ctx.params.id;
    ctx.body = google.files.getContent(fileId);
    ctx.status = 200;
    await next();
  }

};