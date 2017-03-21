import * as mongoose from "mongoose";
import {SchemaFactory, mongooseDocument} from "../../../../common";

export interface IUser extends mongooseDocument {
  name : String;
  email : String;
  salt : String;
  passwordHash : String;
  jwtVersion : Number;
  tokens : any;
}


let UserSchema = SchemaFactory.getNewSchema('User', {
  name : {type : String},
  email : {type : String, unique : true, required : true, lowercase: true, trim: true},
  salt : String,
  passwordHash : String,
  jwtVersion : {
    type : Number,
    default : 0
  },
  tokens : {}
});

UserSchema.index({email : 1});
export let UserSchemaModel = mongoose.connection.model<IUser>('User', UserSchema);



