import Vue from 'vue'
import { Button,Input,Form,FormItem,Message,MenuItemGroup,Menu,MenuItem,Submenu,Breadcrumb ,BreadcrumbItem, Dropdown,DropdownMenu,DropdownItem,Tag} from 'element-ui'

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
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Tag)

