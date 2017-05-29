const dockerode = require('dockerode')
const docker = dockerode(process.env.docker);

(async function () {
    const list = await docker.listNetworks({filters: {name: {gateway: true}}})
    for (const item of list) {
        if (item.Name == 'online_linux_env_gateway') {
            return
        }
    }
    await docker.createNetwork({
        Name: 'online_linux_env_gateway',
        CheckDuplicate: true,
        Driver: 'bridge',
        EnableIPv6: false,
    })
})()

module.exports = docker
