let init = async(ctx, next) => {
  ctx.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  await next();
};

export const nocache = {
  name : 'nocache',
  init : (app) => app.use(init)
};