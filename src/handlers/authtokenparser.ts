import {AppContext} from "application";
import {User, userRepo} from "handlers/users"
import {JWT} from "lib/jwt";



const tokenParserMiddleware = async (ctx : AppContext, next) => {
  let authHeader : string = ctx.request.header['authorization'];
  if (authHeader) {
    let token = authHeader.replace(/Bearer\s+/i,'');
    let tokenData = JWT.verify(token);
    if (tokenData) {
      let user = await userRepo.findById(tokenData.id);
      ctx.user = tokenData.vers === user.jwtVersion ? user : null;
    }
  }

  await next();
};

export default {
  name : 'authtokenparser',
  init : (app) => app.use(tokenParserMiddleware)
};