<template>
    <li class="tree-item item-file" :class="{active: selected}" @click.prevent.stop="clickHandle" @contextmenu.prevent.stop="contextmenu">
        <span class="title"><Icon type="document-text"></Icon> {{pathinfo.name}}</span>
    </li>
</template>
<script>
    export default {
        data() {
            return {
                selected: false,
            };
        },
        props: ['pathinfo', 'socket'],
        methods: {
            clickHandle() {
                this.getFileTree().select(this);
                this.$store.commit('openFile', this.pathinfo);
            },
            contextmenu(event) {
                const { clientX, clientY } = event;
                this.$emit('menu', this, { clientX, clientY });
            },
            select() {
                this.selected = true;
            },
            unselect() {
                this.selected = false;
            },
            getFileTree() {
                let parent = this.$parent;
                while (parent.$options.name !== 'FileTree') {
                    parent = parent.$parent;
                }
                return parent;
            },
            is_folder() {
                return false;
            },
            is_file() {
                return true;
            },
        },
    };
</script>
<style scoped>
    .title {
        display: block;
        position: relative;
        width: 100%;
        white-space: nowrap;
    }
    .tree-item.active::before {
        position: absolute;
        content: '';
        left: 0;
        right: 0;
        height: 25px;
        background-color: #DCDCDC;
    }
</style>
