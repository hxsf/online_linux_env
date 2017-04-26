import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import Dash from '@/views/Dash';
import IDE from '@/views/IDE';
import Auth from '@/views/Auth';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/Hello',
            name: 'Hello',
            component: Hello,
        },
        {
            path: '/',
            name: 'Dash',
            component: Dash,
        },
        {
            name: 'IDE',
            path: '/ide',
            component: IDE,
        },
        {
            name: 'Auth',
            path: '/auth',
            component: Auth,
        },
    ],
});
