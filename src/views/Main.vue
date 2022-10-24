<template>
    <el-container class="hz-theme-dark hz-container">
        <el-aside :class="'hz-left-aside '+( collapsed ? 'hz-left-aside-collapsed' : '' )">
            <div class="zoom" @click="setCollapsed">
                <i :class="collapsed ? 'el-icon-d-arrow-right' :'el-icon-d-arrow-left'"></i>
                <span :class="collapsed ? flexible ='展开' : flexible = '收起'">{{flexible}}</span>
            </div>
            <el-header class="hz-top-header hz-left-top-header">
                <router-link to="/">
                    <img src="../assets/images/logo.png" class="logo" alt :title="$t('title')" />
                </router-link>
            </el-header>
            <!-- 右侧菜单 -->
            <div class="sider-menu sider-menu-fixed">
                <SiderMenu :collapsed="collapsed" />
            </div>
            <!-- 右侧菜单 -->
        </el-aside>
        <!--内容部分-->
        <el-container class="hz-r-dark">
            <!--页头部分-->
            <el-header class="hz-top-header hz-right-top-header">
                <div class="top-header-left">
                    <div class="main-title">内容管理系统</div>
                </div>
                <div class="top-header-right">
                    <div class="info">
                        <div
                            class="info-pic"
                            @mouseover="showInfo = true"
                            @mouseout="showInfo = false"
                        >您好，{{userinfo.username}}</div>
                        <el-collapse-transition>
                            <div
                                v-show="showInfo"
                                class="select-info"
                                @mouseover="showInfo = true"
                                @mouseout="showInfo = false"
                            >
                                <ul>
                                    <li>
                                        <router-link tag="div" to="/profile/base">
                                            <i class="el-icon-user"></i>
                                            <span style="padding-left: 10px">个人信息</span>
                                        </router-link>
                                    </li>
                                    <!-- <li>
                                        <router-link tag="div" to="/profile/passwd">
                                            <i class="el-icon-s-tools"></i>
                                            <span style="padding-left: 10px">修改密码</span>
                                        </router-link>
                                    </li> -->
                                    <li style="border:none" @click="quit">
                                        <i class="el-icon-s-fold"></i>
                                        <span style="padding-left: 10px">退出</span>
                                    </li>
                                </ul>
                            </div>
                        </el-collapse-transition>
                    </div>
                    <!-- 站点选择 -->
                    <div v-if="isMatchCMS" style="font-family: cursive;color:#33ccFF;">当前站点：</div>
                    <div v-if="isMatchCMS" style="font-family: cursive;" class="right-site">
                        <SiteSelect />
                    </div>
                    <!--语言选择-->
                </div>
            </el-header>

            <!-- 面包屑 -->
            <Breadcrumb />
            <!-- 面包屑 -->

            <el-main>
                <router-view/>
                <!-- <router-view style="min-height: 96%" /> -->
                <!-- <div v-if="display" class="copyright">Copyright © 2019 hzinfor All Rights Reserved</div> -->
            </el-main>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.hz-r-dark{
    flex:1;
}
.el-main {
    padding: 0 10px !important;
}
.info {
    .el-input__inner {
        border: none !important;
    }
}
.copyright {
    padding-top: 15px;
    border-top: 1px solid #EEE;
    text-align: center;
    color:#9A9A9A !important;
    font-size: 12px;
}
</style>

<script>
import { mapState,mapActions } from "vuex";
import SiderMenu from './siderMenu/SiderMenu.vue'
import Breadcrumb from './Breadcrumb.vue'
import { enableI18n } from '../setting'
import SiteSelect from '../components/SiteSelect'
import { showSiteDropmenu } from '../modules/cms/router/cmsRoute'
export default {
    name: "MainContainer",
    components: {
        SiderMenu,
        Breadcrumb,
        SiteSelect
    },
    data() {
        return {
            enableI18n,
            collapsed: false,
            currentRoute: '',
            active: true,
            flexible: '收起',
            showInfo: false
        };
    },
    computed: {
        ...mapState("authen", ["userinfo"]),
        ...mapState("footer", ["display"]),
        isMatchCMS() {
            return showSiteDropmenu(this.currentRoute)
        }
    },
    watch: {
        $route(route) {
            this.currentRoute = route.fullPath
        }
    },
    created() {
        this.currentRoute = this.$route.fullPath
    },
    methods: {
        ...mapActions('system/log',['addLog']),
        setCollapsed() {
            this.collapsed = !this.collapsed;
        },
        async quit() {
            this.$confirm('确认退出','提示', {
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warnning'
            }).then(async()=>{
                await this.addLog({
                    value:'登出'
                });
                this.$router.push('/logout');
            })
        },

    }
};
</script>
