
export interface StorageFile {}

export interface StorageFileAPI {

  getAll() : Promise<StorageFile[]>;
  get(id : string) : Promise<StorageFile>;
  remove(id : string);

}

export interface StorageApiToken {}

export interface StorageAPI {

  files : StorageFileAPI;

  auth(credentials : StorageApiToken) : void;
  requestAccess(userId : number) : void;
  getToken(authCode : string) : Promise<StorageApiToken>;

}


