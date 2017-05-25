const {app, io} = require('./bootstrap/init')

const routes = require('./routes/route')

routes.get('/', async (ctx) => {
    ctx.body = {route: '/'}
})
routes.get('/:id', async (ctx) => {
    ctx.body = {route: '/:id', params: ctx.params}
})

app.use(async (ctx, next) => {
    try {
        await next()
    } catch (e) {
        ctx.status = e.status || 500
        console.log(e)
        ctx.body = {msg: e.message}
    }
})

app.use(routes.routes(), routes.allowedMethods())

// catch 404 and forward to error handler
app.use(async function (ctx, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
// error handler
app.use(async (err, ctx, next) => {
	// render the error page
    ctx.status = err.status || 500
    ctx.body = {msg: err.message}
});
