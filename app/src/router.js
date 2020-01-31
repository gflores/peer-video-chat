import Vue from 'vue'
import Router from 'vue-router'


import PlayLayout from './layouts/PlayLayout';

import PlayClient from './pages/rooms/PlayClient';
import PlayAdmin from './pages/rooms/PlayAdmin';

import WebsocketMonitor from './pages/websocket-monitor/WebsocketMonitor.vue';

import Verify from './pages/credentials/Verify.vue';

import Dashboard from './pages/dashboard/Dashboard.vue';

import AdminLayout from './layouts/AdminLayout.vue';
import AdminDashboard from './pages/admin/Dashboard.vue';

import CredentialsLayout from './layouts/CredentialsLayout.vue';
import Login from './pages/credentials/Login.vue';

import ClientLayout from './layouts/ClientLayout.vue';
import ClientDashboard from './pages/client/Dashboard.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {path: "/", redirect: "/dashboard"},

    {path: "/login", component: CredentialsLayout, props: {page: Login}},
    {path: "/verify/:verificationToken", component: Verify},

    {path: "/dashboard", component: ClientLayout, props: {page: ClientDashboard}},

    {path: "/admin/", redirect: "/admin/dashboard"},
    {path: "/admin/dashboard", component: AdminLayout, props: {page: AdminDashboard}},

    {path: "/rooms", component: PlayLayout, props: {page: Dashboard}},
    {path: "/play/:socketRoomId/client", component: PlayClient},
    {path: "/play/:socketRoomId/client/preview", component: PlayLayout, props: {page: PlayClient}},
    {path: "/play/:socketRoomId/admin", component: PlayLayout, props: {page: PlayAdmin}},

    {path: "/websocket-monitor", component: WebsocketMonitor},

  ]
})
