const Redis = require('ioredis');
const debug = require('debug')('api:redis');
const redis = module.exports = new Redis(parseInt(process.env.REDIS_PORT, 10) || 6379, process.env.REDIS_HOST || '127.0.0.1');

redis.on('error', debug)
redis.on('warn', debug)
