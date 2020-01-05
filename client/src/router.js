import Vue from 'vue'
import Router from 'vue-router'

import MainLayout from './layouts/MainLayout';


import PlayLayout from './layouts/PlayLayout';

import PlayClient from './pages/rooms/PlayClient';
import PlayAdmin from './pages/rooms/PlayAdmin';

import WebsocketMonitor from './pages/websocket-monitor/WebsocketMonitor.vue';

import Dashboard from './pages/dashboard/Dashboard.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {path: "/", redirect: "/dashboard"},
    {path: "/dashboard", component: PlayLayout, props: {page: Dashboard}},
    {path: "/play/:socketRoomId/client", component: PlayLayout, props: {page: PlayClient}},
    {path: "/play/:socketRoomId/admin", component: PlayLayout, props: {page: PlayAdmin}},

    {path: "/websocket-monitor", component: WebsocketMonitor}
  ]
})
