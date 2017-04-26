<template>
    <li class="tree-item item-folder" @click.prevent.stop="clickHandle">
        <span class="title"><Icon :type="expand ? 'android-folder-open' : 'android-folder'"></Icon> {{folder.name}}</span>
        <ul class="folder" :class="{expand}">
            <Folder v-for="item in folders" :folder="item" :key="item.fullpath"></Folder>
            <File v-for="file in files" :file="file" :key="file.fullpath"></File>
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
            };
        },
        props: ['folder'],
        computed: {
            socket() {
                return this.$store.getters.socket;
            },
            fullpath() {
                return path.join(this.folder.basedir, this.folder.name);
            },
        },
        methods: {
            clickHandle() {
                if (this.expand) {
                    this.expand = false;
                } else {
                    this.loading = true;
                    if (!this.fullpath) return;
                    this.socket.emit('readdir', this.fullpath, (err, { files, folders }) => {
                        this.folders = folders.sort();
                        this.files = files.sort();
                        this.expand = true;
                        this.loading = false;
                    });
                }
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
</style>
