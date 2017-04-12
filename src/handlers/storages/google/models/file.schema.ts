import * as mongoose from "mongoose";
import {SchemaFactory, mongooseDocument} from "common";

export interface IGoogleFileEntry extends mongooseDocument {
  fileId : string;
  key : string;
}

let GoogleFileSchema = SchemaFactory.getNewSchema('GoogleFile', {
  fileId : {type : String, required : true, unique : true},
  key : {type : String},
});

GoogleFileSchema.index({fileId : 1});
export let GoogleFileSchemaModel = mongoose.connection.model<IGoogleFileEntry>('GoogleFile', GoogleFileSchema);



