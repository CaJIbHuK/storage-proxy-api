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
    folder : "application/vnd.google-apps.folder",
    gDoc : 'application/vnd.google-apps.document',
    gDraw : 'application/vnd.google-apps.drawing',
    gPresentation : 'application/vnd.google-apps.presentation',
    gSheets : 'application/vnd.google-apps.spreadsheet',
    pdf : 'application/pdf',
    doc : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    png : 'image/png',
    ppt : 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    xlsx : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

  };

  static MIME_TYPE_CONVERSIONS = {
    [GoogleFile.MIME_TYPES.gDoc] : GoogleFile.MIME_TYPES.doc,
    [GoogleFile.MIME_TYPES.gDraw] : GoogleFile.MIME_TYPES.png,
    [GoogleFile.MIME_TYPES.gPresentation] : GoogleFile.MIME_TYPES.ppt,
    [GoogleFile.MIME_TYPES.gSheets] : GoogleFile.MIME_TYPES.xlsx,
    DEFAULT : GoogleFile.MIME_TYPES.pdf
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

  get googleApp() {return /application\/vnd.google-apps/.test(this.mimeType)}

  get exportMimeType() {
    let mimeType = GoogleFile.MIME_TYPE_CONVERSIONS[this.mimeType];
    return mimeType || GoogleFile.MIME_TYPE_CONVERSIONS.DEFAULT;
  }

  toApiFile() : APIFile {
    return {
      id : this.id,
      name : this.name,
      createdAt : new Date(this.createdTime),
      updatedAt : new Date(this.modifiedTime),
      size : this.size,
      folder : this.folder,
      storage : STORAGE_NAME,
      parents : this.parents
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

  private getFieldsPopulationOption(action) {
    let fields = GoogleFile.FIELDS_TO_RETRIEVE;
    if (/list/.test(action)) fields = `files(${fields})`;
    return fields;
  }

  private makeRequest<T>(cb : Function, ...args) : Promise<T> {
    if (args.length) {
      let fieldsPopulation = args[0].fields || [];
      let fileFields = this.getFieldsPopulationOption(cb.name);
      fieldsPopulation.push(fileFields);
      args[0].fields = fieldsPopulation.join(',');
    }
    return promisifyErrRes<T>(cb.bind.apply(cb, [this.service.files].concat(args)));
  }

  list(params : GoogleFileListQuery = {}) : Promise<GoogleFileList> {
    let data = {
      q : params.query || "",
      spaces : GoogleFileAPI.SPACES.drive,
      pageToken : params.page || null,
      pageSize : params.pageSize || 1000,
      fields : ['nextPageToken']
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

  get(id : string) : Promise<GoogleFile> {
    return this.makeRequest<GoogleFile>(this.service.files.get, {fileId : id}).then(file => new GoogleFile(file));
  }

  getContent(id : string) : Readable {
    return this.service.files.get({fileId : id, alt : 'media'}, {encoding : null});
  }

  export(id : string, mimeType : string) : Readable {
    return this.service.files.export({fileId : id, mimeType : mimeType}, {encoding : null});
  }

  create(data : {name? : string, parents? : string[]}) : Promise<GoogleFile> {
    let fileData = {
      resource : {
        name : data.name,
        parents : data.parents || [GoogleFileAPI.ROOT_FOLDER_ID]
      }
    };
    return this.makeRequest<GoogleFile>(this.service.files.create, fileData)
      .then(file => new GoogleFile(file));
  }

  update(id : string, data : {name? : string, parents? : string[], content? : any, mimeType? : string} = {}) : Promise<GoogleFile> {

    let resourceData : {name?, parents?} = {};
    if (data.name) resourceData.name = data.name;
    if (data.parents) resourceData.parents = data.parents;

    let media : {body?, mimeType?} = {};
    if (data.content) media.body = data.content;
    if (data.mimeType) media.mimeType = data.mimeType;

    let dataToUpdate = {
      fileId : id,
      resource : resourceData,
      media : media
    };

    return this.makeRequest<GoogleFile>(this.service.files.update, dataToUpdate).then(file => new GoogleFile(file));
  }

  upload(id : string, data : any) : Promise<GoogleFile> {
    return this.update(id, {content : data});
  }

  download(id : string) : Promise<Readable> {
    return this.get(id)
      .then(file => file.googleApp ? this.export(id, file.exportMimeType) : this.getContent(id));
  }

  async remove(id : string) {
    return this.service.files.delete({fileId : id});
  }
}