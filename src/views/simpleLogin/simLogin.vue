<template>
    <div class="simpleLogin">
        <!-- <el-skeleton :rows="7" animated />
        <el-skeleton :rows="7" animated /> -->
        <!-- 备份 -->
        <div class="loading" v-if="isLoading">
            <p><span class="el-icon-loading"></span></p>
            <p>登录验证中</p>
        </div>
        <div class="error" v-else>
            <img
                style="width:45%"
                src="../../assets/images/forbidden.png"
                alt=""
            >
            <div style="">
                抱歉，当前服务加载繁忙 您可以
                <router-link to="/">
                    去登录
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { queryUrlString } from "../../utils/BaseUtil";
export default {
    data() {
        return {
            isLoading: true
        }
    },
    created(){
        this.getLogin()
    },
    methods:{
        ...mapActions("authen", ["simpleLogin"]),
        ...mapActions('login', ['loadVerCodeURL']),
        getLogin() {
            let t = queryUrlString('t')
            this.simpleLogin({ ticket: t })
                    .then((indexRoute) => {
                        console.log(indexRoute)
                        // showLoading(false)
                        if(!indexRoute){
                            this.isLoading = false
                            // indexRoute = '/'
                            
                        }
                        this.isLoading = true
                        this.$router.push({path: indexRoute})
                        sessionStorage.setItem('LastLog',true)
                        
                    })
                    .catch(error => {
                        this.isLoading = false
                        this.loadVerCodeURL()
                        // showLoading(false);
                        // showMessage({ message: error.message || '登录失败', type: "error" });
                    });
        }
    }
}
</script>
<style lang="scss" scoped>
.simpleLogin{
    height: 100%;
    position: relative;
    .loading{
        width: 40%;
        height: 100px;
        color: #409EFF;
        text-align: center;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .el-icon-loading{
            font-size: 30px;
        }
    }
    .error{
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>