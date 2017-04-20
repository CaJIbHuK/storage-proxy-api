import {AppContext} from "application";
import {JWT} from "lib/jwt";
import {AuthLib} from 'lib/auth';
import {GoogleApiToken, GoogleDriveAPI} from "lib/storage";
import {userRepo, User, UserAuthInfo} from "handlers/users";

let filterInputData = (data : any) : UserAuthInfo => {
  return {
    email : data.email,
    password : data.password,
    name : data.name
  }
};

let getToken = async (user : User) => JWT.sign(await user.getNewJWTData());

let registerUser = async (data : UserAuthInfo) => {
  let user = await userRepo.create(data);
  user.salt = AuthLib.genSalt();
  user.passwordHash = AuthLib.hash(data.password, user.salt);
  await user.save();
  return user;
};

export const controllers = {

  signup : async (ctx : AppContext, next) => {
    let userInfo = filterInputData(ctx.request.body);
    let validationResult = User.validateAuthInfo(userInfo);
    if (!validationResult.result) ctx.throw(400, {message : validationResult.message});
    let user = await registerUser(userInfo);
    ctx.body = {token : await getToken(user)};
    ctx.status = 200;
    await next();
  },

  signin : async (ctx : AppContext, next) => {
    let authInfo = filterInputData(ctx.request.body);
    let validationResult = User.validateAuthInfo(authInfo);
    if (!validationResult.result) ctx.throw(400, {message : validationResult.message});

    let user = await userRepo.findByEmail(authInfo.email);
    if (!user) ctx.throw(400, 'Invalid `email`');
    let validPassword = AuthLib.validatePassword(authInfo.password, user.salt, user.passwordHash);
    if (!validPassword) ctx.throw(400, {message : 'Invalid `password`'});

    ctx.body = {token : await getToken(user)};

    //TODO remove from here
    if (!user.googleTokens) {
      let g = new GoogleDriveAPI();
      g.requestAccess(user.id);
    }

    ctx.status = 200;
    await next();
  },

  google : async (ctx : AppContext, next) => {
    let userId = Number.parseInt(ctx.request.query.state);
    if (!userId) ctx.throw('Unknown google auth callback');

    let google  = new GoogleDriveAPI();
    let googleTokens : GoogleApiToken = await google.getToken(ctx.request.query.code);

    let user = await userRepo.findById(userId);
    user.googleTokens = googleTokens;
    await user.save();
    ctx.status = 200;
    await next();
  },

};