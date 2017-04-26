const xterm = require('xterm');
require('xterm/dist/xterm.css');
const attach = require('./attach');
const fit = require('./fit');

attach(xterm);
fit(xterm);
module.exports = xterm;
