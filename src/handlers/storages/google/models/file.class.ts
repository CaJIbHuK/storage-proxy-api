import {Readable} from "stream";
import {BaseModel, BaseRepo} from "common";
import {GoogleApiToken, GoogleDriveAPI, GoogleDriveFile, IGoogleDriveFileMetaData, IGoogleDriveFileMediaData, GoogleDriveFileListQuery} from "lib/storage/google";
import {APIFile} from "lib/storage/common/file";
import {Encryptor, EncryptorAction} from "lib/encryptor";
import {IGoogleFileEntry, GoogleFileSchemaModel} from "./file.schema";

class GoogleFile extends BaseModel<IGoogleFileEntry> {
  get fileId() {return this._doc.fileId};
  get key() {return this._doc.key};
  set key(val) {this._doc.key = val};
}

class GoogleFileRepo extends BaseRepo<GoogleFile> {

  findByFileId(fileId : string) {
    return super.findOne({fileId : fileId});
  }

}

export const googleFileRepo = new GoogleFileRepo(GoogleFileSchemaModel, GoogleFile);


export class GoogleFileManager {

  static FIELDS_TO_ENCRYPT = [
    'name',
    'description'
  ];

  private fileRepo : GoogleFileRepo;
  googleDrive : GoogleDriveAPI;

  constructor(token : GoogleApiToken) {
    this.fileRepo = googleFileRepo;
    this.googleDrive = new GoogleDriveAPI(token);
  }

  private async encdecMeta(file : GoogleDriveFile, action : EncryptorAction) : Promise<GoogleDriveFile> {
    let apiFile = await this.fileRepo.findByFileId(file.id);
    if (!apiFile) return file;
    return Encryptor.encdecFields<GoogleDriveFile>(apiFile.key, file, GoogleFileManager.FIELDS_TO_ENCRYPT, action);
  }

  private async createFileEntry(fileId : string) {
    let fileEntry = await this.fileRepo.create({fileId : fileId, key : Encryptor.genPassword()});
    return fileEntry.save();
  }

  async listFolder(folderId? : string, params? : GoogleDriveFileListQuery) : Promise<{nextPage? : string, files? : APIFile[]}> {
    let fileList = await this.googleDrive.files.listFolder(folderId, params);
    if (!fileList || !fileList.files) return {files : []};
    let filesPromises = fileList.files.map(file => file.encrypted ? this.encdecMeta(file, EncryptorAction.decrypt) : file);
    return Promise.all(filesPromises).then(files => ({nextPage : fileList.nextPageToken, files : files.map(f => f.toApiFile())}));
  }

  async get(fileId : string) : Promise<APIFile> {
    let file = await this.googleDrive.files.get(fileId);
    if (!file) return null;
    if (file.encrypted) file = await this.encdecMeta(file, EncryptorAction.decrypt);
    return file.toApiFile();
  }

  async create(data : {folder? : boolean, encrypted? : boolean} & IGoogleDriveFileMetaData) : Promise<APIFile> {
    if (data.encrypted) {
      let fileId = await this.googleDrive.files.generateId();
      let fileEntry = await this.createFileEntry(fileId);
      data = await Encryptor.encdecFields<IGoogleDriveFileMetaData>(fileEntry.key, data, GoogleFileManager.FIELDS_TO_ENCRYPT, EncryptorAction.encrypt);
      data.id = fileId;
      data.appProperties = Object.assign({}, data.appProperties, {encrypted : true});
    }
    if (data.folder) data.mimeType = GoogleDriveFile.MIME_TYPES.folder;
    let createdFile = await this.googleDrive.files.create(data);
    if (createdFile.encrypted) createdFile = await this.encdecMeta(createdFile, EncryptorAction.decrypt);
    return createdFile.toApiFile();
  }

  async update(fileId : string, resourceData : {encrypted? : boolean} & IGoogleDriveFileMetaData = {}) {
    let fileEntry = await this.fileRepo.findByFileId(fileId);
    if (!fileEntry && resourceData.encrypted) fileEntry = await this.createFileEntry(fileId);
    if (fileEntry) {
      let file = await this.googleDrive.files.get(fileId);
      if (file.encrypted || resourceData.encrypted) {
        resourceData  = await Encryptor.encdecFields<IGoogleDriveFileMetaData>(fileEntry.key, resourceData, GoogleFileManager.FIELDS_TO_ENCRYPT, EncryptorAction.encrypt);
        resourceData.appProperties = Object.assign({}, resourceData.appProperties, {encrypted : true});
      }
    }

    let updatedFile = await this.googleDrive.files.update(fileId, resourceData);
    if (updatedFile.encrypted) updatedFile = await this.encdecMeta(updatedFile, EncryptorAction.decrypt);
    return updatedFile.toApiFile();
  }

  async upload(fileId : string, data : Readable) : Promise<APIFile> {
    let fileEntry = await this.fileRepo.findByFileId(fileId);
    if (fileEntry) {
      let file = await this.googleDrive.files.get(fileId);
      if (file.encrypted) {
        let encryptor = new Encryptor(fileEntry.key);
        let uploadedFile = await this.googleDrive.files.upload(fileId, data.pipe(encryptor.cipher));
        return uploadedFile.toApiFile();
      }
    }
    let uploadedFile = await this.googleDrive.files.upload(fileId, data);
    return uploadedFile.toApiFile();
  }

  async download(fileId : string) {
    let fileEntry = await this.fileRepo.findByFileId(fileId);
    if (fileEntry) {
      let file = await this.googleDrive.files.get(fileId);
      if (file.encrypted) {
        let encryptor = new Encryptor(fileEntry.key);
        return this.googleDrive.files.download(fileId).then(stream => stream.pipe(encryptor.decipher));
      }
    }

    return this.googleDrive.files.download(fileId);
  }

  remove(fileId : string) : Promise<void> {
    return this.googleDrive.files.remove(fileId);
  }

}
