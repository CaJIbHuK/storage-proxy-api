let init = async(ctx, next) => {
  ctx.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  await next();
};

export default {
  name : 'nocache',
  init : (app) => app.use(init)
};