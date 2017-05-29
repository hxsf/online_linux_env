/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import io from 'socket.io-client';

export default {
    state: {
        _socket: null,
    },
    getters: {
        socket(state, getters, roteState) {
            console.error('!!!!!!');
            if (!state._socket) {
                state._socket = io.connect(roteState.common.vlab_fs_url);
            }
            return state._socket;
        },
    },
    mutations: {

    },
    actions: {

    },
};
