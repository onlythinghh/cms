<template>
    <div class="home">
        <div class="shortcut">
            <el-row :gutter="20" type="flex" justify="start" >
                <el-col :span="6" class="skip">
                    <router-link :to="{name:'Examine',params:{time: 3}}">
                        <div class="shortcut-img"><img src="../../../assets/images/daiban.png" alt="总待办事项"></div>
                        <div class="manage">
                            <p>待办事项({{examineCount}})</p>
                        </div>
                    </router-link>
                </el-col>
                <el-col :span="6" class="skip">
                    <router-link to="/cms/article/article-list">
                        <div class="shortcut-img"><img src="../../../assets/images/article.png" alt="文章管理"></div>
                        <div class="manage">文章管理</div>
                    </router-link>
                </el-col>
                <el-col :span="6" class="skip">
                    <router-link to="/cms/sites/site-list" >
                        <div class="shortcut-img"><img src="../../../assets/images/site.png" alt="站点管理"></div>
                        <div class="manage">站点管理</div>
                    </router-link>
                </el-col>
                <el-col :span="6" class="skip">
                    <router-link to="/cms/channel/channel-list" >
                        <div class="shortcut-img"><img src="../../../assets/images/channel.png" alt="频道管理"></div>
                        <div class="manage">频道管理</div>
                    </router-link>
                </el-col>
            </el-row>
        </div>
        <div class="news">
            <div class="articleList" style="height:100%;width:100%;margin-top:10px;">
                <el-row :gutter="10" type="flex" justify="start">
                    <el-col :span="24"><div class="news-title">最新发布新闻</div></el-col>
                </el-row>
                <el-row v-for="(item,index) in news" :key="index" class="statistics-content" type="flex" justify="start">
                    <el-col class="content-img" :span="4">
                        <img v-if="item.photo" :src="item.photo" >
                        <img v-else src="../../../assets/images/noimage.jpg">
                    </el-col>
                    <el-col :span="20">
                        <div class="content-title">{{item.articleTitle}}</div>
                        <div class="content-content" style="font-size: 14px">
                            <span>站点：{{item.appTitle}}</span>
                            <span style="margin-left: 40px; color:#a6a6a6">频道：{{item.channelTitle}}</span>
                        </div>
                        <div v-if="item.summary" class="content-content">摘要：{{item.summary}}</div>
                        
                        <div class="content-au-time">
                            <span class="content-author">作者：{{item.author}}</span>
                            <span class="content-pubTime">发布时间：{{ item.publishTime | dateFormat }}</span>
                        </div>
                    </el-col>
                </el-row>  
            </div>
        </div>
        <el-dialog
            :title="pwdTit"
            :visible.sync="setPasswd"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            width="30%"
            center
            >
            <Passwd />
            </el-dialog>
    </div>
</template>
<script>

import { mapActions,mapState} from 'vuex'
import {showLoading, showError} from "../../../utils"
import { dateFormat } from '../../../utils/BaseUtil'
import "../../../assets/css/home.scss"
import Passwd from "../profile/passwd.vue";

export default {
    name:"Home",

    components:{
        Passwd
    },

    data() {
        return {
            pwdTit:'首次登录密码重置',
            setPasswd:false,
            activeIndex:'',
            examineCount: 0
        };
    },
    computed: {
        ...mapState('authen', ['userinfo']),
        ...mapState("system/home", ["data","news"]),
        
    },

    created(){
        this.loadSites()
        this.loadShortcut()
        this.searchList()
        setTimeout(()=>{
            this.first()
        })
    },
    methods:{
        
        ...mapActions("system/home", [
            "getShortcutList"
        ]),
        ...mapActions("cms/site",[
            "loadSites"
        ]),
        ...mapActions("cms/examine", ["getlist"]),
        
        loadShortcut() {
            showLoading(true, "正在加载图文列表");
            this. getShortcutList()
                .then((data) => {
                    showLoading(false);
                })
                .catch(error => {
                    showLoading(false);
                    showError(error.message);
                });
        },
        async searchList() {
            // 参数参考内容审核页
            let appid = ''
            if (JSON.parse(sessionStorage.getItem("SITE"))) appid = JSON.parse(sessionStorage.getItem("SITE")).id;
            // console.log('appid',appid)
            let res = await this.getlist({
                time: 3, // 时间段
                name: "",
                state: 0, // 审核状态
                pass: 0, // 节点状态
                all: true, // 所有站点
                inst: null,
                appid: appid,
                // page: this.page,
                // limit: this.limit,
            });
            // console.log('res', res)
            if(res.success) {
                this.examineCount = res.count
            }
        },
        first(){
            var v = sessionStorage.getItem('LastLog')
            if(v && this.userinfo.lastLoginTime){
                this.$notify({
                    title:'欢迎回来，上次登录时间',
                    message:`${dateFormat(this.userinfo.lastLoginTime)}`,
                    offset:100
                })
                sessionStorage.removeItem('LastLog')
                // if(this.userinfo.first){
                //     this.pwdTit = '首次登录密码重置'
                //     this.setPasswd = true
                // }else if(this.userinfo.longDay){
                //     this.pwdTit = '六个月内未修改重置密码'
                //     this.setPasswd = true
                // }else{
                //     this.$notify({
                //         title:'欢迎回来，上次登录时间',
                //         message:`${dateFormat(this.userinfo.lastLoginTime)}`,
                //         offset:100
                //     })
                //     sessionStorage.removeItem('LastLog')
                // }
            }
        }
    },
}
</script>

