import {APIFile} from "./common/file";
import {Readable} from "stream";

export class StorageFileProperties {
  encrypted : boolean;
  constructor(data : any = {}) {
    this.encrypted = data.encrypted === 'true';
  }
}

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
  requestAccess(userId : number) : string; //retruns url
  getToken(authCode : string) : Promise<StorageApiToken>;

}


