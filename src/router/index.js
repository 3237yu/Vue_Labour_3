import { createRouter, createWebHistory } from 'vue-router';
import Test from '../components/Test.vue'; // 引入你的主要组件

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Test,
        props: route => ({ page: parseInt(route.query.page) || 1 }) // 默认页码为1
    },
    {
        path: '/vote',
        name: 'Vote',
        component: Test,
        props: (route) => ({
          page: parseInt(route.query.page) || 1
        })
        
    }
];

const router = createRouter({
    history: createWebHistory('/'), // 使用 '/'
    routes
});

export default router;
