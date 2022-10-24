<template>
    <div>
        <el-row>
            <el-col :span="5" :offset="1">
                <div>

                    <!--增加+-->
                    <div class="toolbars" style="display: flex">
                        <div style="margin-bottom:30px;width:500px;margin-right:50px">
                            <div class="link" :class="isActive===1?'activeUorR':''" style="" @click="cutUser">用户</div>
                            <el-button 
                                icon="el-icon-circle-plus-outline" 
                                :disabled="isActive===1? false:true" 
                                class="addusers" 
                                @click="addusers"
                            ></el-button>
                            <div class="link" :class="isActive===2?'activeUorR':''" @click="cutRole">角色</div>
                            <el-button 
                                icon="el-icon-circle-plus-outline" 
                                :disabled="isActive===2? false:true" 
                                class="addroles" 
                                @click="addroles"
                            ></el-button>
                        </div>
                        <div>
                            <el-button @click="goBack">返回</el-button>
                        </div>
                    </div>
                </div>
            </el-col>
            <!--权限-->
        </el-row>
        <div class="tableWrap">
            <div class="changeMenu">
                <div class="bluePart">
                    <div v-if="isApps===1" class="btnMenu">
                        <div 
                            :class="isChose===1?'activeBtn':''" 
                            :istype="curtype" 
                            style="cursor: pointer;line-height:70px" 
                            @click="choosePoint" 
                        >站点</div>
                        <div 
                            :class="isChose===2?'activeBtn':''" 
                            :istype="curtype" 
                            style="cursor: pointer;line-height:70px" 
                            @click="chooseMould"
                        >模板</div>
                    </div>
                    <div v-else class="btnMenu">
                        <div 
                            :class="isChose===1?'activeBtn':''" 
                            :istype="curtype" 
                            style="cursor: pointer" 
                            @click="choosePoint" 
                        >频道</div>
                        <div 
                            :class="isChose===2?'activeBtn':''" 
                            :istype="curtype" 
                            style="cursor: pointer" 
                            @click="chooseMould"
                        >文章</div>
                    </div>
                </div>
            </div>
            <el-table
                :data="isActive===1?userData:roleData"
                border
                class="tables"
                style="width: 100%"
                @row-click="getCurrentData"
            >
                <el-table-column
                    v-if="isActive===1"
                    prop="username"
                    label="用户名"
                >
                </el-table-column>
                <el-table-column
                    v-if="isActive===2"
                    prop="name"
                    label="角色名"
                >
                </el-table-column>
                <el-table-column
                    label="全选"
                    align="center"
                >
                    <template v-slot="{row}">
                        <span v-if="isApps===1">
                            <el-checkbox 
                                v-if="isChose===1" 
                                :checked="matchIds[row.id]===undefined 
                                    ||matchIds[row.id]===null
                                    ||matchIds[row.id]===''
                                    ||(matchIds[row.id].length !== temps[0].app.length)?false:true" 
                                @change="handleCheckAllChange"
                            ></el-checkbox>
                            <el-checkbox 
                                v-if="isChose===2" 
                                :checked="matchIds[row.id]===undefined 
                                    ||matchIds[row.id]===null
                                    ||matchIds[row.id]===''
                                    ||(matchIds[row.id].length !== temps[0].template.length)?false:true" 
                                @change="handleCheckAllChange"
                            ></el-checkbox>
                        </span>
                        <span v-else>
                            <el-checkbox 
                                v-if="isChose===1" 
                                :checked="matchIds[row.id]===undefined 
                                    ||matchIds[row.id]===null
                                    ||matchIds[row.id]===''
                                    ||(matchIds[row.id].length !== temps[0].channel.length)?false:true" 
                                @change="handleCheckAllChange"
                            ></el-checkbox>
                            <el-checkbox 
                                v-if="isChose===2" 
                                :checked="matchIds[row.id]===undefined 
                                    ||matchIds[row.id]===null
                                    ||matchIds[row.id]===''
                                    ||(matchIds[row.id].length !== temps[0].article.length)?false:true" 
                                @change="handleCheckAllChange"
                            ></el-checkbox>
                        </span>
                    </template>
                </el-table-column>
                <template v-if="isApps===1">
                
                    <el-table-column
                        v-for="item in (isChose===1?temps[0].app:temps[0].template)"
                        :key="item.id"
                        align="center"
                        prop="item.id"
                        :label="item.name"
                    >
                        <template v-slot="{row}">
                            <span v-if="isCheckedSure(row.id,item.id)">
                                <el-checkbox :checked="true" :true-label="item.id" @change="handleCheckedCitiesChange"></el-checkbox>
                            </span>
                            <span v-else>
                                <el-checkbox :key="item.id" :true-label="item.id" @change="handleCheckedCitiesChange"></el-checkbox>
                            </span>
                        </template>
                    </el-table-column>
                
                </template>
                <template v-if="isApps===0">
                    <el-table-column
                        v-for="item in (isChose===1?temps[0].channel:temps[0].article)"
                        :key="item.id"
                        align="center"
                        prop="item.id"
                        :label="item.name"
                    >
                        <template v-slot="{row}">
                            <span v-if="isCheckedSure(row.id,item.id)">
                                <el-checkbox :checked="true" :true-label="item.id" @change="handleCheckedCitiesChange"></el-checkbox>
                            </span>
                            <span v-else>
                                <el-checkbox :key="item.id" :true-label="item.id" @change="handleCheckedCitiesChange"></el-checkbox>
                            </span>
                        </template>
                    </el-table-column>
                </template>
            </el-table>

        </div>

        <!-- 添加用户 -->
        <Adduser ref="user" :get-user-list="userData" :app-id="currId" :is-apps="isApps" @addUser="addUserList"></Adduser>
        <!-- 添加角色 -->
        <Addrole ref="role" :get-role-list="roleData" :app-id="currId" :is-apps="isApps" @addRole="addRoleList"></Addrole>
    </div>
</template>

<script>
import { mapState, mapActions} from 'vuex'
import { showLoading, showError, confirm } from '../../../utils'
import Adduser from './adduser.vue'
import Addrole from './addrole.vue'

export default {
    name:'Linkuser',
    components:{
        Adduser,
        Addrole
    },
    data(){

        return{
            curtype: this.$route.query.appId ? 'app' : 'channel',
            currentPage4: 1,
            testVal:true,
            curId:126,
            currentId:"",
            currentArrObj:{},
            currentData:[],
            matchIds:{},
            isIndeterminate: true,
            checkedCities: [] ,
            checkAll:false,
            current:0,
            currents:0,
            showUserList:true,
            showRoleList:false,
            isApps:1,
            isSitePiont:1,
            //选中权限的ID数组
            siteId:[],
            //选中频道的ID数组
            templateId:[],
            //站点的ID和标识
            currId:0,
            appId:this.$route.query.appId,
            appTag:this.$route.query.siteTag,
            //频道的ID和标识
            channelId:this.$route.query.channelId,
            channelTag:this.$route.query.channelTag,
            uid:Number,
            rid:Number,
            channeltype:{
                module: 'channel'
            },
            sitetype:{
                module:'app',
            },
            newPermList:{},
            userData:[],
            roleData:[],
            perms:{},
            perm:{},
            appUserType: {
                type: this.$route.query.siteTag
                    ? this.$route.query.siteTag
                    : this.$route.query.channelTag,
                id: this.$route.query.appId
                    ?this.$route.query.appId
                    : this.$route.query.channelId,
                perms: {},
                mode:''
            },
            appRoleType: {
                type: this.$route.query.siteTag
                    ? this.$route.query.siteTag
                    : this.$route.query.channelTag,
                id: this.$route.query.appId
                    ?this.$route.query.appId
                    : this.$route.query.channelId,
                perms: {},
                mode:''
            },
            isActive:1,
            isChose:1,
            viewId:null,
            viewTempId: null,
            viewChannelId:null,
            viewArticleId: null,
            createSiteId:[],
            createTemplateId:[],
        }
    },
    computed:{

        ...mapState('system/authority', ['channelList','temps','appList','linkuser']),
    },
    watch:{
        userData:{
            handler(newValue, oldValue) {
                if(newValue !== null && newValue.length > 0){
                    this.uid = newValue[0].id
                }
            },
            deep: true
        },
        roleData:{
            handler(newValue, oldValue) {
                if(newValue !== null && newValue.length > 0){
                    this.rid = newValue[0].id;
                }
            },
            deep: true
        },
        matchIds:{
            handler(newValue, oldValue) {

            },
            deep: true
        },

    },

    created(){
    },
    mounted(){
        this.init();
    },
    methods:{
        ...mapActions('system/authority', ['channelPermList','sitePermList','appPermUpdate','channelPermUpdate']),
        isCheckedSure(curId,itemId){
            if(this.matchIds[curId]!==undefined){
                return [...this.matchIds[curId]].indexOf(itemId)!==-1?true:false
            } else{
                return false;
            }

        },
        getCurrentData(row, column, event){
            this.currentId = row.id;
        },
        handleCheckAllChange(val) {
            if(this.isActive===1){
                this.currentData = this.userData;
                this.userData = [];
            }else{
                this.currentData = this.roleData;
                this.roleData = [];
            }


            let arr = [];
            if(val){
                if(this.isApps===1){
                    if(this.isChose === 1){
                        for(let i = 0 ; i < this.temps[0].app.length ; i++){
                            arr.push(this.temps[0].app[i].id);
                        }
                    }else{
                        for(let i = 0 ; i < this.temps[0].template.length ; i++){
                            arr.push(this.temps[0].template[i].id);
                        }
                    }
                }else{
                    if(this.isChose === 1){
                        for(let i = 0 ; i < this.temps[0].channel.length ; i++){
                            arr.push(this.temps[0].channel[i].id);
                        }
                    }else{
                        for(let i = 0 ; i < this.temps[0].article.length ; i++){
                            arr.push(this.temps[0].article[i].id);
                        }
                    }
                }
            }
            this.matchIds[this.currentId] = arr;
            if(this.isApps===1){
                if(this.isChose===1){
                    this.currentArrObj = [...this.matchIds[this.currentId]];
                }else{
                    this.currentArrObj = [...this.matchIds[this.currentId]];
                }
            }else{
                if(this.isChose===1){
                    this.currentArrObj = [...this.matchIds[this.currentId]];
                }else{
                    this.currentArrObj = [...this.matchIds[this.currentId]];
                }
            }
            this.saveNew();

        },

        handleCheckedCitiesChange(value,event) {
            if(this.isActive===1){
                this.currentData = this.userData;
                this.userData = [];
            }else{
                this.currentData = this.roleData;
                this.roleData = [];
            }
            let permissIdStr = event.srcElement.outerHTML;
            let permissId = permissIdStr.split("true-value=\"")[1].substring(0,permissIdStr.split("true-value=\"")[1].indexOf("\""))
            if(!value){
                let arr = new Set(this.matchIds[this.currentId]);
                if(arr.size>0){
                    arr.delete(Number(permissId))
                }
                this.matchIds[this.currentId]=[...arr];
            }else{
                let arrSet = new Set(this.matchIds[this.currentId]);
                arrSet.add(Number(permissId));
                this.matchIds[this.currentId]=[...arrSet];
            }

            if(this.isApps===1){
                if(this.isChose===1){
                    this.currentArrObj = [...this.matchIds[this.currentId]];
                }else{
                    this.currentArrObj = [...this.matchIds[this.currentId]];
                }
            }else{
                if(this.isChose===1){
                    this.currentArrObj = [...this.matchIds[this.currentId]];
                }else{
                    this.currentArrObj = [...this.matchIds[this.currentId]];
                }
            }

            this.saveNew();
            //点击复选框 存储权限
        },



        //站点管理点进去
        siteView (isChecked, val,) {
            this.viewId = null
            this.temps[0].app.map(item => {
                if (item.type === 1) this.viewId = item.id
            })
            if (val.type !== 1) {
                this.siteId = [...new Set([...this.siteId, this.viewId])]
            } else {
                if (!isChecked) {
                    confirm('如果取消，则会清空其他操作，确认取消吗？', '警告', {
                        ok: async () => {
                            this.siteId = []
                        },
                        cancel: async () => {
                            this.siteId.push(this.viewId)
                        },
                    })
                }
            }
        },
        templateView (isChecked, val) {
            this.viewTempId = null
            this.temps[0].template.map(item => {
                if (item.type === 1) this.viewTempId = item.id
            })
            if (val.type !== 1) {
                this.templateId = [...new Set([...this.templateId, this.viewTempId])]
            } else {
                if (!isChecked) {
                    confirm('如果取消，则会清空其他操作，确认取消吗？', '警告', {
                        ok: async () => {
                            this.templateId = []
                        },
                        cancel: async () => {
                            this.templateId.push(this.viewTempId)
                        },
                    })
                }
            }
        },
        //频道管理点进去
        channelView (isChecked, val,) {
            this.viewChannelId = null
            this.temps[0].channel.map(item => {
                if (item.type === 1) this.viewChannelId = item.id
            })
            if (val.type !== 1) {
                this.siteId = [...new Set([...this.siteId, this.viewChannelId])]
            } else {
                if (!isChecked) {
                    confirm('如果取消，则会清空其他操作，确认取消吗？', '警告', {
                        ok: async () => {
                            this.siteId = []
                        },
                        cancel: async () => {
                            this.siteId.push(this.viewChannelId)
                        },
                    })
                }
            }
        },
        articleView (isChecked, val) {
            this.viewArticleId = null
            this.temps[0].article.map(item => {
                if (item.type === 1) this.viewArticleId = item.id
            })
            if (val.type !== 1) {
                this.templateId = [...new Set([...this.templateId, this.viewArticleId])]
            } else {
                if (!isChecked) {
                    confirm('如果取消，则会清空其他操作，确认取消吗？', '警告', {
                        ok: async () => {
                            this.templateId = []
                        },
                        cancel: async () => {
                            this.templateId.push(this.viewArticleId)
                        },
                    })
                }
            }
        },


        init(){
            setTimeout(() => {
            //请求后台数据
                if(this.$route.query.appId){
                    this.isApps = 1;
                    this.currId = Number(this.$route.query.appId)
                }else{
                    this.isApps = 0;
                    this.currId = Number(this.$route.query.channelId)
                }
                this.getPermListNew()
            }, 300)
        },

        getPermListNew(){
            showLoading(true, '正在加载用户列表')
            this.sitetype['id'] = Number(this.currId)
            //isApps === 1  是站点或者模板
            if(this.isApps){
                if(this.curtype === 'app') {
                    this.sitetype['type'] = 'app'
                }else if(this.curtype === 'template') {
                    this.sitetype['type'] = 'template'
                }
                this.sitePermList({...this.sitetype})
                    .then((data) => {
                        this.matchIds={};
                        this.currentArrObj={}
                        this.newPermList = data
                        var linkuser = JSON.parse(localStorage.getItem('linkuser'+this.isApps+Number(this.currId)))
                        var linkrole = JSON.parse(localStorage.getItem('linkrole'+this.isApps+Number(this.currId)))
                        this.userData = linkuser
                        this.roleData =  linkrole
                        this.getLeftData(data.data);
                        if(this.isActive===1){
                            if(this.currentData.length>0){
                                this.userData = this.currentData;
                            }

                            for(let key = 0 ; key < Object.keys(data.data.users).length ; key++ ){
                                
                                let userId = Object.keys(data.data.users)[key];
                                // let arr = data.data.users[userId];
                                if(this.isChose === 1){
                                    this.matchIds[userId] = this.getApps(data.data.users[userId]);
                                }else{
                                    this.matchIds[userId] = this.getTemplateIds(data.data.users[userId]);
                                }

                            }
                        }else if(this.isActive===2){
                            //角色
                            
                            if(this.currentData.length>0){
                                this.roleData = this.currentData;
                            }
                            for(let key = 0 ; key < Object.keys(data.data.roles).length ; key++ ){
                                let roleId = Object.keys(data.data.roles)[key];
                                // let arr = data.data.roles[roleId];
                                if(this.isChose === 1){
                                    this.matchIds[roleId] = this.getApps(data.data.roles[roleId]);
                                }else{
                                    this.matchIds[roleId] = this.getTemplateIds(data.data.roles[roleId]);
                                }
                            }
                        }
                        showLoading(false)
                    })
                    .catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
            }else{
                if(this.curtype === 'channel') {
                    this.sitetype['type'] = 'channel'
                } else if(this.curtype === 'article') {
                    this.sitetype['type'] = 'article'
                }
                this.sitetype['module'] = 'channel'
                this.sitetype['id'] = this.$route.query.channelId
                this.channelPermList({...this.sitetype})
                    .then((data) => {
                        this.matchIds={};
                        this.currentArrObj={}
                        this.newPermList = data
                        var linkuser = JSON.parse(localStorage.getItem('linkuser'+this.isApps+Number(this.currId)))
                        var linkrole = JSON.parse(localStorage.getItem('linkrole'+this.isApps+Number(this.currId)))
                        this.userData = linkuser
                        this.roleData =  linkrole
                        this.getLeftData(data.data);
                        if(this.isActive===1){
                            if(this.currentData.length>0){
                                this.userData = this.currentData;
                            }
                            for(let key = 0 ; key < Object.keys(data.data.users).length ; key++ ){

                                let userId = Object.keys(data.data.users)[key];
                                // let arr = data.data.users[userId];
                                if(this.isChose === 1){
                                    this.matchIds[userId] = this.getChannelIds(data.data.users[userId]);
                                }else{
                                    this.matchIds[userId] = this.getArticleIds(data.data.users[userId]);
                                }

                            }
                        }else if(this.isActive===2){
                            if(this.currentData.length>0){
                                this.roleData = this.currentData;
                            }
                            for(let key = 0 ; key < Object.keys(data.data.roles).length ; key++ ){
                                let roleId = Object.keys(data.data.roles)[key];
                                // let arr = data.data.roles[roleId];
                                if(this.isChose === 1){
                                    this.matchIds[roleId] = this.getChannelIds(data.data.roles[roleId]);
                                }else{
                                    this.matchIds[roleId] = this.getArticleIds(data.data.roles[roleId]);
                                }
                            }
                        }
                        showLoading(false)
                    })
                    .catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
            }

        },
        goBack () {
            this.$router.go(-1)
        },
        toshow(){
            var arr=[];
            var userOrrole = 0;
            var arrApp=[]
            var arrTemplateIds =[]
            var arrChannelIds = []
            var arrArticleIds = []

            if(this.isApps===1){
                if(this.isActive === 1){
                    arr = this.newPermList.data.users;
                    userOrrole = this.uid

                }else{
                    arr = this.newPermList.data.roles
                    userOrrole = this.rid
                }

                this.perms = {};
                this.perms["id"] = Number(this.currId);
                if(arr[userOrrole] === undefined){
                    this.siteId = [];
                    this.templateId = [];
                    showLoading(false)
                    return;
                }
                arrApp = this.getApps(arr[userOrrole]);
                arrTemplateIds =  this.getTemplateIds(arr[userOrrole])
                this.perms={};
                this.perms["apps"] = arrApp;
                this.perms["templates"] = arrTemplateIds;
                this.siteId = arrApp;
                this.templateId = arrTemplateIds;

            }else{
                if(this.isActive === 1){
                    arr = this.newPermList.data.users;
                    userOrrole = this.uid

                }else{
                    arr = this.newPermList.data.roles
                    userOrrole = this.rid
                }

                this.perms = {};

                if(arr[userOrrole] === undefined){
                    this.siteId = [];
                    this.templateId = [];
                    showLoading(false)
                    return;
                }


                arrChannelIds = this.getChannelIds(arr[userOrrole]);
                arrArticleIds = this.getArticleIds(arr[userOrrole])
                this.perms["channels"] = arrChannelIds;
                this.perms["articles"] = arrArticleIds;
                this.siteId = arrChannelIds;
                this.templateId = arrArticleIds;
            }
        },

        //站点进入，显示已授权列表
        _sitePermList(type) {
            showLoading(true, '正在加载用户列表')
            this.sitetype['id'] = Number(this.currId)

            if(this.isApps===1){
                this.sitePermList({...this.sitetype})
                    .then((data) => {
                        var arr=[];
                        var userOrrole = 0;
                        if(type === 1){
                            arr = data.data.users;
                            userOrrole = this.uid

                        }else{
                            arr = data.data.roles
                            userOrrole = this.rid
                        }

                        this.perms = {};
                        this.perms["id"] = Number(this.currId);
                        if(arr[userOrrole] === undefined){
                            this.siteId = [];
                            this.templateId = [];
                            showLoading(false)
                            return;
                        }

                        var arrApp = this.getApps(arr[userOrrole]);
                        var arrTemplateIds =  this.getTemplateIds(arr[userOrrole])
                        this.perms={};
                        this.perms["apps"] = arrApp;
                        this.perms["templates"] = arrTemplateIds;
                        this.siteId = arrApp;
                        this.templateId = arrTemplateIds;


                        showLoading(false)


                    })
                    .catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
            }else{
                this.channeltype['id'] = Number(this.currId)
                this.channelPermList({...this.channeltype})
                    .then((data) => {
                        var arr=[];
                        var userOrrole = 0;
                        if(type === 1){
                            arr = data.data.users;
                            userOrrole = this.uid

                        }else{
                            arr = data.data.roles
                            userOrrole = this.rid
                        }

                        this.perms = {};
                        /*this.perms["id"] = Number(this.currId);*/

                        if(arr[userOrrole] === undefined){
                            this.siteId = [];
                            this.templateId = [];
                            showLoading(false)
                            return;
                        }


                        var arrChannelIds = this.getChannelIds(arr[userOrrole]);
                        var arrArticleIds = this.getArticleIds(arr[userOrrole])
                        this.perms["channels"] = arrChannelIds;
                        this.perms["articles"] = arrArticleIds;
                        this.siteId = arrChannelIds;
                        this.templateId = arrArticleIds;


                        showLoading(false)


                    })
                    .catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
            }

        },

        getLeftData(arr){
            var userArr = [];
            var roleArr = [];
            for(var key1 in arr.users){
                var obj1 = {}
                obj1.id = key1;
                obj1.username = arr.users[key1].name;
                userArr.push(obj1)
            }
            this.userData = userArr;
            for(var key2 in arr.roles){
                var obj2 = {}
                obj2.id = key2;
                obj2.name = arr.roles[key2].name
                roleArr.push(obj2);
            }
            this.roleData = roleArr;
        },
        getApps(arr){
            var arrRetrun = [];
            for( var j = 0 ; j < arr.perm.length ; j++){

                for(let i = 0;i<this.temps[0].app.length;i++){
                    if(arr.perm[j] === this.temps[0].app[i].id){
                        arrRetrun.push(arr.perm[j])
                        break;
                    }

                }
            }
            return arrRetrun;

        },



        getTemplateIds(arr){
            var arrRetrun = [];
            for( var j = 0 ; j < arr.perm.length ; j++){
                for(let i = 0;i<this.temps[0].template.length;i++){
                    if(arr.perm[j] === this.temps[0].template[i].id){
                        arrRetrun.push(arr.perm[j])
                        break;
                    }
                }
            }
            return arrRetrun;

        },


        getChannelIds(arr){
            var arrRetrun = [];
            for( var j = 0 ; j < arr.perm.length ; j++){
                for(let i = 0;i<this.temps[0].channel.length;i++){
                    if(arr.perm[j] === this.temps[0].channel[i].id){
                        arrRetrun.push(arr.perm[j])
                        break;
                    }
                }
            }
            return arrRetrun;

        },

        getArticleIds(arr){
            var arrRetrun = [];
            for( var j = 0 ; j < arr.perm.length ; j++){
                for(let i = 0;i<this.temps[0].article.length;i++){
                    if(arr.perm[j] === this.temps[0].article[i].id){
                        arrRetrun.push(arr.perm[j])
                        break;
                    }
                }
            }
            return arrRetrun;

        },


        toChangeRight(){
            this.uid = Number(this.userData[0].id),
            this.perms['id'] = Number(this.currId)
            this._sitePermList(this.userData[0].id,this.isActive)
        },


        sitePerm(val){
            if(this.isApps === 1){
                this.perms['apps'] = val
            }else{
                this.perms['channels'] = val
            }
        },
        templatePerm(val){
            if(this.isApps === 1){
                this.perms['templates'] = val
            }else{
                this.perms['articles'] = val
            }
        },

        // save(){

        //     if(this.isApps===1){
        //         if(this.isActive === 1){
        //             this._appUserPermUpdate()
        //         }else if(this.isActive === 2){
        //             this._appRolePermUpdate()
        //         }
        //     }else {
        //         if(this.isActive === 1) {
        //             this._channelUserPermUpdate()
        //         }else if(this.isActive === 2){
        //             this._channelRolePermUpdate()
        //         }

        //     }

        // },

        saveNew(){
            //是否是站点
            if(this.isApps===1){
                // isActive用户 = 1
                if(this.isActive === 1){
                    this._appUserPermUpdateNew()
                }else if(this.isActive === 2){
                    this._appRolePermUpdateNew()
                }
                //是频道
            }else {
                if(this.isActive === 1) {
                    this._channelUserPermUpdateNew()
                }else if(this.isActive === 2){
                    this._channelRolePermUpdateNew()
                }

            }

        },

        _appUserPermUpdateNew() {
            showLoading(true, '正在保存用户权限')
            var objPerm = {};
            objPerm[this.currentId] = this.currentArrObj
            this.appUserType.perms = JSON.stringify(objPerm)
            this.appUserType['mode'] = 'user'
            this.appPermUpdate({...this.appUserType})
                .then(() => {
                    this.userData = this.currentData;
                    showLoading(false)
                })
                .catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
        },

        _appRolePermUpdateNew() {
            showLoading(true, '正在保存角色权限')
            var objPerm = {};
            objPerm[this.currentId] = this.currentArrObj
            this.appRoleType.perms = JSON.stringify(objPerm)
            this.appRoleType['mode'] = 'role'
            this.appPermUpdate({...this.appRoleType})
                .then(() => {
                    this.roleData = this.currentData;
                    showLoading(false)
                })
                .catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
        },

        _channelUserPermUpdateNew() {
            showLoading(true, '正在保存用户权限')
            /* this.perm[this.currId] = this.perms*/
            var objPerm = {};
            objPerm[this.currentId] = this.currentArrObj
            this.appUserType['mode'] = 'user'
            this.appUserType.perms = JSON.stringify(objPerm)
            this.appUserType['id'] = this.$route.query.channelId
            this.channelPermUpdate({...this.appUserType})
                .then(() => {
                    this.userData = this.currentData;
                    showLoading(false)
                })
                .catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
        },

        _channelRolePermUpdateNew() {
            showLoading(true, '正在保存角色权限')
            /* this.perm[this.currId] = this.perms*/
            var objPerm = {};
            objPerm[this.currentId] = this.currentArrObj
            this.appRoleType['mode'] = 'role'
            this.appRoleType.perms = JSON.stringify(objPerm)
            this.appRoleType['id'] = this.$route.query.channelId
            this.channelPermUpdate({...this.appRoleType})
                .then(() => {
                    this.roleData = this.currentData;
                    showLoading(false)
                })
                .catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
        },

        //频道进入，显示已授权列表
        _channelPermList() {
            showLoading(true, '正在加载用户列表')
            this.channeltype['id'] = Number(this.$route.query.channelId)
            this.channelPermList({...this.channeltype})
                .then(() => {
                    showLoading(false)
                })
                .catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
        },
        /*新增用户*/
        addusers() {
            // this.showUserList = true
            // this.showRoleList = false
            // this.isActive = 1;
            this.currentData=this.userData;
            // this.userData = [];
            this.$refs.user.adduser = true
        },
        /*新增角色*/
        addroles(){
            this.currentData=this.roleData;
            // this.roleData = [];
            this.$refs.role.addrole = true
        },
        cutUser(){
            this.showUserList = true
            this.showRoleList = false
            this.isActive = 1;
            if(this.userData.length > 0){
                this.uid = Number(this.userData[0].id,)
                this.perms['id'] = Number(this.currId)
                this.toshow()
            }
            this.choosePoint()
            // this.currentData=this.userData;
            // // this.userData = [];
            // this.$refs.user.adduser = true

        },
        cutRole(){
            this.showUserList = false
            this.showRoleList = true
            this.isActive = 2;
            if(this.roleData.length > 0) {
                this.rid = Number(this.roleData[0].id),
                this.perms['id'] = Number(this.currId)
                this.toshow()
            }
            this.choosePoint()
            // this.currentData=this.roleData;
            // // this.roleData = [];
            // this.$refs.role.addrole = true
        },


        choosePoint(){
            if(this.isApps === 1) {
                this.curtype = 'app'
            }else {
                this.curtype = 'channel'
            }
            //isActive为1是用户，2为角色
            this.isChose = 1;
            if(this.isActive===1){
                //isChose为1是站点或者频道，2是模板或者文章
                this.appUserType.type = 'app'
                this.currentData = this.userData;
                this.userData = [];
                if(this.$route.query.channelTag) {
                    this.appUserType.type = 'channel'
                }
            }else{
                this.appRoleType.type = 'app'
                this.currentData = this.roleData;
                this.roleData = [];
                if(this.$route.query.channelTag) {
                    this.appRoleType.type = 'channel'
                }
            }
            this.getPermListNew();
        },

        /*新增*/
        chooseMould(or){
            if(this.isApps === 1) {
                this.curtype = 'template'
            }else {
                this.curtype = 'article'
            }
            if(this.isActive===1) {
                
                //模板
                this.appUserType.type = 'template'
                this.currentData = this.userData;
                this.userData = [];
                if(this.$route.query.channelTag) {
                    this.appUserType.type = 'article'
                }
            }else{
                
                this.appRoleType.type = 'template'
                this.currentData = this.roleData;
                this.roleData = [];
                if(this.$route.query.channelTag) {
                    this.appRoleType.type = 'article'
                }
            }
            this.isChose =2;
            this.getPermListNew();
        },



        addUser(){
            this.$refs.user.adduser = true
        },
        addRole(){
            this.$refs.role.addrole = true
        },
        addUserList(val) {
            if(val.length){
                this.currentData = val;
                this.userData = val;

            }else{
                this.userData = this.currentData
            }
            this.getPermListNew()


        },
        addRoleList(val){

            if(val.length){
                this.currentData = val;
                this.roleData = val
            }else{
                this.roleData = this.currentData
            }
            this.getPermListNew()



        },
        userId(userLink,index){
            this.uid = userLink.id,
            this.perms['id'] = Number(this.currId)
            this.current = index
            this._sitePermList(1)

        },
        roleId(roleLink,index){
            this.rid = roleLink.id,
            this.perms['id'] = Number(this.currId)
            this.currents = index
            this._sitePermList(2)
        },
        back(){
            this.$router.go(-1)
        }
    },

}
</script>
<style lang="scss" scoped>
    ul{
        padding: 0;
        width:80%;
        height: 400px;
        border: 1px solid #333;
        overflow-y:scroll;
        > li {
            font-size: 14px;
            padding-left: 10px;
            cursor: pointer;
            // &:hover,
            // &.active {
            //     background: #409eff;
            //     color: #fff;
            //     border-radius: 2px;
            // }
        }
    }
    .link{
        float: left;
        // display: inline-block;
        width: 120px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border: 1px solid #d6d6d6;
        border-right: none;
        color: #5b5b5a;
        // margin:0 30px 0 10px;
        cursor:pointer;
        font-size:14px;
    }
    .toolbars {
        width:700px;
    }
    .addusers {
        float: left;
        margin-right: 50px;
        border-radius: initial;
        height: 42px;
        // border: 1px solid #d6d6d6;
    }
    .addroles {
        float: left;
        border-radius: initial;
        height: 42px;
        // border: 1px solid #d6d6d6;
    }
    .perm{
        font-size: 14px;
        color: #333;
        margin-bottom: 50px
    }

    .active{
        color:#FFF;
        background:#0099FF;
        border: 1px solid #d6d6d6;

    }

    .activeUorR{
        color: #fff;
        border: 0px;
        display: inline-block;
        background-color:#2E9CD1 ;
        border: 1px solid #d6d6d6;
    }


    .changeMenu{
       /* margin-left: 4.16667%;*/
        height: 80px;
        line-height: 80px;
    }

    .bluePart{
        border-bottom: 0px;
        width: 100%;
        background-color: #E0F0FF;
        height: 47px;
        line-height: 47px;

    }


    .btnMenu{
        margin-left: 10px;
        display: flex;
        height: 50px;
        line-height: 50px;
        width: 300px;

    }


    .btnMenu div{
        width: 50%;
        height: 50px;
        line-height: 50px;
        text-align: center;

    }


    .activeBtn{
        background-color: #fff;
        color: #2e9ad0;
        height: 40px !important;
        margin-top: 10px;
        line-height: 45px !important
    }


    .tableWrap{
        margin-left: 4.16667%;
    }

    .table{
        border: 1px solid gainsboro;
    }

   /*.table tr{

             border: 1px solid gainsboro;
         }*/

    .table td{

        border: 1px solid gainsboro;

    }
 /deep/ tr .cell {
     font-weight: 400
 }
/deep/ .has-gutter {
    th {
        background: #FFF !important;
        color: #1A1A1A
    }
}

</style>
