import * as Router from "koa-router";

export const mount =
  (api : Router, prefix : string, router : Router) =>
    api.use(prefix, router.routes(), router.allowedMethods());

