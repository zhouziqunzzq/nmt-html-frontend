import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('./components/HelloWorld.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./views/Dashboard.vue'),
    },
    {
      path: '/auth/register',
      name: 'auth.register',
      component: () => import('./views/Auth/Register.vue'),
    },
    {
      path: '/auth/login',
      name: 'auth.login',
      component: () => import('./views/Auth/Login.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue'),
    },
  ],
});
