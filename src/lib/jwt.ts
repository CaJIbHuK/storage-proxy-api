import * as jwt from "jsonwebtoken";
import config from "config";
import * as moment from "moment";

export interface JWTData {
  id : number;
  vers : number;
  createdAt : number;
}

export class JWT {

  static deserializeData(data : JWTData) {
    return {
      id : Number(data.id),
      vers : Number(data.vers),
      createdAt : Number(data.createdAt)
    }
  }

  static validateToken(tokenData : JWTData, version : number) {
    return (tokenData.vers === version) && (moment(moment.now()).diff(tokenData.createdAt, 'second') < Number(config.app.tokenTTL));
  }

  static decode(token : string) : JWTData {
    return jwt.decode(token);
  };

  static sign(body : JWTData) {
    return jwt.sign(body, config.app.secret);
  }

  static verify(token : string) : JWTData | null {
    let data = jwt.verify(token, config.app.secret);
    if (data) return this.deserializeData(data);
    return null;
  }

}
