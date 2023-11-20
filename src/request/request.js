import axios from "axios"

const instance = axios.create({
    //基础路径
    baseURL: "http://tech.wolfcode.cn:23683",
    //请求过期时间
    timeout: 10000
})

//请求拦截器
instance.interceptors.request.use(config => {
    return config;
},err => {
    return Promise.reject(err);
})

//响应拦截器
instance.interceptors.response.use(res => {
    return res.data;
},err => {
    return Promise.reject(err);
})

export default instance