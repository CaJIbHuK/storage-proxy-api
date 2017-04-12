import {promisifyErrRes} from "lib/promisify";
import {StorageFile, StorageFileAPI, StorageFileList} from "lib/storage/base";
import {APIFile} from "lib/storage/common/file";
import {Readable} from "stream";
const STORAGE_NAME = 'google';

export class GoogleValidationError implements Error {
  name : string = "GoogleValidationError";
  message : string = "Invalid params";
  constructor(message? : string) {
    if (message) this.message = message;
  }
}

export class GoogleRequestError implements Error {
  name : string = "GoogleRequestError";
  message : string = "Error occurred during request to Google";
  status : number = 500;
  constructor(message? : string, status? : number) {
    if (message) this.message = message;
    if (status) this.status = status;
  }
}

export interface IGoogleDriveFileMetaData {
  id? : string;
  name? : string;
  description? : string;
  parents? : any;
  trashed? : boolean;
  mimeType? : string;
  properties? : any;
  appProperties? : any;
}

export interface IGoogleDriveFileMediaData {
  body? : any;
  mimeType? : string;
}

export class GoogleDriveFile implements StorageFile {

  //for query
  static FIELDS : string[] = [
    'id',
    'name',
    'parents',
    'description',
    'mimeType',
    'trashed',
    'properties',
    'appProperties',
    'createdTime',
    'modifiedTime',
    'size'
  ];

  static FIELDS_TO_RETRIEVE = GoogleDriveFile.FIELDS.join(',');

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
    [GoogleDriveFile.MIME_TYPES.gDoc] : GoogleDriveFile.MIME_TYPES.doc,
    [GoogleDriveFile.MIME_TYPES.gDraw] : GoogleDriveFile.MIME_TYPES.png,
    [GoogleDriveFile.MIME_TYPES.gPresentation] : GoogleDriveFile.MIME_TYPES.ppt,
    [GoogleDriveFile.MIME_TYPES.gSheets] : GoogleDriveFile.MIME_TYPES.xlsx,
    DEFAULT : GoogleDriveFile.MIME_TYPES.pdf
  };

  id : string;
  name : string;
  parents : any[]; //folders
  trashed : boolean;
  mimeType : string;
  description : string;
  properties : any;
  appProperties : any; //private props for app
  createdTime : string;//date-time RFC3339 2012-06-04T12:00:00-08:00.
  modifiedTime : string;//date-time RFC3339 2012-06-04T12:00:00-08:00.
  size : number;

  constructor(data : any) {
    this.id = data.id;
    this.name = data.name;
    this.mimeType = data.mimeType;
    this.description = data.description;
    this.parents = data.parents;
    this.trashed = data.trashed;
    this.properties = data.properties;
    this.appProperties = data.appProperties;
    this.createdTime = data.createdTime;
    this.modifiedTime = data.modifiedTime;
    this.size = data.size;
  }

  get encrypted() : boolean {return this.appProperties && this.appProperties.encrypted;}

  get folder() : boolean {return this.mimeType === GoogleDriveFile.MIME_TYPES.folder}

  get googleApp() : boolean {return /application\/vnd.google-apps/.test(this.mimeType)}

  get exportMimeType() : string {
    let mimeType = GoogleDriveFile.MIME_TYPE_CONVERSIONS[this.mimeType];
    return mimeType || GoogleDriveFile.MIME_TYPE_CONVERSIONS.DEFAULT;
  }

  toApiFile() : APIFile {
    return {
      id : this.id,
      name : this.name,
      description : this.description,
      createdAt : new Date(this.createdTime),
      updatedAt : new Date(this.modifiedTime),
      size : this.size,
      folder : this.folder,
      storage : STORAGE_NAME,
      parents : this.parents
    };
  }

}

export interface GoogleDriveFileListQuery {
  query? : string;
  pageSize? : number;
  page? : string;
}

export interface GoogleDriveFileList extends StorageFileList{
  nextPageToken : string;
  files : GoogleDriveFile[];
}

export class GoogleDriveFileAPI implements StorageFileAPI {

  static ROOT_FOLDER_ID = 'root';

  static SPACES = {
    drive : 'drive'
  };

  constructor(private service : any) {
  }

  private getFieldsPopulationOption(action) {
    let fields = GoogleDriveFile.FIELDS_TO_RETRIEVE;
    if (/list/.test(action)) fields = `files(${fields})`;
    return fields;
  }

  private makeRequest<T>(cb : Function, ...args) : Promise<T> {
    if (args.length && !args[0].noPopulation) {
      let fieldsPopulation = args[0].fields || [];
      let fileFields = this.getFieldsPopulationOption(cb.name);
      fieldsPopulation.push(fileFields);
      args[0].fields = fieldsPopulation.join(',');
    }
    if (args.length) delete args[0].noPopulation;
    return promisifyErrRes<T>(cb.bind.apply(cb, [this.service.files].concat(args)))
      .catch(err => {throw new GoogleRequestError(err.message, err.code)});
  }

  list(params : GoogleDriveFileListQuery = {}) : Promise<GoogleDriveFileList> {
    let data = {
      q : params.query || "",
      spaces : GoogleDriveFileAPI.SPACES.drive,
      pageToken : params.page || null,
      pageSize : params.pageSize || 1000,
      fields : ['nextPageToken']
    };
    return this.makeRequest<GoogleDriveFileList>(this.service.files.list, data)
      .then(response => ({
        nextPageToken : response.nextPageToken,
        files : response.files.map(file => new GoogleDriveFile(file))
      }));
  }

  listFolder(folderId : string = GoogleDriveFileAPI.ROOT_FOLDER_ID, params : GoogleDriveFileListQuery = {}) : Promise<GoogleDriveFileList> {
    params.query = (params.query || "").concat(`'${folderId}' in parents`);
    return this.list(params);
  }

  get(id : string) : Promise<GoogleDriveFile> {
    return this.makeRequest<GoogleDriveFile>(this.service.files.get, {fileId : id}).then(file => new GoogleDriveFile(file));
  }

  getContent(id : string) : Readable {
    return this.service.files.get({fileId : id, alt : 'media'}, {encoding : null});
  }

  export(id : string, mimeType : string) : Readable {
    return this.service.files.export({fileId : id, mimeType : mimeType}, {encoding : null});
  }

  generateId() : Promise<string> {
    return this.makeRequest<{ids : string[]}>(this.service.files.generateIds,{noPopulation : true, count : 1})
      .then(result => result.ids[0]);
  }

  create(data : IGoogleDriveFileMetaData = {}) : Promise<GoogleDriveFile> {
    if (!data.name) throw new GoogleValidationError("Property `name` is required.");
    let fileData = {resource : data};
    if (!fileData.resource.parents) fileData.resource.parents = [GoogleDriveFileAPI.ROOT_FOLDER_ID];
    return this.makeRequest<GoogleDriveFile>(this.service.files.create, fileData)
      .then(file => new GoogleDriveFile(file));
  }

  update(id : string, resourceData : IGoogleDriveFileMetaData = {}, mediaData : IGoogleDriveFileMediaData = {}) : Promise<GoogleDriveFile> {
    let dataToUpdate = {
      fileId : id,
      resource : resourceData,
      media : mediaData
    };
    return this.makeRequest<GoogleDriveFile>(this.service.files.update, dataToUpdate).then(file => new GoogleDriveFile(file));
  }

  upload(id : string, data : any) : Promise<GoogleDriveFile> {
    return this.update(id,{},{body : data});
  }

  download(id : string) : Promise<Readable> {
    return this.get(id)
      .then(file => file.googleApp ? this.export(id, file.exportMimeType) : this.getContent(id));
  }

  async remove(id : string) {
    return this.service.files.delete({fileId : id});
  }
}