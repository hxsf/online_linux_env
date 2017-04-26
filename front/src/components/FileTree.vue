<template>
    <div class="tree">
        <ul class="treelist">
            <Folder class="root" :folder="folder"></Folder>
        </ul>
    </div>
</template>
<script>
    import Folder from './Folder';
    import File from './File';

    export default {
        components: {
            File,
            Folder,
        },
        data() {
            return {
                folder: {
                    name: 'workspace',
                    basedir: '/',
                },
            };
        },
    };
</script>
<style scoped>
.tree {
    width: 100%;
    height: 100%;
    overflow: auto;
    border-right: 1px black solid;
    box-sizing: border-box;
    font-size: 16px;
    user-select: none;
}
.treelist > .root {
    padding-left: 1em;
}
.treelist {
    width: 100%;
}
</style>
