import Vue from 'vue'
import { Button,Input,Form,FormItem,Message,MenuItemGroup,Menu,MenuItem,Submenu } from 'element-ui'

Vue.prototype.$message = Message;
// 注册
Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(MenuItemGroup)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)