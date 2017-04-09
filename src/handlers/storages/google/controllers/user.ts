import {AppContext} from "application";
import {User} from "handlers/users";
import {filterObject} from "lib/helpers";

interface FileData {
  name? : string;
  parents? : string[];
}


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
    let file = await google.files.get(fileId).then(file => file.toApiFile());

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
    ctx.body = google.files.download(fileId);
    ctx.status = 200;
    await next();
  },

  createFile : async (ctx : AppContext, next) => {
    let google = await (<User>ctx.user).getGoogleDrive();
    let data = filterObject<FileData>(ctx.request.body, ['name', 'parents']);
    if (!data.name) ctx.throw(400, 'Invalid name');
    ctx.body = await google.files.create(data);
    ctx.status = 200;
    await next();
  },

  updateFile : async (ctx : AppContext, next) => {
    let google = await (<User>ctx.user).getGoogleDrive();
    let fileId = ctx.params.id;
    let data = filterObject<FileData>(ctx.request.body, ['name', 'parents']);
    ctx.body = await google.files.update(fileId, data);
    ctx.status = 200;
    await next();
  },

  uploadFile : async (ctx : AppContext, next) => {
    let google = await (<User>ctx.user).getGoogleDrive();
    let fileId = ctx.params.id;
    ctx.body = await google.files.upload(fileId, ctx.req);
    ctx.status = 200;
    await next();
  },

  removeFile : async (ctx : AppContext, next) => {
    let google = await (<User>ctx.user).getGoogleDrive();
    let fileId = ctx.params.id;
    ctx.body = await google.files.remove(fileId);
    ctx.status = 200;
    await next();
  },

};