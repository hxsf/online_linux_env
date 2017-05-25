/* eslint-disable no-param-reassign */
const TOKEN_NAME = 'vlab-token';
export default {
    state: {
        vlab_fs_url: 'ws://127.0.0.1:10000/fs',
        vlab_pty_url: 'ws://127.0.0.1:10000/pty',
        token: localStorage.getItem(TOKEN_NAME) || '',
    },
    mutations: {
        logout(state) {
            state.token = '';
            localStorage.setItem(TOKEN_NAME, '');
        },
        token(state, token) {
            if (token) {
                state.token = token;
                localStorage.setItem(TOKEN_NAME, token);
            }
        },
    },
};
