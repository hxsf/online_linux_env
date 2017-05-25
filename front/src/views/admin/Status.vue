<template>
    <div class="panel">
        <div class="count">
            <Card class="count-item" :bordered="false" style="background-color: #3399ff">
                <Icon type="cube"></Icon>
                <span class="num">{{containers.all}}</span>
            </Card>
            <Card class="count-item" :bordered="false" style="background-color: #00cc66">
                <Icon type="play"></Icon>
                <span class="num">{{containers.running}}</span>
            </Card>
            <Card class="count-item" :bordered="false" style="background-color: #ff9900">
                <Icon type="pause"></Icon>
                <span class="num">{{containers.paused}}</span>
            </Card>
            <Card class="count-item" :bordered="false" style="background-color: #ff3300">
                <Icon type="stop"></Icon>
                <span class="num">{{containers.stopped}}</span>
            </Card>
            <Card class="count-item" :bordered="false" style="background-color: #657180">
                <Icon type="ios-photos"></Icon>
                <span class="num">{{images}}</span>
            </Card>
        </div>
        <div class="info">
            <Card class="info-card info-system">
                <ul>
                    <li class="info-item" v-for="v,k of infos">
                        <span class="key">{{k}}</span>
                        <span class="value">{{v}}</span>
                    </li>
                </ul>
            </Card>
            <Card class="info-card info-system">
                <ul>
                    <li class="info-item" v-for="v,k of options">
                        <span class="key">{{k}}</span>
                        <span class="value">{{v}}</span>
                    </li>
                </ul>
            </Card>
        </div>
    </div>
</template>

<script>
    const plist = ['B', 'KB', 'MB', 'GB', 'TB'];
    export default {
        data() {
            return {
                containers: {
                    all: 0,
                    running: 0,
                    paused: 0,
                    stopped: 0,
                },
                images: 0,
                // options
                options: {
                    memoryLimit: false,
                    swapLimit: false,
                    kernelMemory: false,
                    cpuCfsPeriod: false,
                    cpuCfsQuota: false,
                    cPUShares: false,
                    cPUSet: false,
                    iPv4Forwarding: false,
                    bridgeNfIptables: false,
                    bridgeNfIp6tables: false,
                    oomKillDisable: false,
                },
                // other info
                infos: {
                    ncpu: '',
                    memTotal: '',
                    driver: '',
                    loggingDriver: '',
                    cgroupDriver: '',
                    kernelVersion: '',
                },
            };
        },
        methods: {
            update() {
                fetch('/v1/system/info').then((resp) => {
                    resp.json().then((data) => {
                        if (!resp.ok) {
                            this.$Notice.error({
                                title: data.msg,
                            });
                            return;
                        }
                        this.containers.all = data.Containers;
                        this.containers.running = data.ContainersRunning;
                        this.containers.paused = data.ContainersPaused;
                        this.containers.stopped = data.ContainersStopped;
                        this.images = data.Images;
                        this.options.memoryLimit = data.MemoryLimit;
                        this.options.swapLimit = data.SwapLimit;
                        this.options.kernelMemory = data.KernelMemory;
                        this.options.cpuCfsPeriod = data.CpuCfsPeriod;
                        this.options.cpuCfsQuota = data.CpuCfsQuota;
                        this.options.cPUShares = data.CPUShares;
                        this.options.cPUSet = data.CPUSet;
                        this.options.iPv4Forwarding = data.IPv4Forwarding;
                        this.options.bridgeNfIptables = data.BridgeNfIptables;
                        this.options.bridgeNfIp6tables = data.BridgeNfIp6tables;
                        this.options.oomKillDisable = data.OomKillDisable;
                        this.infos.driver = data.Driver;
                        this.infos.loggingDriver = data.LoggingDriver;
                        this.infos.cgroupDriver = data.CgroupDriver;
                        this.infos.kernelVersion = data.KernelVersion;
                        this.infos.ncpu = data.NCPU;
                        let v = parseInt(data.MemTotal, 10);
                        let p = 0;
                        while (Math.floor(v / 1024)) {
                            v /= 1024;
                            p += 1;
                        }
                        this.infos.memTotal = String(v).slice(0, 4) + plist[p];
                    });
                });
            },
        },
        mounted() {
            this.update();
        },
    };
</script>

<style scoped>
.count {
    display: flex;
    flex-direction: row;
}
.count .count-item {
    display: flex;
    flex-direction: column;
    flex: 1;
    color: #fff;
    margin: 5px;
    min-height: 100px;
    font-size: 64px;
    line-height: 64px;
}
.count .count-item .icon {
    float: left;
}
.count .count-item .num {
    float: right;
}
.info {
    display: flex;
}
.info .info-card {
    flex: 1;
    margin: 10px;
}
.info .info-system .info-item {
    width: 100%;
    height: 24px;
    line-height: 24px;
}
.info .info-system .info-item .key {
    float: left;
}
.info .info-system .info-item .value {
    float: right;
}
</style>
