<template>
    <Card class="container">
        <p slot="title">
            <Icon type="laptop"></Icon>
            {{data.name}}
        </p>
        <Button-group size="small" slot="extra">
            <Button type="info" v-if="isStop" @click.stop="open">开机</Button>
            <Button type="warning" v-if="isRuning" @click.stop="stop">关机</Button>
            <Button type="error" v-if="isStop" @click.stop="remove">删除</Button>
            <Button type="primary" v-if="isRuning" @click.stop="OpenIDE"><Icon type="android-open"></Icon> 进入</Button>
        </Button-group>
        <a href="#" >

        </a>
        <ul>
            <li class="info-item">
                <span class="title">Status</span>
                <span class="value"><Tag :color="color">{{ data.status }}</Tag></span>
            </li>
            <li class="info-item">
                <span class="title">ID</span>
                <span class="value">{{ data.id.slice(0, 20) + '...' }}</span>
            </li>
            <li class="info-item">
                <span class="title">Created</span>
                <span class="value">
                    {{ created }}
                    <Button type="ghost" size="small" shape="circle" icon="loop" @click="friendlyTime.created = !friendlyTime.created"></Button>
                </span>
            </li>
            <li class="info-item">
                <span class="title">StartedAt</span>
                <span class="value">
                    {{ startedAt }}
                    <Button type="ghost" size="small" shape="circle" icon="loop" @click="friendlyTime.startedAt = !friendlyTime.startedAt"></Button>
                </span>
            </li>
            <li class="info-item">
                <span class="title">FinishedAt</span>
                <span class="value">
                    {{ finishedAt }}
                    <Button type="ghost" size="small" shape="circle" icon="loop" @click="friendlyTime.finishedAt = !friendlyTime.finishedAt"></Button>
                </span>
            </li>
            <li class="info-item">
                <span class="title">Image</span>
                <span class="value">{{ data.image }}</span>
            </li>
            <li class="info-item">
                <span class="title">Remark</span>
                <span class="value">{{ data.remark || '空' }}</span>
            </li>
        </ul>
    </Card>
</template>
<script>
    import * as moment from 'moment';

    const colorTable = {
        running: 'green',
        exited: 'red',
        created: 'blue',
    };
    
    export default {
        props: ['data'],
        data() {
            return {
                friendlyTime: {
                    created: true,
                    startedAt: true,
                    finishedAt: true,
                },
            };
        },
        computed: {
            created() {
                if (this.friendlyTime.created) {
                    return moment(this.data.created).toNow(true);
                }
                return moment(this.data.created).format('YYYY-MM-DD HH:mm:ss');
            },
            startedAt() {
                if (this.friendlyTime.startedAt) {
                    return moment(this.data.state.StartedAt).toNow(true);
                }
                return moment(this.data.state.StartedAt).format('YYYY-MM-DD HH:mm:ss');
            },
            finishedAt() {
                if (this.friendlyTime.finishedAt) {
                    return moment(this.data.state.FinishedAt).toNow(true);
                }
                return moment(this.data.state.FinishedAt).format('YYYY-MM-DD HH:mm:ss');
            },
            color() {
                return colorTable[this.data.status] || 'yellow';
            },
            isStop() {
                return !this.data.state.Running;
            },
            isRuning() {
                return this.data.state.Running;
            },
            gateway_token() {
                return this.data.real_name.slice(1);
            },
        },
        methods: {
            open() {
                fetch(`/v1/container/${this.data.id}/start`, {
                    headers: {
                        token: this.$store.state.common.token,
                    },
                })
                .then((resp) => {
                    if (resp.status === 401) {
                        this.$router.push('/auth');
                    }
                    return resp;
                })
                .then(resp => resp.json())
                .then((data) => {
                    this.data.status = data.Status;
                    this.data.state = data;
                })
                .catch((err) => {
                    this.$Notice.error({
                        title: err.message,
                    });
                });
            },
            stop() {
                fetch(`/v1/container/${this.data.id}/stop`, {
                    headers: {
                        token: this.$store.state.common.token,
                    },
                })
                .then((resp) => {
                    if (resp.status === 401) {
                        this.$router.push('/auth');
                    }
                    return resp;
                })
                .then(resp => resp.json())
                .then((data) => {
                    this.data.status = data.Status;
                    this.data.state = data;
                })
                .catch((err) => {
                    this.$Notice.error({
                        title: err.message,
                    });
                });
            },
            remove() {
                fetch(`/v1/container/${this.data.id}`, {
                    method: 'DELETE',
                    headers: {
                        token: this.$store.state.common.token,
                    },
                })
                .then((resp) => {
                    if (resp.status === 401) {
                        this.$router.push('/auth');
                    }
                    return resp;
                })
                .then(resp => resp.json())
                .then(() => {
                    this.$emit('remove', this.data.id);
                    // this.$destroy();
                })
                .catch((err) => {
                    this.$Notice.error({
                        title: err.message,
                    });
                });
            },
            OpenIDE() {
                this.$router.push({ name: 'IDE', params: { id: this.data.id, token: this.gateway_token } });
            },
        },
    };
</script>
<style scoped>
    .container {
        padding-bottom: 10px;
    }
    .info-item {
        width: 100%;
    }
    .title {
        float: left;
        display: block;
        width: 30%;
    }
    .value {
        float: left;
        display: block;
        width: 70%;
        text-align: right;
        white-space: normal;
    }
</style>
