const router = require('koa-router')()

router.get('/', async (ctx, next) => {
    let all_ids = await ctx.redis.smembers('containers::all')
    if (!all_ids.length) {
        const containers = await ctx.docker.listContainers({all: true, filters: {label: {['vlab']: true}}})
        all_ids = containers.map(x => x.Id)
        await ctx.redis.sadd('containers::all', all_ids)
        await ctx.redis.expire('containers::all', 7200)
    }
    const ids_set = new Set(all_ids)
    const {rows: my_containers} = await ctx.pg.query('select id, name, remark, containers_users.uid from containers left join containers_users on containers.id = containers_users.cid where uid = $1', [ctx.uid])
    const my_ids = my_containers.map(x => x.id)
    let list = [], deleted_list = []
    for (let container of my_containers) {
        if (!ids_set.has(container.id)) {
            continue
        }
        try {
            var {Id: id, Created: created, Config: {Image: image}, State: State, Name: real_name} = await ctx.docker.getContainer(container.id).inspect()
        } catch (err) {
            deleted_list.push(container.id)
            continue
        }
        let {Status: status} = State
        let state = State
        let {name, remark} = container
        list.push({id, image, created, remark, name, status, state, real_name})
    }
    if (deleted_list.length) {
        await ctx.pg.query('delete from containers where id in ($1)', [deleted_list])
        await ctx.pg.query('delete from containers_users where cid in ($1)', [deleted_list])
        await ctx.redis.srem('containers::all', deleted_list)
        await ctx.redis.expire('containers::all', 7200)
    }
    ctx.body = list
})
router.get('/:id', async (ctx, next) => {
    try {
        const constainer = await ctx.docker.getContainer(ctx.params.id)
        let {Id: id, Created: created, Config: {Image: image}, State: State, Name: real_name} = await constainer.inspect()
        let {Status: status} = State
        let state = State
        let {rows} = await ctx.pg.query('select name, remark from containers where id = $1', [id])
        let {name = '', remark = ''} = rows[0] || {}
        ctx.body = {id, image, created, name, remark, status, state, real_name}
    } catch (e) {
        ctx.throw(e)
    }
})
router.post('/', async (ctx, next) => {
    let {image, name, remark=''} = ctx.request.body
    if (!(image && image.startsWith(process.env.IMAGE_PREFIX))) {
        return ctx.throw('所选模版不可用', 400)
    }
    let info = await ctx.docker.createContainer({
        Image: image,
        AttachStdout: false,
        AttachStderr: false,
        Labels: {
            'vlab': '',
        },
        HostConfig: {
            NetworkMode: 'online_linux_env_gateway',
        },
    })
    // const network = await ctx.docker.getNetwork('online_linux_env_gateway')
    // console.log('id', info.id, network.connect)
    // await network.connect({Container: info.id})
    const client = await ctx.pg.connect()
    await client.query('begin')
    try {
        await client.query('insert into containers (id, name, remark) values ($1, $2, $3);',[info.id, name, remark])
        await client.query('insert into containers_users (cid,  uid) values ($1, $2);', [info.id, ctx.uid])
        await client.query('commit')
        await ctx.redis.sadd('containers::all', info.id)
        await ctx.redis.expire('containers::all', 7200)
        ctx.body = {id: info.id}
        ctx.status = 201
    } catch (err) {
        await client.query('rollback')
        await info.remove()
        ctx.throw(err)
    } finally {
        client.release()
    }
})

router.delete('/:id', async (ctx, next) => {
    let info
    try {
        info = await ctx.docker.getContainer(ctx.params.id)
        await info.remove()
    } catch (e) {
        return ctx.throw(e)
    }
    const client = await ctx.pg.connect()
    await client.query('begin')
    try {
        await client.query('delete from containers where id = $1',[info.id])
        const uids = await client.query('delete from containers_users where cid = $1 RETURNING uid', [info.id])
        let commands = []
        for (const {uid} of uids.rows) {
            commands.push(['srem', `containers:${ctx.uid}`, info.id])
        }
        await ctx.redis.multi(commands).exec()
        await client.query('commit') 
        ctx.status = 200
        ctx.body = {msg: 'ok'}
    } catch (err) {
        await client.query('rollback')
        ctx.throw(err)
    } finally {
        client.release()
    }
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
