import Vue from 'vue'
import Router from 'vue-router'

import MainLayout from './layouts/MainLayout';


import PlayLayout from './layouts/PlayLayout';
import Play from './pages/play/Play';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // {path: "/", component: MainLayout, props: {page: Home}},
    {path: "/play/:roomId/:role", component: PlayLayout, props: {page: Play}},
  ]
})
