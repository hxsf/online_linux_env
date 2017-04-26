<template>
    <div class="layout">
        <div class="layout-ceiling">
            <div class="layout-ceiling-main">
                <!-- <a href="#">注册登录</a> | -->
                <a href="#">帮助中心</a><!--  |
                <a href="#">安全中心</a> |
                <a href="#">服务大厅</a> -->
            </div>
        </div>
        <div class="layout-header">

        </div>
        <div class="container-list">
            <Container :data="container" v-for="container in containers" :key="containers.id" @remove="removeContainer"></Container>
            <Card class="container add">
                <Select v-model="imageForNew" style="width:200px">
                    <Option v-for="item in imageList" :value="item" :key="item">{{ item }}</Option>
                </Select>
                <br>
                <span @click.prevent.stop="newContainer"><Icon type="plus-round"></Icon> 添加</span>
            </Card>
            <div class="container empty" v-for="i in 6" :key="i"></div>
        </div>
        <Copy></Copy>
    </div>
</template>

<script>
    import Container from '@/components/Container';

    export default {
        components: {
            Container,
        },
        data() {
            return {
                containers: [],
                imageList: [],
                imageForNew: '',
            };
        },
        methods: {
            update() {
                fetch('/v1/container/', {
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
                    this.containers = data;
                })
                .catch((err) => {
                    console.error(err);
                });
            },
            getImageList() {
                fetch('/v1/image/', {
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
                    this.imageList = data;
                })
                .catch((err) => {
                    console.error(err);
                });
            },
            newContainer() {
                if (!this.imageForNew || this.imageList.indexOf(this.imageForNew) === -1) {
                    this.$Notice.error({
                        title: '必须选则可用的镜像',
                    });
                    return;
                }
                fetch('/v1/container/', {
                    method: 'POST',
                    headers: {
                        token: this.$store.state.common.token,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `image=${this.imageForNew}`,
                })
                .then((resp) => {
                    if (resp.status === 401) {
                        this.$router.push('/auth');
                    }
                    return resp;
                })
                .then(resp => resp.json())
                .then(() => {
                    this.update();
                })
                .catch((err) => {
                    this.$Notice.error({
                        title: err.message,
                    });
                });
            },
            removeContainer(id) {
                const index = this.containers.findIndex(item => item.id === id);
                console.log(index);
                this.$nextTick(() => {
                    this.containers.splice(index, 1);
                });
            },
        },
        mounted() {
            this.update();
            this.getImageList();
        },
    };
</script>
<style scoped>
    .layout{
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-ceiling{
        background: #464c5b;
        padding: 10px 0;
        overflow: hidden;
    }
    .layout-ceiling-main{
        float: right;
        margin-right: 15px;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .container-list {
        display: flex;
        flex-grow: 1;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: flex-start;
        justify-content: space-around;
    }
    .container {
        flex-basis: 280px;
        flex-grow: 1;
        margin: 15px;
    }
    .container.empty {
        height: 0;
        margin-top: 0;
        margin-bottom: 0;
    }
    .container.add {
        display: flex;
        justify-content: center;
        font-size: 4em;
        cursor: pointer;
        text-align: center;
    }
    .info-item > .value {
        float: right;
    }
</style>
