import axios from "axios"
import { Message } from 'element-ui'
const instance = axios.create({
    //基础路径
    baseURL: "http://tech.wolfcode.cn:23683",
    //请求过期时间
    timeout: 10000
})

//请求拦截器
instance.interceptors.request.use(config => {

    //有token且访问的不是登录页面，则发送请求时，将token放到请求头中
    const token = localStorage.getItem("edb-authorization-token")
    if(token && !config.url.endsWith("/login") && !config.url.endsWith("/captchaImage") ){
        config.headers["Authorization"] = "Bearer " +token
    }
    return config
},err => {
    return Promise.reject(err);
})

//响应拦截器
instance.interceptors.response.use(res => {
    let res_data = res.data

    if(res_data.code!=200){
        Message.error(res_data.msg || '网络请求错误');
        // 只要不是200，都会走这里
        if(res_data.code==401){
            // 401一般表示token过期或者没有带
            localStorage.removeItem("edb-authorization-token");
            router.push("/login")
        }



        // 这里return不是为了结束函数，实际上是把return值传到组件中的res
        return false
    }
    //返回请求数据
    return res.data;
},err => {
    return Promise.reject(err);
})

export default instance