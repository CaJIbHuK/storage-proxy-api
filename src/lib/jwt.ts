import * as jwt from "jsonwebtoken";
import config from "config";
import {promisifyErrRes} from "./promisify";

export class JWT {

  static decode(token) {
    return promisifyErrRes<any>(jwt.decode.bind(JWT, token))
  };

  static async sign(body) {
    return jwt.sign(body, config.app.secret);
  }

  static verify(token) {
    return promisifyErrRes<any>(jwt.verify.bind(JWT, token, config.app.secret))
  }

}
