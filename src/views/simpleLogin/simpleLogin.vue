<template>
    <div class="loginbag">
        <div class="logo_box" :style="setStyle">
            <img src="../../assets/images/logo.png">
        </div>
        <div class="login">
        <div class="title">官网内容管理系统</div>
            <div class="login-title">
                <div class="languages-group">
                    <span v-if="enableI18n" class="languages">
                        <lang-select/>
                    </span>
                </div>
                <!-- <div class="logo">
                    <img src="../../assets/images/bd-login.png">
                </div> -->
                <!-- <div class="info">政务新媒体运行管理平台</div> -->

            </div>
            <!-- <div><img src="../../assets/images/map.png" alt=""></div> -->
            <div class="login-bottom">
                <div class="login-form">
                    <div class="login_text">用户登录</div>
                    <el-form ref="loginForm" size="medium" :model="loginForm" :rules="loginFormRules" label-position="left">
                        <el-form-item prop="account" label="">
                            <el-input
                                v-model="loginForm.account"
                                autofocus
                                auto-complete="off"
                                prefix-icon="el-icon-user"
                                maxlength="50"
                                @keyup.13.native="loginKey"
                            />
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input
                                v-model="loginForm.password"
                                type="password"
                                auto-complete="off"
                                prefix-icon="el-icon-lock"
                                show-password
                                maxlength="50"
                                @keyup.13.native="loginKey"
                            />
                        </el-form-item>
                        <el-form-item v-if="enableVerCode" prop="vcode" class="vcode">
                            <el-row :gutter="5">
                                <el-col :span="14">
                                    <el-input
                                        v-model="loginForm.vcode"
                                        type="text"
                                        prefix-icon="el-icon-unlock"
                                        maxlength="4"
                                        @keyup.13.native="loginKey"
                                    />
                                </el-col>
                                <el-col :span="5" >
                                    <img
                                        class="vscode"
                                        :src="verCodeURL"
                                        title="验证码"
                                        style="margin-left: -2px"
                                        @click="changeVerCode"
                                    >
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item prop="rememberMe">
                            <el-row :gutter="10">
                                <el-col
                                    v-if="enableRememberMe"
                                    :span="enableFotgot ? 12:24"
                                    style="text-align:left;"
                                >
                                    <el-checkbox v-model="loginForm.rememberMe">记住我7天</el-checkbox>
                                </el-col>
                                <el-col
                                    v-if="enableFotgot"
                                    :span="enableRememberMe ? 12:24"
                                    style="text-align:right;"
                                >
                                    <a href="javascript:;" @click="showForgot">忘记密码?</a>
                                </el-col>
                            </el-row>
                        </el-form-item>

                        <el-form-item class="poeration">
                            <el-button type="primary" class="el-button-block" @click="submit">登录系统</el-button>
                            <!-- <el-button type="primary" class="el-button-block" @click="cancel">重 置</el-button> -->
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <!-- <div class="LoginCopyright">版权所有：上海慧洲信息技术有限公司</div> -->
        </div>
    </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { showLoading, showMessage } from "../../utils";
import { enableI18n } from '../../setting'
import { session } from '../../utils/WebStore'
export default {
    name: "simpLogin",
    data() {
        return {
            enableI18n,
            formName: "loginForm",
            setStyle: {
                padding: "60px 0 0 60px",
                display: "block"
            },
            loginForm: {
                account: "",
                password: "",
                vcode: "",
                rememberMe: true
            },
            loginFormRules: {
                account: {
                    required: true,
                    message: "登录名不能为空"
                },
                password: {
                    required: true,
                    message: "密码不能为空"
                },
                vcode: [
                    {
                        validator: (rule, value, callback) => {
                            if (this.enableVerCode) {
                                if (!value) {
                                    callback('验证码不能为空')
                                } else if (!/^[\da-zA-Z]+$/.test(value)) {
                                    callback('验证码只能输入数字和字母')
                                } else {
                                    callback()
                                }
                            } else {
                                callback()
                            }
                        }
                    }
                ]
            },
            ssoid: session.get('ssoid')
        };
    },
    computed: {
        ...mapState("authen", ["lastLoginAccount"]),
        ...mapState("login", [
            "enableVerCode",
            "enableRememberMe",
            "enableFotgot",
            "verCodeURL"
        ]),
    },
    created() {
        console.log('router', this.$router)
        console.log('route', this.$route)
        this.loginForm.account = this.lastLoginAccount;
        this.loadVerCodeURL()
    },
    mounted() {
        if (!this.ssoid) {
            this.ssoid = 2 + Math.random()
            session.set('ssoid', this.ssoid)
        }
        // this.loginSSO(this.ssoid)
        //     .then((indexRoute) => {
        //         if(!indexRoute){
        //             indexRoute = '/'
        //         }
        //         this.$router.push(indexRoute)
        //     })
        //     .catch(error => {
        //         console.error(error)
        //     })
        window.onresize = () => {
            let filHeight = document.documentElement.clientHeight
            // console.log('filHeight',filHeight)
            if(filHeight<=750) {
                this.setStyle.display = "none"
            } else {
                this.setStyle.display = "block"
            }
            if(filHeight<=900) {
                this.setStyle.padding = "10px"
            } else {
                this.setStyle.padding = "60px 0 0 60px"
            }
        }
    },
    methods: {
        ...mapActions("authen", ["login", "loginSSO"]),
        ...mapActions('login', ['loadVerCodeURL']),
        ...mapMutations('login', ['setVerCodeURL']),
        loginKey() {
            this.submit()
        },
        changeVerCode() {
            this.setVerCodeURL(this.verCodeURL.replace(/^([\S\s]+)&v=.*$/, '$1') + '&v=' + Math.random())
        },
        showForgot() {
            /* this.$notify.success({
                title: this.$t("login-form.fotgot.text"),
                dangerouslyUseHTMLString: true,
                message: `${this.$t("contactAdmin")} <br/>${this.$t(
                    "email"
                )}：xxxx@hzinfor.com <br/> ${this.$t("phone")}: xx-xxxxxxxxxxxx`
            }); */
        },
        submit() {
            this.$refs[this.formName].validate((valid) => {
                if (!valid) {
                    return false;
                }
                showLoading("正在登录")
                localStorage.removeItem('channelData')
                const verCodeToken = this.verCodeURL.replace(/^.*token=(\w+)&?.*$/, '$1')
                this.login({ ...this.loginForm, token: verCodeToken })
                    .then((indexRoute) => {
                        showLoading(false)
                        // if(!indexRoute){
                        //     indexRoute = '/'
                        // }
                        sessionStorage.setItem('LastLog',true)
                        this.$router.push({name: 'Examine'})
                        // this.$router.go(0)
                    })
                    .catch(error => {
                        this.loadVerCodeURL()
                        showLoading(false);
                        showMessage({ message: error.message || '登录失败', type: "error" });
                    });
            });
        },
        cancel() {
            this.loginForm = {}
        },
        ssologin() {
            this.loginSSO(this.ssoid)
                .then((indexRoute) => {
                    if(!indexRoute){
                        indexRoute = '/'
                    }
                    this.$router.push(indexRoute)
                })
                .catch(error => {
                    console.error(error)
                    const ssourl = "https://sso.cypc.com.cn/profile/oauth2/authorize" +
                        "?client_id=QvFWMfcKJ5&response_type=code&state=" + this.ssoid + 
                        "&redirect_uri=" + encodeURIComponent('https://ctgcy.cypc.com.cn/html/sso/back') + 
                        "&oauth_timestamp=" + new Date().getTime() + "&target_uri=" + location.href;
                    // const ssourl = 'http://localhost:3001/html/sso/back?code=ST-66787-BAQH3OWJ1BDBWQGEEOR1&target_uri='
                    // + encodeURIComponent(location.href) + '&state=2';
                    window.open(ssourl, '_self');
                });
            return false;
        }
    }
};
</script>
<style lang="scss" scoped>
/deep/.el-form-item__label {
    padding: 0;
    color:#fff;
    text-align: right;
    &:before{
        display: none;
    }
}
/deep/.el-input__inner{
    border-radius: 0;
    // border: none;
    background-color: #FFF !important;
    // opacity: 0.5;
}
/deep/ .el-form {
    // margin-right: -20px;
}
/deep/ .el-input__icon{
    // display: none
}
/deep/ .el-form-item__content{
    width: 300px;
    .el-button{
        // width: 85px;
        float: left;
        margin-right:10px;
    }
    .el-button:last-child {
        margin-right:0px;
    }
}
.poeration{
    // margin-left:80px;
}
.el-button-block{
    border: none;
    width: 100%;
    height: 42px;
    background: #fd7869;
    // background: linear-gradient(#24c175,#008948,#24c175);
    // // background: linear-gradient(#1598d0,#066bc5,#1598d0,);
    &:focus{
        background: #fd7869;
        // background: linear-gradient(#24c175,#008948,#24c175);
    }
    &:hover{
        background: #f16d5e;
        // background: linear-gradient(#008948,#24c175,#008948);
    }

}
/deep/.el-button--medium{
    font-size: 16px;
    padding: 10px 0!important;
    border-radius: 0 !important;
}
/deep/ .el-col-14 {
    width: 60%;
}
</style>


