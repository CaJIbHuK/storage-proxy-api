import * as mongoose from "mongoose";
import {SchemaFactory, mongooseDocument} from "common";

export interface IUser extends mongooseDocument {
  name : string;
  email : string;
  salt : string;
  role : string;
  passwordHash : string;
  jwtVersion : number;
  tokens : any;
}
async function v(a) {
  console.dir(this, {depth : 5});
  console.log(a);
  return a;
}

let UserSchema = SchemaFactory.getNewSchema('User', {
  name : {type : String},
  email : {type : String, unique : true, required : true, lowercase: true, trim: true},
  role : {type : String, default : 'user'},
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



