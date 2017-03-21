import * as mongoose from "mongoose";
import * as autoIncrement from "mongoose-auto-increment";
import config from "../config";

export const connect = () => {
  mongoose.connect(config.db.uri, config.db.options);
  autoIncrement.initialize(mongoose.connection);
};