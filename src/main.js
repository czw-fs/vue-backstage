import Vue from 'vue'
//重置浏览器的初始样式 npm i reset-css
import 'reset-css'
import App from './App.vue'
//引入路由组件 npm i vue-router
import router from './router'
//引入Vuex
import store from './store'
//引入element-ui
import './plugins/element.js'

Vue.config.productionTip = false

new Vue({
  //使用路由
  router,
  //使用Vuex
  store,
  render: h => h(App)
}).$mount('#app')
