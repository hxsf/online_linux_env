const pg = require('pg')
const url = require('url')

const config = url.parse(process.env.PG_DSN)
const [user, pass=''] = config.auth.split(':');

const pool = new pg.Pool({
    user: user,
    password: pass,
    host: config.hostname,
    port: config.port || '5432',
    database: config.pathname.split('/')[1],
    ssl: false
})

module.exports = pool
