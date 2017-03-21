import * as crypto from "crypto";

export class AuthLib {

  static genSalt() : string {
    return crypto.randomBytes(64).toString('hex');
  }

  static hash(password : string, salt : string) {
    let Hash = crypto.createHash('sha256');
    return Hash.update(salt.concat(password)).digest('hex');
  }

  static validatePassword(password : string, salt : string, hash : string) {
    return this.hash(password, salt) === hash;
  }

}