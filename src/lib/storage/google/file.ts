import {promisifyErrRes} from "lib/promisify";
import {StorageFile, StorageFileAPI} from "lib/storage/base";

export class GoogleFile implements  StorageFile {

}

export class GoogleFileAPI implements StorageFileAPI {

  constructor(private service : any) {}

  getAll() : Promise<GoogleFile[]> {
    return promisifyErrRes(this.service.files.list);
  }

  get(id : string) : Promise<GoogleFile> {
    return null;
  }

  remove(id : string) : void {

  }

}