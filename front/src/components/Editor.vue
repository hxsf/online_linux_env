<template>
    <div class="editor" ref="editor"></div>
</template>
<script>
    import path from 'path';
    import ace from 'brace';
    import 'brace/theme/monokai';
    import { getModeFromExt } from './helper';

    export default {
        props: ['path', 'socket'],
        data() {
            return {
                editor: null,
            };
        },
        computed: {
            extname() {
                return path.extname(this.path);
            },
        },
        methods: {
            save(editor) {
                this.socket.emit('writeFile', this.path, editor.getValue(), (err) => {
                    if (err) {
                        return this.$Notice.error({
                            title: '保存失败',
                            desc: err.message,
                            duration: 5,
                        });
                    }
                    return this.$Notice.success({
                        title: '保存成功',
                        duration: 1,
                    });
                });
            },
        },
        mounted() {
            if (!this.editor) {
                this.editor = ace.edit(this.$refs.editor);
                this.editor.setTheme('ace/theme/monokai');
                this.editor.$blockScrolling = Infinity;
                this.editor.commands.addCommand({
                    name: 'save',
                    bindKey: { win: 'Ctrl-s', mac: 'Command-s' },
                    exec: this.save,
                });
            }
            const mode = getModeFromExt(this.extname);
            require(`brace/mode/${mode}`); // eslint-disable-line
            this.editor.getSession().setMode(`ace/mode/${mode}`);
            this.socket.emit('readFile', this.path, (err, str) => {
                if (err) {
                    return this.$Notice.error({
                        title: '打开失败',
                        desc: err.message,
                        duration: 5,
                    });
                }
                return this.editor.setValue(str, -1);
            });
        },
    };
</script>
<style scoped>
    .editor {
        height: 100%;
    }
</style>
