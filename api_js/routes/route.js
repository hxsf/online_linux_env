const router = require('koa-router')()

const v1 = require('./v1');
router.use('/v1', v1.routes(), v1.allowedMethods())

module.exports = router
