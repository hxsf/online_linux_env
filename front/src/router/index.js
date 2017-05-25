import Vue from 'vue';
import Router from 'vue-router';
import Dash from '@/views/Dash';
import IDE from '@/views/IDE';
import Auth from '@/views/Auth';
import Admin from '@/views/Admin';
import Status from '@/views/admin/Status';
import Usage from '@/views/admin/Usage';
import Images from '@/views/admin/Images';


Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Dash',
            component: Dash,
            meta: {
                requiresAuth: true,
            },
        },
        {
            name: 'IDE',
            path: '/ide',
            component: IDE,
            meta: {
                requiresAuth: true,
            },
        },
        {
            name: 'Auth',
            path: '/auth',
            component: Auth,
        },
        {
            name: 'Admin',
            path: '/admin',
            component: Admin,
            meta: {
                requiresAuth: true,
                requiresAdmin: true,
            },
            children: [{
                name: 'status',
                path: '',
                component: Status,
            }, {
                name: 'usage',
                path: 'usage',
                component: Usage,
            }, {
                name: 'images',
                path: 'images',
                component: Images,
            }],
        },
    ],
});
