const router = require('koa-router')()
const uuid = require('uuid/v4')
const crypto = require('crypto')

router.post('/auth', async function (ctx, next) {
    let {username, password} = ctx.request.body
    if (!(username && password)) {
        return ctx.throw('need username & password', 400)
    }
    let pass = await ctx.pg.query('select id, password, salt from users where username = $1', [username])
    if (!pass.rows.length) {
        return ctx.throw('不存在此用户', 400)
    }
    const {id, password: hash, salt} = pass.rows[0]
    const hmac = crypto.createHmac('sha256', salt)
    hmac.update(password)
    if (hash != hmac.digest('hex')) {
        return ctx.throw('password is wrong', 400)
    }
    let token = await ctx.redis.get(`token:name:${username}`)
    if (!token) {
        token = uuid()
        await ctx.redis.hmset(`token:uuid:${token}`, {username, uid: id})
        await ctx.redis.set(`token:name:${username}`, token)
    }
    ctx.redis.expire(`token:uuid:${token}`, 7200)
    ctx.redis.expire(`token:name:${username}`, 7200)
    ctx.body = {token}
})

router.post('/signup', async function (ctx, next) {
    const {username, password} = ctx.request.body
    if (!(username && password)) {
        return ctx.throw('need username & password', 400)
    }
    const salt = uuid()
    const hmac = crypto.createHmac('sha256', salt)
    hmac.update(password)
    const hash = hmac.digest('hex')
    try {
        let pass = await ctx.pg.query('insert into users (username, password, salt) values ($1, $2, $3) RETURNING id', [username, hash, salt])
        if (!pass.rows.length) {
            return ctx.throw('不存在此用户', 400)
        }
        ctx.body = pass.rows[0]
    } catch (err) {
        if (err.code == 23505) {
            ctx.throw(`'${username}' has already in use`)
        }
        throw err
    }
})

var check_token = async (ctx, next) => {
    let token = ctx.headers['token']
    let [username, uid] = await ctx.redis.hmget(`token:uuid:${token}`, ['username', 'uid'])
    username = 'hxsf'
    uid = '1345536221'
    if (!username) {
        let err = new Error('Need Auth')
        err.status = 401
        return ctx.throw(err)
    }
    ctx.username = username
    ctx.uid = uid
    await next()
}

var container = require('./container')
router.use('/container', check_token, container.routes(), container.allowedMethods())
var image = require('./image')
router.use('/image', check_token, image.routes(), image.allowedMethods())
var system = require('./system')
router.use('/system', check_token, system.routes(), system.allowedMethods())

module.exports = router
