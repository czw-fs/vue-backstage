import Vue from 'vue'
import { Button,Input,Form, FormItem ,Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)

Vue.prototype.$message = Message
