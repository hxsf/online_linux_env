const router = require('koa-router')()

router.get('/', async (ctx, next) => {
    let images = await ctx.docker.listImages({filters: {label: {'vlab': true}}})
    let list = []
    for (let image of images) {
        list.push(...image.RepoTags)
    }
    ctx.body = list
})

module.exports = router
