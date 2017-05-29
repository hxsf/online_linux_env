<template>
    <div class="tree">
        <ul class="treelist" @contextmenu.prevent.stop="contextmenu">
            <Folder class="root"  :socket="socket" @menu="menu" :pathinfo="folder" ref='root'></Folder>
        </ul>
        <div class="menu menu-bg" v-show="menu_expand" @click.self.stop="cancel_menu" @dblclick.self.stop="cancel_menu" @contextmenu.prevent.stop="cancel_menu">
            <ul class="menu-list" v-bind:style="menu_postion">
                <li class="menu-item" @click.prevent.stop="menu_create_or_move('file')">新建文件</li>
                <li class="menu-item" @click.prevent.stop="menu_create_or_move('folder')">新建文件夹</li>
                <li class="menu-item split"></li>
                <li class="menu-item" @click.prevent.stop="menu_create_or_move('move')">重命名/移动</li>
                <li class="menu-item split"></li>
                <li class="menu-item" @click.prevent.stop="menu_remove_file">删除</li>
            </ul>
            <Modal v-model="modal_show" @on-ok="menu_create_or_move_handle" @on-cancel="cancel_modal">
                <p slot="header">
                    <span>{{modal_title}}</span>
                </p>
                <Input v-model="modal_value" ref="modal_input"></Input>
            </Modal>
        </div>
    </div>
</template>
<script>
    import IO from 'socket.io-client';
    import Folder from './Folder';
    import File from './File';

    export default {
        props: {
            gateway: {
                default: 'default',
            },
        },
        components: {
            File,
            Folder,
        },
        data() {
            return {
                modal_value: '',
                modal_show: false,
                modal_mode: '',
                selected_item: null,
                menu_expand: false,
                menu_postion: {
                    left: '0',
                    top: '0',
                },
                folder: {
                    name: 'workspace',
                    basedir: '/',
                    fullpath: '/workspace',
                },
                socket: null,
            };
        },
        computed: {
            modal_title() {
                return this.modal_mode === 'file' ? '文件名...' : '目录名...';
            },
        },
        methods: {
            update_socket() {
                if (this.socket) {
                    this.socket.close();
                }
                this.socket = IO(`ws://${this.gateway}.v.just-test.com:${this.$store.state.common.ws_port || '10000'}/fs`);
            },
            menu(component, { clientX, clientY }) {
                this.menu_postion.left = `${clientX}px`;
                this.menu_postion.top = `${clientY}px`;
                this.select(component);
                this.menu_expand = true;
            },
            cancel_menu() {
                this.menu_expand = false;
            },
            cancel_modal() {
                this.modal_show = false;
            },
            select(component) {
                if (this.selected_item) this.selected_item.unselect();
                this.selected_item = component;
                this.selected_item.select();
            },
            get_modal_value() {
                const temp = this.modal_value;
                this.modal_value = '';
                return temp;
            },
            reflash_selet_dir(flag = false) {
                if (!this.selected_item || !this.selected_item.pathinfo) return;
                let folder = this.selected_item.pathinfo.type === 'file' ? this.selected_item.$parent : this.selected_item;
                if (flag) folder = folder.$parent;
                if (folder.is_expand()) folder.update_data();
            },
            menu_create_or_move(type) {
                this.cancel_menu();
                if (!this.selected_item || !this.selected_item.pathinfo) return;
                this.modal_mode = type;
                const pathinfo = this.selected_item.pathinfo;
                if (type === 'move') {
                    this.modal_value = pathinfo.fullpath;
                } else {
                    this.modal_value = `${pathinfo.type === 'file' ? pathinfo.basedir : pathinfo.fullpath}/`;
                }
                this.modal_show = true;
                this.$nextTick(() => {
                    this.$refs.modal_input.focus();
                });
            },
            menu_create_or_move_handle() {
                const filepath = this.get_modal_value();
                if (!/^\/(?:[^\\/:*?"<>|]+(?:\/[^\\/:*?"<>|]+)*)?$/.test(filepath)) {
                    this.$Notice.error({ title: '不是合法的路径' });
                    return;
                }
                if (this.modal_mode === 'move') {
                    const oldpath = this.selected_item.pathinfo.fullpath;
                    this.socket.emit('move', oldpath, filepath, (err) => {
                        if (err) {
                            this.$Notice.error({ title: err.message });
                        } else {
                            this.$Notice.success({ title: '创建成功' });
                            this.reflash_selet_dir();
                        }
                    });
                    return;
                }
                this.socket.emit(this.modal_mode === 'file' ? 'createFile' : 'createDir', filepath, (err) => {
                    if (err) {
                        this.$Notice.error({ title: err.message });
                    } else {
                        this.$Notice.success({ title: '创建成功' });
                        this.reflash_selet_dir();
                    }
                });
            },
            menu_remove_file() {
                this.cancel_menu();
                if (!this.selected_item || !this.selected_item.pathinfo) return;
                const fullpath = this.selected_item.pathinfo.fullpath;
                this.$Modal.confirm({
                    title: '删除',
                    content: `<p>确认删除${fullpath}</p><p>注意：如果删除的是文件夹，则改文件夹下所有内容将被删除</p>`,
                    onOk: () => {
                        this.socket.emit('remove', fullpath, (err) => {
                            if (err) {
                                this.$Notice.error({ title: err.message });
                            } else {
                                this.$Notice.success({ title: '成功' });
                                this.reflash_selet_dir(true);
                                this.select(this.$refs.root);
                            }
                        });
                    },
                });
            },
        },
        name: 'FileTree',
        created() {
            this.update_socket();
        },
    };
</script>
<style scoped>
    .tree {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: auto;
        border-right: 1px black solid;
        box-sizing: border-box;
        font-size: 16px;
        user-select: none;
    }

    .treelist>.root {
        padding-left: 1em;
    }

    .treelist {
        width: 100%;
    }

    .menu {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 100;
    }

    .menu-list {
        position: fixed;
        box-shadow: 1px 1px 2px 1px;
        width: 300px;
        background-color: #fff;
        cursor: pointer;
    }

    .menu-item {
        padding-left: 15px;
        box-sizing: border-box;
    }

    .menu-item.split {
        padding-left: 0;
        height: 0;
        width: 100%;
        border-top: 1px solid #ccc;
    }
</style>
