import * as jwt from "jsonwebtoken";
import config from "config";

export interface JWTData {
  id : number;
  vers : number;
}

export class JWT {

  static deserializeData(data : JWTData) {
    return {
      id : Number(data.id),
      vers : Number(data.vers)
    }
  }

  static decode(token : string) : JWTData {
    return jwt.decode(token);
  };

  static sign(body : JWTData) {
    return jwt.sign(body, config.app.secret, {expiresIn : `${config.app.token.ttl}s`});
  }

  static verify(token : string) : JWTData | null {
    try {
      let data = jwt.verify(token, config.app.secret);
      if (data) return this.deserializeData(data);
    } catch(err) {
      throw new jwt.JsonWebTokenError("Bad authorization token");
    }
    return null;
  }

}
