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
    component: () => import(/* webpackChunkName: "mainlayout" */ '../views/layout/MainLayout.vue'),
    redirect:"/home",
    //子路由动态生成
    // children:[
      // {
      //   path:"/home",
      //   component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue')
      // },
      // {
      //   path:"/customer/customer",
      //   component: () => import(/* webpackChunkName: "customer" */ '../views/customer/Customer.vue')
      // },
      // {
      //   path:"/customer/visit",
      //   component: () => import(/* webpackChunkName: "visit" */ '../views/customer/Visit.vue')
      // },
      // {
      //   path:"/flow/definition",
      //   component: () => import(/* webpackChunkName: "definition" */ '../views/flow/Definition.vue')
      // }
    // ]
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
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "404" */ '../views/404.vue')
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

  // if(token && vuex中menuData为0){
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
      // 以上----生成菜单数据
      // 以下----生成用户可以访问的路由数据
      let newChildrenRoutes=[{
        path:"/home",
        component: () => import('../views/HomeView.vue')
      }]
      GetUserRoutersApiRes.data.forEach(item=>{

          let ret = item.children.map(sitem=>{
            return {
              path:item.path+"/"+sitem.path,
              component: () => import(`../views${item.path}/${sitem.name}.vue`),
              meta:{
                titles: [item.meta.title,sitem.meta.title]
              }
            }
          })
          newChildrenRoutes = [...newChildrenRoutes,...ret]

      });

      console.log(newChildrenRoutes);

      // 要把这个生成好的数组添加到mainlayout路由里面的children，做为子路由
      // router.addRoute(父路由名称，单个子路由对象);
      newChildrenRoutes.forEach(item=>{
        router.addRoute("mainlayout",item); 
      });

      // 这个to.path要写. 
      // 如果直接next()，路由还没有完整，还是个空的。它不确定路由里面有没有这个路径。
      // 加了to.path之后，会重新走一遍路由守卫，此时路由添加完毕，可以检查出用户能不能访问这个路径
      next(to.path);
      return

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


const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function(location) {
  return originalPush.call(this, location).catch(err => {})
};
export default router
