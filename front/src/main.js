// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import iView from 'iview';
import 'iview/dist/styles/iview.css';    // 使用 CSS
import App from '@/App';
import router from '@/router';
import store from '@/store';
import Copy from '@/components/Copy';
// import './style.less';

Vue.use(iView);
Vue.config.productionTip = false;
Vue.component('Copy', Copy);

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.state.common.token) {
            next();
        } else {
            next({
                path: '/auth',
            });
        }
    } else {
        next();
    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
});
