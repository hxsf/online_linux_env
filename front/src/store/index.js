import Vue from 'vue';
import Vuex from 'vuex';
import editors from './editors';
import sockets from './sockets';
import common from './common';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        editors,
        sockets,
        common,
    },
});

export default store;
