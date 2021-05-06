import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import Vld from './v-vld'
Vue.config.productionTip = false
Vue.use(Vld)
Vue.use(ElementUI)

Vld.extend(
  'lteX',
  (v, x) => Number(v) <= Number(x),
  (field) => field + '不能大于 x'
)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
