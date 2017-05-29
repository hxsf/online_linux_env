<template>
    <div class="layout">
        <div class="layout-ceiling">
            <div class="layout-ceiling-main">
                <!-- <a href="#">注册登录</a> |
                <a href="#">帮助中心</a> |
                <a href="#">安全中心</a> | -->
                <a href="#">退出</a>
            </div>
        </div>
        <div class="main">
            <div class="middle">
                <div class="leftbar">
                    <FileTree class="file-tree" :gateway="container_name"></FileTree>
                    <ProxyList class="proxy-list"></ProxyList>
                </div>
                <div class="editors">
                    <Tabs value="name1" type="card" :animated="false" class="fix-height" closable @on-click="editorTabClick" @on-tab-remove="handleCloseEditor" ref="editorTab">
                        <Tab-pane class="tab-item" :label="editor.name" :name="editor.fullpath" v-for="(editor, i) in editors" :key="editor.fullpath">
                            <Editor :path="editor.fullpath" ref="editors"></Editor>
                        </Tab-pane>
                    </Tabs>
                </div>
            </div>
            <div class="footerbar">
                <Tabs value="name1" type="card" :animated="false" class="fix-height" closable @on-click="terminalTabClick" @on-tab-remove="handleCloseTermial" ref="terminalTab">
                    <Button type="ghost" @click.stop="terminalAdd" size="small" slot="extra" :disabled="terminals.length > 4">增加</Button>
                    <Tab-pane class="tab-item" :label="terminal.name" :name="terminal.name" v-for="(terminal, i) in terminals" :key="terminal.name">
                        <Terminal ref="terminals" :gateway="container_name" :name="terminal.name"></Terminal>
                    </Tab-pane>
                </Tabs>
            </div>
        </div>
        <Copy class="copy"></Copy>
    </div>
</template>

<script>
    import Editor from '@/components/Editor';
    import Terminal from '@/components/Terminal';
    import FileTree from '@/components/FileTree';
    import ProxyList from '@/components/ProxyList';

    export default {
        components: {
            Editor,
            Terminal,
            FileTree,
            ProxyList,
        },
        data() {
            return {
                activeEditor: 1,
                terminalNumber: 0,
                terminals: [],
            };
        },
        computed: {
            editors() {
                return this.$store.state.editors.editors;
            },
            curEditor() {
                return this.$store.state.editors.curEditor;
            },
            container_name() {
                return this.$route.params.token || 'default';
            },
        },
        watch: {
            curEditor(now) {
                this.$nextTick(() => {
                    this.$refs.editorTab.handleChange(now);
                });
            },
        },
        methods: {
            editorTabClick(name) {
                const index = this.$refs.editors.findIndex(item => item.path === name);
                if (index < 0) return;
                this.$store.state.editors.curEditor = index;
                const editor = this.$refs.editors[index].editor;
                this.$nextTick(() => {
                    editor.resize(true);
                    editor.focus();
                });
            },
            terminalTabClick(name) {
                let terminal = this.$refs.terminals.find(item => item.name === name);
                if (!terminal) return;
                terminal = terminal.xterm;
                this.$nextTick(() => {
                    terminal.fit();
                    terminal.focus();
                });
            },
            terminalAdd() {
                this.terminals.push({
                    name: `tty${this.terminalNumber}`,
                });
                this.terminalNumber += 1;
                this.$nextTick(() => {
                    this.$refs.terminalTab.handleChange(this.terminals.length - 1);
                });
            },
            handleCloseEditor(name) {
                this.$store.commit('removeEditor', name);
            },
            handleCloseTermial(name) {
                const index = this.terminals.findIndex(item => item.name === name);
                if (index > -1) {
                    this.terminals.splice(index, 1);
                }
            },
        },
    };
</script>
<style>
    /* fix tab heigth */
    .ivu-tabs.ivu-tabs-card.fix-height {
        height: 100%;
    }
    .ivu-tabs.ivu-tabs-card.fix-height .ivu-tabs-bar {
        margin-bottom: 0;
    }
    .ivu-tabs.ivu-tabs-card.fix-height .ivu-tabs-content {
        height: calc(100% - 31px);
    }
    .tab-item.ivu-tabs-tabpane {
        height: 100%;
    }
</style>
<style scoped>
    .layout{
        display: block;
        width: 100%;
        height: 100vh;
        /*border: 1px solid #d7dde4;*/
        /*background: #f5f7f9;*/
        position: relative;
        /*border-radius: 4px;*/
        overflow: hidden;
    }
    .layout-ceiling{
        display: block;
        height: 40px;
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
    .main {
        width: 100%;
        height: calc(100% - 88px);
    }
    .main .middle {
        height: calc(100% - 250px);
    }
    .main .middle .leftbar, .main .middle .editors {
        float: left;
        height: 100%;
    }
    .main .middle .leftbar {
        width: 250px;
        display: flex;
        flex-direction: column;
    }
    .main .middle .leftbar .file-tree {
        display: flex;
        flex-grow: 1;
    }
    .main .middle .leftbar .proxy-list {
        display: flex;
        flex-basis: 200px;
    }
    .main .middle .editors {
        width: calc(100% - 250px);
    }
    .main .middle .editors > div {
        width: 100%;
    }
    .main .footerbar {
        height: 250px;
        border-top: 1px black solid;
        box-sizing: border-box;
        padding-top: 4px;
    }
    .main .footerbar > div {
        width: 100%;
    }
</style>
