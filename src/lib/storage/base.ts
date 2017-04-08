import {APIFile} from "./common/file";

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
  getInfo(id : string) : Promise<StorageFile>;
  getContent(id : string) : any;
  create(data : any) : StorageFile;
  update(id : string, data) : StorageFile;
  remove(id : string);

}

export interface StorageApiToken {}

export interface StorageAPI {

  files : StorageFileAPI;

  auth(credentials : StorageApiToken) : void;
  requestAccess(userId : number) : void;
  getToken(authCode : string) : Promise<StorageApiToken>;

}


