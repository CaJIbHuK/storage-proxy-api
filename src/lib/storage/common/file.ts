
export interface APIFile {

  id : string;
  name : string;
  description : string;
  encrypted : boolean;
  root : boolean;
  size : number;
  folder : boolean;
  mimeType : string;
  createdAt : Date;
  updatedAt : Date;
  storage : string;
  parents : string[];
}