import instance from "./request"

//所有请求
export const getCatpchaCodeApi = () => instance.get("/prod-api/captchaImage");
//登录请求
export const LoginApi = (params) => instance.post("/prod-api/login",params);
//获取用户可以访问的路由
export const GetUserRoutersApi = () => instance.get("/prod-api/getRouters");

// 获取用户信息
export const GetUserInfoApi = () => instance.get("/prod-api/getInfo");