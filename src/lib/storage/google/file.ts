import {promisifyErrRes} from "lib/promisify";
import {StorageFile, StorageFileAPI} from "lib/storage/base";

export class GoogleFile implements  StorageFile {

}

export class GoogleFileAPI implements StorageFileAPI {

  constructor(private service : any) {}

  async getAll() : Promise<GoogleFile[]> {
    return promisifyErrRes<GoogleFile[]>(this.service.files.list.bind(this.service.files));
  }

  get(id : string) : any {
    return this.service.files.get({fileId : id, alt : 'media'}, {encoding : null});
  }

  remove(id : string) : void {

  }

}