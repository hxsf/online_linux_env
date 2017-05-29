<template>
    <li class="tree-item item-folder" :class="{active: selected}" @click.prevent.stop="clickHandle" @contextmenu.prevent.stop="contextmenu">
        <span class="title"><Icon :type="icon"></Icon> {{pathinfo.name}}</span>
        <ul class="folder" :class="{expand}">
            <Folder v-for="folder in folders" :socket="socket" @menu="menu" :pathinfo="folder" :key="folder.fullpath"></Folder>
            <File v-for="file in files" :socket="socket" @menu="menu" :pathinfo="file" :key="file.fullpath"></File>
        </ul>
    </li>
</template>
<script>
    import path from 'path';
    import File from './File';

    export default {
        components: {
            File,
        },
        data() {
            return {
                folders: [],
                files: [],
                expand: false,
                loading: false,
                selected: false,
            };
        },
        props: ['pathinfo', 'socket'],
        computed: {
            icon() {
                if (this.loading) {
                    return 'load-a';
                } else if (this.expand) {
                    return 'android-folder-open';
                }
                return 'android-folder';
            },
            fullpath() {
                return path.join(this.pathinfo.basedir, this.pathinfo.name);
            },
        },
        methods: {
            clickHandle() {
                this.getFileTree().select(this);
                if (this.expand) {
                    this.expand = false;
                } else {
                    this.loading = true;
                    if (!this.fullpath) return;
                    this.update_data(() => {
                        this.expand = true;
                        this.loading = false;
                    });
                }
            },
            is_expand() {
                return this.expand;
            },
            update_data(cb) {
                this.socket.emit('readdir', this.fullpath, (err, { files, folders }) => {
                    this.folders = folders.sort();
                    this.files = files.sort();
                    if (cb instanceof Function) cb();
                });
            },
            getFileTree() {
                let parent = this.$parent;
                while (parent.$options.name !== 'FileTree') {
                    parent = parent.$parent;
                }
                return parent;
            },
            menu(...args) {
                this.$emit('menu', ...args);
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
            is_folder() {
                return true;
            },
            is_file() {
                return false;
            },
        },
        name: 'Folder',
    };
</script>
<style scoped>
.tree-item {
    padding-left: 1.5em;
    width: 100%;
    cursor: default;
    line-height: 1.5em;
}
.title {
    display: block;
    position: relative;
    width: 100%;
    white-space: nowrap;
}
.folder {
    display: none;
    width: 100%;
}
.folder.expand {
    display: block;
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
