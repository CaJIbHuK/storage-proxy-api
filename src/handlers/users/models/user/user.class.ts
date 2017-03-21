import {BaseModel, BaseRepo} from "../../../../common";
import {UserSchemaModel, IUser} from "./user.schema";

const MIN_PASSWORD_LENGTH = 8;

export interface UserAuthInfo {
  email : string;
  password : string;
  name? : string;
}

export class User extends BaseModel<IUser> {

  get id() {return this._doc._id};

  get email() {return this._doc.email};
  set email(email) {this._doc.email = email};

  get name() {return this._doc.name};
  set name(name) {this._doc.name = name};

  get jwtVersion() {return this._doc.jwtVersion};
  set jwtVersion(ver) {this._doc.jwtVersion = ver;};

  get passwordHash() {return this._doc.passwordHash};
  set passwordHash(hash) {this._doc.passwordHash = hash;};

  get salt() {return this._doc.salt};
  set salt(salt) {this._doc.salt = salt;};

  validatePassword(password) {
    if (!password) return this._doc.invalidate('password', 'Password is required');
    if (password.length < MIN_PASSWORD_LENGTH) return this._doc.invalidate('password', 'Password must be at least  ' + MIN_PASSWORD_LENGTH + ' chars long.');
    return true;
  }

  getNewJWTData() : any {
    return {
      id : this.id,
      vers : this.jwtVersion,
      createdAt : new Date().getTime()
    }
  }

}

class UserRepo extends BaseRepo<User> {}
export const userRepo = new UserRepo(UserSchemaModel, User);
