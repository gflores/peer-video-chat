import Vue from 'vue'
import App from './App.vue'
import moment from "moment";

import './mixins/main-store.js';
import './mixins/util-functions.js';

Vue.config.productionTip = false

let tmpRoomId;
let tmpSelector;

if (window.Silverchat != null) {
  tmpRoomId = window.Silverchat.roomId;
  tmpSelector = window.Silverchat.selector;  
}

window.Silverchat = {
  init({roomId, selector}) {
    new Vue({
      render: h => h(App, {
        props: {roomId}
      })
    }).$mount(selector);
  }
};

if (tmpRoomId != null && tmpSelector != null) {
  Silverchat.init({roomId: tmpRoomId, selector: tmpSelector});
  Silverchat.roomId = tmpRoomId;
  Silverchat.selector = tmpSelector;
}