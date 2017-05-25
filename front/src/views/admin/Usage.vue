<template>
    <div class="usage">
        <Spin size="large" fix v-if="isLoading"></Spin>        
        <Table border :columns="columns" :data="data" ref="table"></Table>
        <br>
        <Button type="primary" size="large" @click="exportData(1)"><Icon type="ios-download-outline"></Icon> 导出原始数据</Button>
        <Button type="primary" size="large" @click="exportData(2)"><Icon type="ios-download-outline"></Icon> 导出排序和过滤后的数据</Button>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        data() {
            return {
                isLoading: true,
                columns: [{
                    width: 80,
                    type: 'index',
                    fixed: 'left',
                }, {
                    title: 'Image',
                    key: 'Image',
                    width: 150,
                    sortable: true,
                }, {
                    title: 'State',
                    key: 'State',
                    width: 100,
                    filters: [{
                        label: 'Running',
                        value: 'running',
                    }, {
                        label: 'Created',
                        value: 'created',
                    }],
                    filterMethod(flag, { State }) {
                        return flag === State.toLowerCase();
                    },
                }, {
                    title: 'Status',
                    key: 'Status',
                    width: 180,
                }, {
                    title: 'Created',
                    key: 'Created',
                    width: 150,
                    sortable: true,
                    render({ Created }) {
                        return moment(Created * 1000).format('YYYY-MM-DD HH:mm:ss');
                    },
                }, {
                    title: 'Ports',
                    key: 'Ports',
                    width: 200,
                    render({ Ports }) {
                        return Ports.map(Port => `${Port.PublicPort}->${Port.PrivatePort}/${Port.Type}`).join(',');
                    },
                }, {
                    title: 'SizeRw',
                    key: 'SizeRw',
                    width: 150,
                }, {
                    title: 'SizeRootFs',
                    key: 'SizeRootFs',
                    width: 150,
                }, {
                    title: 'ID',
                    key: 'Id',
                    width: 500,
                    sortable: true,
                    className: 'mono',
                }],
                data: [],
            };
        },
        methods: {
            update() {
                this.isLoading = true;
                fetch('/v1/system/df').then((resp) => {
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
