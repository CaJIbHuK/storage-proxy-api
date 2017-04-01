import {BaseModel, BaseRepo, ValidationResult} from "common";
import {JWTData} from "lib/jwt";
import {GoogleApiToken} from "lib/googleApi";
import {UserSchemaModel, IUser} from "./user.schema";

const MIN_PASSWORD_LENGTH = 8;
const MAX_EMAIL_LENGTH = 100;
const EMAIL_REGEXP = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/i;

export interface UserAuthInfo {
  email : string;
  password : string;
  name? : string;
}

export class User extends BaseModel<IUser> {

  get id() {return this._doc._id};

  get email() {return this._doc.email};
  set email(email) {this._doc.email = email};

  get role() {return this._doc.role};

  get name() {return this._doc.name};
  set name(name) {this._doc.name = name};

  get jwtVersion() {return this._doc.jwtVersion};
  set jwtVersion(ver) {this._doc.jwtVersion = ver;};

  get passwordHash() {return this._doc.passwordHash};
  set passwordHash(hash) {this._doc.passwordHash = hash;};

  get salt() {return this._doc.salt};
  set salt(salt) {this._doc.salt = salt;};

  get googleTokens() {return this._doc.tokens.google};
  set googleTokens(tokens : GoogleApiToken) {
    if (!this._doc.tokens) this._doc.tokens = {};
    this._doc.tokens.google = tokens;
  };

  async getNewJWTData() : Promise<JWTData> {
    this.jwtVersion = this.jwtVersion + 1;
    await this.save();
    return {
      id : this.id,
      vers : this.jwtVersion
    }
  };

  //========FORMATTER==========//

  static formatUser(user : User) : Object {
    return {
      id : user.id,
      email : user.email,
      name : user.name
    };
  }

  static formatAdmin(user : User) : Object {
    return user.toObject();
  }

  //========VALIDATION==========//

  static validateAuthInfo(authInfo : UserAuthInfo) : ValidationResult {
    let validators : (() => ValidationResult)[] = [
      this.validateEmail.bind(this, authInfo.email),
      this.validatePassword.bind(this, authInfo.password),
    ];

    for(let validator of validators) {
      let validation = validator();
      if (!validation.result) return validation;
    }
    return {result : true};
  };

  static validatePassword(password : string) : ValidationResult {
    if (!password) return {result : false, message : 'Password cannot be empty'};
    if (password.length < MIN_PASSWORD_LENGTH) return {result : false, message : `Password must be at least ${MIN_PASSWORD_LENGTH} chars long.`};
    return {result : true};
  };

  static validateEmail(email : string) : ValidationResult {
    if (!email) return {result : false, message : "Email cannot be empty"};
    if (email.length > MAX_EMAIL_LENGTH) return {result : false, message : "Email is too long"};
    if (!EMAIL_REGEXP.test(email)) return {result : false, message : "Invalid email"};
    return {result : true};
  };

}

class UserRepo extends BaseRepo<User> {

  findByEmail(email : string) {
    return super.findOne({email : email});
  }

}
export const userRepo = new UserRepo(UserSchemaModel, User);
