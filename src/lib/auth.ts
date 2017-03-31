import * as crypto from "crypto";

export class AuthLib {

  static genSalt() : String {
    return crypto.randomBytes(64).toString('hex');
  }

  static hash(password : String, salt : String) {
    let Hash = crypto.createHash('sha256');
    return Hash.update(salt.concat(password.toString())).digest('hex');
  }

  static validatePassword(password : String, salt : String, hash : String) {
    return this.hash(password, salt) === hash;
  }

}