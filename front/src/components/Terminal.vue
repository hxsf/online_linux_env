<template>
    <div class="terminal" ref="terminal"></div>
</template>
<script>
    import io from 'socket.io-client';
    import Xterm from './xterm';

    export default {
        data() {
            return {
                socket: null,
                xterm: null,
            };
        },
        mounted() {
            this.socket = io.connect(this.$store.state.common.vlab_pty_url);
            this.socket.on('connect', () => {
                this.xterm = new Xterm({
                    cursorBlink: false, // Do not blink the terminal's cursor
                });
                this.xterm.open(this.$refs.terminal);
                this.xterm.fit();
                this.xterm.attach(this.socket);
                let { cols, rows } = this.xterm.proposeGeometry();
                cols += 0;
                rows += 0;
                this.xterm.resize(cols, rows);
            });
        },
        beforeDestroy() {
            this.socket.close();
        },
    };
</script>
<style scoped>
.terminal {
    height: 100%;
    font-size: 14px;
}
</style>
