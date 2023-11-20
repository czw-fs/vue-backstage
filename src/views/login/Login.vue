<template>
    <div class="login-page">
        <div class="login-box">
            <h1>e店邦O2O平台</h1>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="'密\xa0\xa0\xa0\xa0码'" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captchacode">
            <div class="captcha-box">
                <el-input v-model.number="ruleForm.captchacode"></el-input>
                <img height=40 :src="captchaSrc" alt="" @click="getCaptchacode">
            </div>
        </el-form-item>
        <el-form-item id="login-btn-box">
            <el-button class="login-btn" type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </el-form-item>
        </el-form>
        </div>
    </div>
</template>

<script>
import {validateUsername} from "../../utils/validate"
import {getCatpchaCodeApi,loginApi} from "../../request/api"
export default {
    name: 'V2EdbManagementLogin',

    data () {
        return {
            ruleForm: {
                //用户名
                username:'qdtest1',
                //密码
                password:'123456',
                //验证码
                captchacode:'888888'
            },
            rules:{
                username:[
                    {
                        required: true, //必填项
                        message: '用户名不能为空', //没写的提示信息
                        trigger:'blur' // 失去焦点时触发
                    },
                    //自定义校验规则
                    {
                        validator:  validateUsername,
                        trigger: 'blur' 
                    }
                ],
                password:[
                    {
                        required: true, //必填项
                        message: '密码不能为空', //没写的提示信息
                        trigger:'blur' // 失去焦点时触发
                    }
                ],
                captchacode:[
                    {
                        required: true, //必填项
                        message: '密码不能为空', //没写的提示信息
                        trigger:'blur' // 失去焦点时触发
                    }
                ]
            },
            //base64 加密后的图形验证码
            captchaSrc:''
        };

    },
    created(){
        //获取验证码
        getCatpchaCodeApi().then(res=>{
            if(res.code === 200){
                this.captchaSrc = 'data:image/gif;base64,' + res.img;
                //保存uuid，传递给后端，座位登录凭证
                localStorage.setItem("edb-capthca-uuid",res.uuid)
            }else{
                this.$message.error(res.msg);
            }
        })
    },

    methods: {
        //获取验证码图片
        async getCaptchacode(){
            //发送请求
            let res = await getCatpchaCodeApi()

            //响应拦截器返回false，说明后端数据异常，终止方法
            if(res == false){
                return;
            }
            
            //获取base64编码的验证码图片字符串
            this.captchaSrc = 'data:image/gif;base64,' + res.img;
            //保存uuid，传递给后端，座位登录凭证
            localStorage.setItem("edb-capthca-uuid",res.uuid)
        },
        //提交表单的验证
        submitForm(formName) {
            //进行前段自定义的表单验证
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    //验证通过
                    //发起登录请求
                    let res = await loginApi({
                        username: this.ruleForm.username,
                        password: this.ruleForm.password,
                        code: this.ruleForm.captchacode,
                        uuid: localStorage.getItem("edb-capthca-uuid")
                    })
                  
                    //响应拦截器返回false，说明后端数据异常，终止方法
                    if(res == false){
                        return;
                    }

                    //提示用户登录成功
                    this.$message({//弹出消息
                        message: res.msg,
                        type: 'success'
                    });

                    //清除uuid
                    localStorage.removeItem("edb-capthca-uuid")
                    //保存token
                    localStorage.setItem("edb-authorization-token",res.token)
                    //跳转首页
                    this.$router.push("/");
                } else {
                    //验证失败
                    this.$message({//弹出消息
                        message: '用户名或密码错误',
                        type: 'warning'
                    });
                    return false;
                }
            });
      },
    }

}
</script>

<style lang="less" scoped>
.login-page{
    width: 100%;
    height: 100%;
    background: url(../../assets/images/loginBg.jpg) center top no-repeat;
    position: relative;
    .login-box{
        width: 400px;
        background-color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        padding-top: 20px;
        padding-right: 40px;
        border-radius: 20px;
        h1{
            text-align: center;
            margin-bottom: 20px;
            padding-left: 40px;
            font-size: 20px;
        }

        .captcha-box{
            display: flex;
            img{
                margin-left:20px;
            }
        }

        .login-btn{
            width: 100%;
        } 
        /* 样式覆盖的写法！ ::v-deep */
        ::v-deep #login-btn-box .el-form-item__content{
            margin-left: 40px!important;
        }
    }
}  
</style>