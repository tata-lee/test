// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'element-ui/lib/theme-chalk/index.css';
import 'view-design/dist/styles/iview.css';
import 'mavon-editor/dist/css/index.css';
import ElementUI from 'element-ui';
import ViewUI from 'view-design';
import mavonEditor from 'mavon-editor';
import VueCookies from 'vue-cookies';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/index';
import { basicHttp, basicHttpNew } from './api/basic';

Vue.use(VueCookies);
Vue.use(ElementUI);
Vue.use(ViewUI);
Vue.use(mavonEditor);
Vue.config.productionTip = false;

Vue.prototype.$http = basicHttp;
Vue.prototype.$newHttp = basicHttpNew;
Vue.prototype.$error = s => Vue.prototype.$Message.error(s);
Vue.prototype.$info = s => Vue.prototype.$Message.info(s);
Vue.prototype.$success = s => Vue.prototype.$Message.success(s);

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
