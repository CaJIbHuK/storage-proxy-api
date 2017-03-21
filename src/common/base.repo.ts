import * as mongoose from "mongoose";

export class BaseRepo<T> {

  private _model : mongoose.Model<mongoose.Document>;
  private _cls : any;

  constructor(schemaModel : mongoose.Model<mongoose.Document>, cls : any) {
    this._model = schemaModel;
    this._cls = cls;
  }

  async create(...args) : Promise<T> {
    return Promise.resolve(this._model.create.apply(this._model, args))
      .then(doc => new this._cls(doc));
  }

  async find(...args) : Promise<T[]> {
    return Promise.resolve((this._model.find.apply(this._model, args)))
      .then(docs => docs.map(doc => new this._cls(doc)));
  }

  async findOne(...args) : Promise<T> {
    return Promise.resolve((this._model.findOne.apply(this._model, args)))
      .then(doc => doc && new this._cls(doc));
  }

  async findById(id) : Promise<T> {
    return Promise.resolve(this._model.findById(id))
      .then(doc => doc && new this._cls(doc));
  }

}
