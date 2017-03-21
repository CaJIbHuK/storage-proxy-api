import * as mongoose from "mongoose";
import {mongooseDocument} from "./base.schema";

export class BaseModel<T extends mongooseDocument> {

  protected _doc : T;

  constructor(doc : T) {
    this._doc = doc;
  }

  get id() {return this._doc._id};
  get createdAt() {return this._doc.createdAt};
  get updatedAt() {return this._doc.updatedAt};

  async modify(data : any) : Promise<this> {
    return Promise.resolve(this._doc.set(data))
      .then(() => this);
  }

  async save(data? : any) : Promise<this> {
    return Promise.resolve(data ? this.modify(data) : this)
      .then(model => model._doc.save())
      .then(() => this);
  }

  async remove() : Promise<any> {
    return Promise.resolve(this._doc.remove());
  }

  toObject() : any {
    return this._doc.toObject();
  }

  toJSON() : any {
    return this._doc.toJSON();
  }

}