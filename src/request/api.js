import instance from "./request"

//所有请求
export const getCatpchaCodeApi = () => instance.get("/prod-api/captchaImage");

export const loginApi = (params) => instance.post("/prod-api/login",params)