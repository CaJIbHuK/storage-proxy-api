import {AppContext} from "application";
import {User} from "handlers/users";
import {filterObject} from "lib/helpers";

interface FileData {
  name? : string;
  parents? : string[];
}

const FIELDS = ['name', 'parents'];

export const controllers = {

  getFiles : async (ctx : AppContext, next) => {
    let google = await (<User>ctx.user).getGoogleDrive();
    ctx.body = await google.listFolder();
    ctx.status = 200;
    await next();
  },

  getFile : async (ctx : AppContext, next) => {
    let google = await (<User>ctx.user).getGoogleDrive();
    let fileId = ctx.params.id;
    let file = await google.get(fileId);
    if (!file) ctx.throw(404, 'File not found');
    ctx.body = file.folder ? await google.listFolder(file.id) : file;
    ctx.status = 200;
    await next();
  },

  downloadFile : async (ctx : AppContext, next) => {
    let google = await (<User>ctx.user).getGoogleDrive();
    let fileId = ctx.params.id;
    let file = await google.get(fileId);
    if (!file) ctx.throw(404, 'File not found');
    ctx.body = await google.download(fileId);
    ctx.status = 200;
    await next();
  },

  createFile : async (ctx : AppContext, next) => {
    let google = await (<User>ctx.user).getGoogleDrive();
    let encrypt = ctx.request.body.encrypt;
    let data = filterObject<FileData>(ctx.request.body, FIELDS);
    if (!data.name) ctx.throw(400, 'Invalid name');
    ctx.body = await google.create(data, encrypt);
    ctx.status = 200;
    await next();
  },

  updateFile : async (ctx : AppContext, next) => {
    let google = await (<User>ctx.user).getGoogleDrive();
    let fileId = ctx.params.id;
    let file = await google.get(fileId);
    if (!file) ctx.throw(404, 'File not found');
    let encrypt = ctx.request.body.encrypt;
    let data = filterObject<FileData>(ctx.request.body, FIELDS);
    ctx.body = await google.update(fileId, data, encrypt);
    ctx.status = 200;
    await next();
  },

  uploadFile : async (ctx : AppContext, next) => {
    let google = await (<User>ctx.user).getGoogleDrive();
    let fileId = ctx.params.id;
    let file = await google.get(fileId);
    if (!file) ctx.throw(404, 'File not found');
    ctx.body = await google.upload(fileId, ctx.req);
    ctx.status = 200;
    await next();
  },

  removeFile : async (ctx : AppContext, next) => {
    let google = await (<User>ctx.user).getGoogleDrive();
    let fileId = ctx.params.id;
    ctx.body = await google.remove(fileId);
    ctx.status = 200;
    await next();
  },

};