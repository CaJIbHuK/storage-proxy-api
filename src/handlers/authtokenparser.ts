import * as Koa from "koa";
import {userRepo} from "handlers/users"
import {JWT} from "lib/jwt";



const tokenParserMiddleware = async (ctx : Koa.Context, next) => {
  let authHeader : string = ctx.request.header['authorization'];
  if (authHeader) {
    let token = authHeader.replace(/Bearer\s+/i,'');
    let tokenData = JWT.verify(token);
    if (tokenData) {
      let user = await userRepo.findById(tokenData.id);
      ctx.user = JWT.validateToken(tokenData, user.jwtVersion) ? user : null;
    }
  }

  ctx.log.debug(ctx.user);
  await next();
};

export default {
  name : 'authtokenparser',
  init : (app) => app.use(tokenParserMiddleware)
};