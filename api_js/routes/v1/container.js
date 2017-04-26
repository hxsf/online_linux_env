const router = require('koa-router')()

router.get('/', async (ctx, next) => {
    let containers = await ctx.docker.listContainers({all: true, filters: {label: {[`own:${ctx.username}`]: true}}})
    let list = []
    for (let container of containers) {
        let {Id: id, Image: image, Status: status, State: state} = container
        let created = (new Date(container.Created * 1000)).toLocaleString()
        let name = container.Names && container.Names.length && container.Names[0] || ''
        list.push({id, image, created, name, status, state})
    }
    ctx.body = list
})
router.get('/:id', async (ctx, next) => {
    try {
        let {Id, Name} = await ctx.docker.getContainer(ctx.params.id).inspect()
        ctx.body = {Id, Name}
    } catch (e) {
        ctx.throw(e)
    }
})
router.post('/', async (ctx, next) => {
    let {image, name} = ctx.request.body
    if (!(image && image.startsWith(process.env.IMAGE_PREFIX))) {
        return ctx.throw('所选模版不可用', 400)
    }
    let info = await ctx.docker.createContainer({
        Image: image,
        AttachStdout: false,
        AttachStderr: false,
        Labels: {
            'vlab-': '',
            [`own:${ctx.username}`]: '',
        }
    })
    ctx.body = {id: info.id}
    ctx.status = 201
})

router.delete('/:id', async (ctx, next) => {
    try {
        let info = await ctx.docker.getContainer(ctx.params.id).remove()
    } catch (e) {
        ctx.throw(e)
    }
    ctx.status = 200
    ctx.body = {msg: 'ok'}
})

router.put('/:id', async (ctx, next) => {
    let {name} = ctx.request.body
    if (!name) {
        ctx.throw(400)
    }
    try {
        let info = await ctx.docker.getContainer(ctx.params.id).rename({name})
    } catch (e) {
        ctx.throw(e)
    }
    ctx.status = 200
    ctx.body = {msg: 'ok'}
})

router.get('/:id/start', async (ctx, next) => {
    console.log('start');
    try {
        let info = await ctx.docker.getContainer(ctx.params.id).start()
        ctx.body = (await ctx.docker.getContainer(ctx.params.id).inspect()).State
        ctx.status = 200
    } catch (e) {
        ctx.throw(e)
    }
})

router.get('/:id/stop', async (ctx, next) => {
    console.log('stop');
    try {
        let info = await ctx.docker.getContainer(ctx.params.id).stop()
        ctx.body = (await ctx.docker.getContainer(ctx.params.id).inspect()).State
        ctx.status = 200
    } catch (e) {
        ctx.throw(e)
    }
})

module.exports = router
