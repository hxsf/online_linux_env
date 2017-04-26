const router = require('koa-router')()
const uuid = require('uuid/v4');

router.post('/auth', async function (ctx, next) {
    let {username, password} = ctx.request.body
    if (!(username && password)) {
        return ctx.throw('need username & password', 400)
    }
    let token = await ctx.redis.get(`token:name:${username}`)
    if (!token) {
        token = uuid()
        await ctx.redis.set(`token:uuid:${token}`, username)
        await ctx.redis.set(`token:name:${username}`, token)
    }
    ctx.redis.expire(`token:uuid:${token}`, 7200)
    ctx.redis.expire(`token:name:${username}`, 7200)
    ctx.body = {token}
})

var check_token = async (ctx, next) => {
    let token = ctx.headers['token']
    let username = await ctx.redis.get(`token:uuid:${token}`)
    if (!username) {
        let err = new Error('Need Auth')
        err.status = 401
        return ctx.throw(err)
    }
    ctx.username = username
    await next()
}

var container = require('./container')
router.use('/container', check_token, container.routes(), container.allowedMethods())
var image = require('./image')
router.use('/image', check_token, image.routes(), image.allowedMethods())

module.exports = router
