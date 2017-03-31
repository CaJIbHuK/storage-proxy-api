import * as Koa from "koa";
import {JWT} from "lib/jwt";
import {userRepo, User, UserAuthInfo} from "handlers/users";
import {AuthLib} from 'lib/auth';

let getToken = async (user : User) => JWT.sign(user.getNewJWTData());

let registerUser = async (data : UserAuthInfo) => {
  let filtered = {email : data.email, name : data.name, password : data.password};
  let user = await userRepo.create(filtered);
  user.validatePassword(filtered.password);
  user.salt = AuthLib.genSalt();
  user.passwordHash = AuthLib.hash(filtered.password, user.salt);
  await user.save();
  return user;
};

export const controllers = {

  signup : async (ctx : Koa.Context, next) => {
    let userInfo : UserAuthInfo = ctx.request.body;
    let user = await registerUser(userInfo);
    ctx.body = {token : await getToken(user)};
    ctx.status = 200;
    await next();
  }

};