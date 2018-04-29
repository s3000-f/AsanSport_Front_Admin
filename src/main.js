// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import {store} from './store/store'
import Notifications from 'vue-notification'
import FullCalendar from 'vue-full-calendar'



Vue.use(BootstrapVue)
Vue.use(Notifications)
Vue.use(FullCalendar);

Vue.mixin({
  methods: {
    toPersianNumber: (number) => {
      let result = String(number);
      result = result.replace(new RegExp('1', 'g'), '۱');
      result = result.replace(new RegExp('2', 'g'), '۲');
      result = result.replace(new RegExp('3', 'g'), '۳');
      result = result.replace(new RegExp('4', 'g'), '۴');
      result = result.replace(new RegExp('5', 'g'), '۵');
      result = result.replace(new RegExp('6', 'g'), '۶');
      result = result.replace(new RegExp('7', 'g'), '۷');
      result = result.replace(new RegExp('8', 'g'), '۸');
      result = result.replace(new RegExp('9', 'g'), '۹');
      result = result.replace(new RegExp('0', 'g'), '۰');
      return result;
    }
  }
})
/* eslint-disable no-new */
new Vue({
  store: store,
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
