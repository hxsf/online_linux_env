<template>
    <div class="proxy-panel">
        <span class="title">proxy list
            <Button-group class="btn">
                <Button size="small" icon="refresh" @click.stop.prevent="update"></Button>
                <Button size="small" icon="plus" @click.stop.prevent="addproxy = true"></Button>
            </Button-group>
        </span>
        <ul class="proxy-list">
            <li class="proxy-item" v-for="item, index of list">
                <a :href="url(item.url)" target="_blank">{{ item.port }}</a>
                <Button class="btn" shape="circle" icon="trash-b" size="small" @click.stop.prevent="remove(item.url, index)"></Button>
            </li>
        </ul>
        <Modal
            v-model="addproxy"
            title="add proxy rule"
            @on-ok="add"
            @on-cancel="cancel">
            <p>目前仅支持HTTP穿透,请输入端口号...
            <Input-number v-model="new_port" :min="1" :max="65535" @keyup.native.enter.stop.prevent="add"></Input-number>
            </p>
        </Modal>
    </div>
</template>

<script>
    export default {
        props: {
            token: {
                default: 'default',
            },
        },
        data() {
            return {
                new_port: 3000,
                addproxy: false,
                list: [],
            };
        },
        methods: {
            url(url) {
                return `http://${url}.v.just-test.com:8000/`;
            },
            add() {
                this.addproxy = false;
                console.log(this.token, this.new_port);
                fetch('/v1/proxy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `name=${this.token}&port=${this.new_port}`,
                }).then((resp) => {
                    resp.json().then((data) => {
                        if (!resp.ok) {
                            this.$Notice.error({
                                title: data.msg,
                            });
                            return;
                        }
                        this.list.push({
                            url: data.token,
                            port: this.new_port,
                        });
                    });
                });
            },
            remove(token, index) {
                const [name, port] = token.split('-', 2);
                fetch(`/v1/proxy/${name}/${port}`, {
                    method: 'delete',
                }).then((resp) => {
                    resp.json().then((data) => {
                        if (!resp.ok) {
                            this.$Notice.error({
                                title: data.msg,
                            });
                            return;
                        }
                        this.list.splice(index, 1);
                    });
                });
            },
            cancel() {
                this.new_port = 3000;
            },
            update() {
                fetch(`/v1/proxy/${this.token}`).then((resp) => {
                    resp.json().then((data) => {
                        if (!resp.ok) {
                            this.$Notice.error({
                                title: data.msg,
                            });
                            return;
                        }
                        this.list = data;
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
    .proxy-panel {
        display: flex;
        flex-grow: 1;
        border-right: 1px black solid;
        flex-direction: column;
    }
    .title {
        display: block;
        border-top: 1px black solid;
        border-bottom: 1px black solid;
        padding: 10px 10px;
        width: 100%;
    }
    .btn {
        float: right;
    }
    .proxy-list {
        width: 100%;
        overflow: auto;
    }
    .proxy-item {
        padding: 10px 15px;
    }
    .clear {
        width: 100%;
        clear: both;
    }
</style>
