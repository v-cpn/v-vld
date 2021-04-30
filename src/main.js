import Vue from "vue";
import App from "./App.vue";
import Vld from "./v-vld";
Vue.config.productionTip = false;
Vue.use(Vld);
new Vue({
  render: (h) => h(App),
}).$mount("#app");
