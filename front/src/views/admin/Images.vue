<template>
    <div class="images">
        <Spin size="large" fix v-if="isLoading"></Spin>
        <Table border :columns="columns" :data="data" ref="table"></Table>
        <br>
        <Button type="primary" size="large" @click="exportData(1)"><Icon type="ios-download-outline"></Icon> 导出原始数据</Button>
        <Button type="primary" size="large" @click="exportData(2)"><Icon type="ios-download-outline"></Icon> 导出排序和过滤后的数据</Button>
        <Button type="primary" size="large" @click="addImage = true"><Icon type="ios-download-outline"></Icon> 添加新镜像</Button>
        <Modal
            v-model="addImage"
            title="添加新镜像"
            @on-ok="ok"
            @on-cancel="cancel">
            <Tabs value="name1">
                <Tab-pane label="上传导出的镜像" name="name1">
                    <Upload
                        type="drag"
                        accept="application/x-tar"
                        action="//jsonplaceholder.typicode.com/posts/">
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>点击或将文件拖拽到这里上传</p>
                        </div>
                    </Upload>
                </Tab-pane>
                <Tab-pane label="使用 DockerFile" name="name2">
                    <Input v-model="DockerFile" type="textarea" :autosize="{ minRows: 6, maxRows: 16 }" placeholder="请输入 DockerFile ..."></Input>
                </Tab-pane>
                <Tab-pane label="从 Registry pull" name="name3">
                    <Input v-model="imageUrl" placeholder="请输入地址..."></Input>                    
                </Tab-pane>
            </Tabs>
        </Modal>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        data() {
            return {
                DockerFile: '',
                imageUrl: '',
                addImage: false,
                isLoading: true,
                columns: [{
                    width: 80,
                    type: 'index',
                    fixed: 'left',
                }, {
                    title: 'Name',
                    key: 'name',
                    width: 150,
                }, {
                    title: 'Created',
                    key: 'created',
                    width: 150,
                    sortable: true,
                    render({ created }) {
                        return moment(created * 1000).format('YYYY-MM-DD HH:mm:ss');
                    },
                }, {
                    title: 'Size',
                    key: 'size',
                    width: 150,
                }, {
                    title: 'ID',
                    key: 'id',
                    width: 550,
                    sortable: true,
                    className: 'mono',
                }],
                data: [],
            };
        },
        methods: {
            update() {
                this.isLoading = true;
                fetch('/v1/system/images').then((resp) => {
                    resp.json().then((data) => {
                        this.isLoading = false;
                        if (!resp.ok) {
                            this.$Notice.error({
                                title: data.msg,
                            });
                            return;
                        }
                        this.data = data || [];
                    });
                });
            },
            exportData(type) {
                if (type === 1) {
                    this.$refs.table.exportCsv({
                        filename: '原始数据',
                    });
                } else if (type === 2) {
                    this.$refs.table.exportCsv({
                        filename: '排序和过滤后的数据',
                        original: false,
                    });
                }
            },
            ok() {
                this.cancel();
            },
            cancel() {
                this.DockerFile = '';
                this.imageUrl = '';
            },
        },
        mounted() {
            this.update();
        },
    };
</script>

<style>
.mono {
    font-family: monospace;
}
</style>
