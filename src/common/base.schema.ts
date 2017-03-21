import * as mongoose from "mongoose";
import * as autoIncrement from "mongoose-auto-increment";

const timestamps = require('mongoose-timestamp');

export interface mongooseDocument extends mongoose.Document {
  createdAt : Date;
  updatedAt : Date
}

export class SchemaFactory {
  static getNewSchema(name, fields : mongoose.SchemaDefinition, options? : mongoose.SchemaOptions) : mongoose.Schema {

    let BaseSchema = new mongoose.Schema(fields, options);
    BaseSchema.set('toJSON', {
      transform : function (doc, ret) {
        ret.id = Number.parseInt(ret._id.toString());
        delete ret._id;
        delete ret.__v;
        delete ret.__t;
      },
      virtuals : true
    });

    BaseSchema.plugin(timestamps);
    BaseSchema.plugin(autoIncrement.plugin, {model : name, startAt : 1});

    return BaseSchema;
  }
};