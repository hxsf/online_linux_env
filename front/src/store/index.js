import Vue from 'vue';
import Vuex from 'vuex';
import editors from './editors';
import common from './common';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        editors,
        common,
    },
});

export default store;
