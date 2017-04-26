<template>
    <li class="tree-item item-file" @click.prevent.stop="clickHandle">
        <span class="title"><Icon type="document-text"></Icon> {{file.name}}</span>
    </li>
</template>
<script>
    export default {
        props: ['file'],
        computed: {
            socket() {
                return this.$store.state.common.socket;
            },
        },
        methods: {
            clickHandle() {
                this.$store.commit('openFile', this.file);
            },
        },
    };
</script>
<style scoped>
    .title {
        display: block;
        width: 100%;
        white-space: nowrap;
    }
</style>
