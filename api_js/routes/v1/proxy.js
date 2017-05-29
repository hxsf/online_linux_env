const router = require('koa-router')()

router.get('/:name', async (ctx, next) => {
    const { name } = ctx.params
    const all_record = await ctx.redis.hgetall(`gateway:${name}`)
    const expire = Date.now() - 3600000
    const delet_list = []
    const valid = []
    for (const item in all_record) {
        const date = all_record[item]
        if (date < expire) {
            delet_list.push(item)
        } else {
            valid.push(item)
        }
    }
    if (!valid.length) {
        ctx.body = []
        return
    }
    const list = await ctx.redis.mget(valid.map(x => `gateway:${x}`))
    ctx.body = list.map((url, i) => {
        return {
            url: valid[i],
            port: (url.match(/:(\d+)$/) || [])[1]
        }
    })
})

router.post('/', async (ctx, next) => {
    const { name = 'default', port = '80' } = ctx.request.body
    const token = `${name}-${port}`
    const expire = 3600
    await ctx.redis.set(`gateway:${token}`, `${name}:${port}`)
    await ctx.redis.expire(`gateway:${token}`, expire)
    await ctx.redis.hset(`gateway:${name}`, token, Date.now())
    await ctx.redis.expire(`gateway:${name}`, expire)
    ctx.body = { token, expire }
})

router.delete('/:name/:port', async (ctx, next) => {
    const { name, port } = ctx.params
    const token = `${name}-${port}`
    await ctx.redis.hdel(`gateway:${name}`, token)
    await ctx.redis.del(`gateway:${token}`)
    ctx.body = { msg: 'ok' }
})

module.exports = router
