const router = require('koa-router')()

router.get('/info', async function (ctx, next) {
    const info = await ctx.docker.info()
    ctx.body = info
})

router.get('/df', async function (ctx, next) {
    if (ctx.docker.df) {
        var { Containers: info } = await ctx.docker.df()
    } else {
        var info = await ctx.docker.listContainers({all: true})
    }
    ctx.body = info
})

router.get('/images', async function (ctx, next) {
    const images = await ctx.docker.listImages({filters: {label: {'vlab': true}}})
    const info = []
    for (const image of images) {
        const tags = image.RepoTags
        delete image.RepoTags
        for (const name of tags) {
            const { Created: created, Id: id, Size: size } = image
            info.push({ name, created, size, id })
        }
    }
    ctx.body = info
})

module.exports = router
