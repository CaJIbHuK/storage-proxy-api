import * as Koa from "koa";
import {JWT} from "lib/jwt";
import {userRepo, User, UserAuthInfo} from "handlers/users";
import {AuthLib} from 'lib/auth';

let getToken = async (user : User) => JWT.sign(await user.getNewJWTData());

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
  },

  signin : async (ctx : Koa.Context, next) => {
    let authInfo = <UserAuthInfo>ctx.request.body;
    if (!authInfo.email) ctx.throw(400, {message : 'Invalid `email`'});
    if (!authInfo.password) ctx.throw(400, {message : 'Invalid `password`'});
    let user = await userRepo.findByEmail(authInfo.email);
    if (!user) ctx.throw(400, 'Invalid `password`');
    let validPassword = AuthLib.validatePassword(authInfo.password, user.salt, user.passwordHash);
    if (!validPassword) ctx.throw(400, {message : 'Invalid `password`'});
    ctx.body = {token : await getToken(user)};
    ctx.status = 200;
    await next();
  },

};