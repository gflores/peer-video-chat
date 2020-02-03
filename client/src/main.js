import Vue from 'vue'
import App from './App.vue'
import moment from "moment";

import './mixins/main-store.js';
import './mixins/util-functions.js';

Vue.config.productionTip = false

let tmpData = null;

if (window.Silverchat != null) {
  tmpData = window.Silverchat.d;
}

window.Silverchat = {
  init({roomId, selector, isMicRequired = true}) {
    new Vue({
      render: h => h(App, {
        props: {roomId, isMicRequired}
      })
    }).$mount(selector);
  }
};

if (tmpData != null) {
  Silverchat.init({
    roomId: tmpData.roomId,
    selector: tmpData.selector,
    isMicRequired: tmpData.isMicRequired
  });
  Silverchat.d = tmpData;
}