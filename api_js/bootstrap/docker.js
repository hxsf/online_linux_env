const dockerode = require('dockerode')
const docker = dockerode(process.env.docker)

module.exports = docker
