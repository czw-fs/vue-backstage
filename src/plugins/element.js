import Vue from 'vue'
import { Button,Input,Form, FormItem ,Message } from 'element-ui'
//全局引入element样式
// import 'element-ui/lib/theme-chalk/index.css'

// 按需应用element-ui组件
Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)

Vue.prototype.$message = Message
