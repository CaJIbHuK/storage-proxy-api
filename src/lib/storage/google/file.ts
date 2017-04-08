import {promisifyErrRes} from "lib/promisify";
import {StorageFile, StorageFileAPI, StorageFileList} from "lib/storage/base";
import {APIFile} from "lib/storage/common/file";
import {Readable} from "stream";
const STORAGE_NAME = 'google';

export class GoogleFile implements StorageFile {

  //for query
  static FIELDS : string[] = [
    'id',
    'name',
    'parents',
    'mimeType',
    'trashed',
    'properties',
    'appProperties',
    'createdTime',
    'modifiedTime',
    'size'
  ];

  static FIELDS_TO_RETRIEVE = GoogleFile.FIELDS.join(',');

  static MIME_TYPES = {
    folder : "application/vnd.google-apps.folder"
  };

  id : string;
  name : string;
  parents : any[]; //folders
  trashed : boolean;
  mimeType : string;
  properties : any;
  appProperties : any; //private props for app
  createdTime : string;//date-time RFC3339 2012-06-04T12:00:00-08:00.
  modifiedTime : string;//date-time RFC3339 2012-06-04T12:00:00-08:00.
  size : number;

  constructor(data : any) {
    this.id = data.id;
    this.name = data.name;
    this.mimeType = data.mimeType;
    this.parents = data.parents;
    this.trashed = data.trashed;
    this.properties = data.properties;
    this.appProperties = data.appProperties;
    this.createdTime = data.createdTime;
    this.modifiedTime = data.modifiedTime;
    this.size = data.size;
  }

  get folder() {return this.mimeType === GoogleFile.MIME_TYPES.folder}

  toApiFile() : APIFile {
    return {
      id : this.id,
      name : this.name,
      createdAt : new Date(this.createdTime),
      updatedAt : new Date(this.modifiedTime),
      size : this.size,
      folder : this.folder,
      storage : STORAGE_NAME
    };
  }

}

interface GoogleFileListQuery {
  query? : string;
  pageSize? : number;
  page? : string;
}

interface GoogleFileList extends StorageFileList{
  nextPageToken : string;
}

export class GoogleFileAPI implements StorageFileAPI {

  static ROOT_FOLDER_ID = 'root';

  static SPACES = {
    drive : 'drive'
  };

  constructor(private service : any) {
  }

  private makeRequest<T>(cb, ...args) : Promise<T> {
    return promisifyErrRes<T>(cb.bind.apply(cb, [this.service.files].concat(args)));
  }

//appProperties has { key='additionalID' and value='8e8aceg2af2ge72e78' }
  //'1234567' in parents
  //mimeType != 'application/vnd.google-apps.folder'
  //mimeType = 'application/vnd.google-apps.folder'

  list(params : GoogleFileListQuery = {}) : Promise<GoogleFileList> {
    let data = {
      q : params.query || "",
      spaces : GoogleFileAPI.SPACES.drive,
      pageToken : params.page || null,
      pageSize : params.pageSize || 1000,
      fields : `nextPageToken, ${GoogleFile.FIELDS_TO_RETRIEVE}`
    };
    return this.makeRequest<GoogleFileList>(this.service.files.list, data)
      .then(response => ({
        nextPageToken : response.nextPageToken,
        files : response.files.map(file => new GoogleFile(file))
      }));
  }

  listFolder(folderId : string = GoogleFileAPI.ROOT_FOLDER_ID, params : GoogleFileListQuery = {}) : Promise<GoogleFileList> {
    params.query = (params.query || "").concat(`'${folderId}' in parents`);
    return this.list(params);
  }

  getInfo(id : string) : Promise<GoogleFile> {
    return this.makeRequest<GoogleFile>(this.service.files.get, {fileId : id, fields : GoogleFile.FIELDS_TO_RETRIEVE}).then(file => new GoogleFile(file));
  }

  getContent(id : string) : Readable {
    //TODO export for gdoc files
    return this.service.files.get({fileId : id, alt : 'media'}, {encoding : null});
  }

  create(data : any) : GoogleFile {
    return null;
  }

  update(id : string, data) : GoogleFile {
    return null;
  }

  remove(id : string) {
  }
}