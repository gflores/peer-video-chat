import Vue from 'vue'
import App from './App.vue'
import router from './router'
import moment from "moment";

import './mixins/main-store.js';
import './mixins/util-functions.js';

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

