const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const dotenv = require('dotenv');
const config = dotenv.config().parsed;
const redis = require('./redis');
const docker = require('./docker');
const pg = require('./pg');

app.context.redis = redis
app.context.pg = pg
app.context.docker = docker

app.use(bodyparser);
app.use(json());
app.use(logger());

var debug = require('debug')('api:server');
var http = require('http');
/**
 * Get port from environment and store in Express.
 */
var port = parseInt(config.PORT, 10) || '3000';
var host = config.HOST || '127.0.0.1';
/**
 * Create HTTP server.
 */
var server = http.createServer(app.callback());
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, host);
server.on('error', onError);
server.on('listening', onListening);
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}
	var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
	// handle specific listen errors with friendly messages
	switch (error.code) {
	case 'EACCES':
		console.error(bind + ' requires elevated privileges');
		process.exit(1);
		break;
	case 'EADDRINUSE':
		console.error(bind + ' is already in use');
		process.exit(1);
		break;
	default:
		throw error;
	}
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
	var addr = server.address();
	var bind = 'http://' + addr.address + ':' + addr.port;
	debug('Listening on ' + bind);
}

module.exports = {app, io: {}};
