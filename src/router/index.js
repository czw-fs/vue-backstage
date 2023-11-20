import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from "@/store"
import {GetUserRoutersApi} from "@/request/api"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'mainlayout',
    component: () => import(/* webpackChunkName: "mainlayout" */ '../views/layout/MainLayout.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to,from,next)=>{
  // 【重点】：只有next()是放行， 里面传了路径就变成跳转到，跳转到就会重新执行守卫的代码(这个函数)
  const token = localStorage.getItem("edb-authorization-token")
  // 管理系统常见的两个经典的逻辑：
  // 1、如果用户访问登录页面， 但是token已经存在， 跳转到首页
  if(to.path==="/login" && token){
    next("/");  // 跳转到   
    return
  }
  // 2、如果用户访问不是登录页面，但是没有token，跳转到登录页面
  if(to.path!=="/login" && !token){
    next("/login")
    return
  }




  

  if(token && store.state.userMenuData.menuData.length==0){
    // 获取用户的菜单数据
    let GetUserRoutersApiRes = await  GetUserRoutersApi();
    console.log("用户菜单数据GetUserRoutersApiRes为：",GetUserRoutersApiRes);
    if(!GetUserRoutersApiRes)return;
    // 请求到的GetUserRoutersApiRes这个数据，和我们要的menuData，结构上不太一样
    // 所以就需要通过它GetUserRoutersApiRes，来生成我们自己想要的menuData。
    let newUserMenuData = [{title: "首页",path:"/",icon: "dashboard",}]
    let ret = GetUserRoutersApiRes.data.map(item=>{
      if(item.children){
        return {
            title: item.meta.title,
            icon: item.meta.icon,
            path: item.path,
            children: item.children.map(sitem=>{
              return{
                title:sitem.meta.title,
                path:item.path+"/"+sitem.path
              }
            })
        }  
      }else{
        return {
          title: item.meta.title,
          path: item.path,
          icon: item.meta.icon,
        }
      }
      
    })
    newUserMenuData = [...newUserMenuData,...ret];
    // store.commit("文件夹名称/方法名", 要传的参数)
    // this.$store 这个是组件里面的写法
    store.commit("userMenuData/changeMenuData",newUserMenuData)
  }







  
  next()  // 放行
})
// router.beforeEach((to,from,next)=>{

//   const token = localStorage.getItem("edb-authorization-token")
//   // 管理系统常见的两个经典的逻辑：
//   // 1、如果用户访问登录页面， 但是token已经存在， 跳转到首页
//   if(to.path==="/login" && token){
//     next("/");
  
//   }else
//   // 2、如果用户访问不是登录页面，但是没有token，跳转到登录页面
//   if(to.path!=="/login" && !token){
//     next("/login")
    
//   }else{
//     next()
//   }
// })



export default router
