import {APIFile} from "./common/file";
import {Readable} from "stream";

export interface StorageFile {
  id : string;
  name : string;

  toApiFile() : APIFile;
}

export interface StorageFileList {
  files : StorageFile[];
}

export interface StorageFileAPI {

  list(query? : any) : Promise<StorageFileList>;
  listFolder(id : string, query? : any) : Promise<StorageFileList>;
  get(id : string) : Promise<StorageFile>;
  create(data : any) : Promise<StorageFile>;
  update(id : string, data : any) : Promise<StorageFile>;
  upload(id : string, data : any) : Promise<StorageFile>;
  download(id : string) : Promise<Readable>;
  remove(id : string);

}

export interface StorageApiToken {}

export interface StorageAPI {

  files : StorageFileAPI;

  auth(credentials : StorageApiToken) : void;
  requestAccess(userId : number) : void;
  getToken(authCode : string) : Promise<StorageApiToken>;

}


