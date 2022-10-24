<template>
    <div> 
        <div v-if="showSearch" class="search">
            <div style="float:left" class="searchTitle">请输入站点名称：</div>
            <div 
                style="width: 200px;float:left "
            ><el-input v-model="name" placeholder="请输入站点" min-width="200px" @change="isSearch = false"></el-input></div>
            <el-button type="primary" icon="el-icon-search" style="margin-left: 20px" @click="search">搜索</el-button>
        </div>
        <img src="" alt="">
        <div v-if="user">
            <TableRow :has-header="true">
                <el-table
                    :data="tableData.length ? tableData : tableDatas"
                    row-key="id"
                    border
                    :row-style="rowStyle"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}" 
                >
                    <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
                    <el-table-column label="站点名称" prop="name" width="190"></el-table-column>
                    <el-table-column label="选择频道和文章" width="140">
                        <template v-slot="{row}">
                            <el-button type="primary" :disabled="disabled" size="mini" @click="toChannel(row)">选择频道和文章</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="全选" width="50">
                        <template v-slot="{ row }">
                            <el-checkbox
                                v-model="row.allShow"
                                :indeterminate="isIndeterminate"
                                @change="handleCheckAllChange(row)"
                            ></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column label="权限操作">
                        <template v-slot="{ row }">
                            <div class="itemList">
                                <div>站点：</div>
                                <div class="checkboxList">
                                    <el-checkbox-group
                                        v-model="row.siteIds"
                                        @change="siteSelect(row,'app')"
                                    >
                                        <el-checkbox
                                            v-for="item in row.temps[0].app"
                                            :key="item.id"
                                            :label="item.id"
                                            class="sendson"
                                            @change="siteView($event, item, row)"
                                        >{{item.name}}</el-checkbox>
                                    </el-checkbox-group>
                                </div>
                            </div>

                            <div class="itemList">
                                <div style="width: 47px;">模板：</div>
                                <div class="checkboxList">
                                    <el-checkbox-group
                                        v-model="row.templateIds"
                                        @change="templateSelect(row,'template')"
                                    >
                                        <el-checkbox
                                            v-for="item in row.temps[0].template"
                                            :key="item.id"
                                            :label="item.id"
                                            class="sendson"
                                            @change="templateView($event, item, row)"
                                        >{{item.name}}</el-checkbox>
                                    </el-checkbox-group>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </TableRow>
            <el-row style="margin-top:20px;text-align: center;padding-bottom:15px">
                <el-button type="primary" style="margin-right:50px;" @click="saveSelect">保存</el-button>
                <el-button @click="back">返回</el-button>
            </el-row>
            <More ref="more" v-model="isShowModal" :appid="ids" :is-user="isUser" :empty="empty"></More>
        </div>
        <div v-else>
            <Linkuser />
        </div>

    </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { showLoading, showError, confirm, showMessage } from "../../../utils";
import { deepCopy } from "@/utils/BaseUtil";
import More from "./more.vue";
import Linkuser from "./linkuser.vue";
// import { jsxOpeningElement } from '@babel/types';
export default {
    name: "Authority",
    components: {
        More,
        Linkuser
    },
    data() {
        return {
            isSearch: false,
            tableData: [],
            showSearch:false,
            name:'',
            disabled:false,
            isIndeterminate: false,
            checkAll: true,
            is_checked: false,
            // checked_app: false,
            isShowModal: true,
            showIndexArr: [],
            ids: 0,
            appList: [],
            userId: this.$route.query.userId,
            userTag: this.$route.query.userTag,
            roleId: this.$route.query.roleId,
            roleTag: this.$route.query.roleTag,
            user:
                this.$route.query.userTag || this.$route.query.roleTag
                    ? true
                    : false,
            // user: false,
            isUser:1,
            siteIds: [],
            templateIds: [],
            perms: {},
            types: {
                module: this.$route.query.userTag
                    ? this.$route.query.userTag
                    : this.$route.query.roleTag,
                ids: this.$route.query.userId
                    ? this.$route.query.userId
                    : this.$route.query.roleId,
                type: 1,
                perms: {}
            },
            roletype: {
                module: this.$route.query.userTag
                    ? this.$route.query.userTag
                    : this.$route.query.roleTag,
                ids: this.$route.query.roleId
                    ? this.$route.query.roleId
                    : this.$route.query.userId,
                type: 1,
                perms: {}
            },
            echoUser: {
                module: this.$route.query.userTag
                    ? this.$route.query.userTag
                    : this.$route.query.roleTag,
                id: this.$route.query.userId
                    ? this.$route.query.userId
                    : this.$route.query.roleId,
                type: 1
            },
            echoRole: {
                module: this.$route.query.roleTag
                    ? this.$route.query.roleTag
                    : this.$route.query.userTag,
                id: this.$route.query.roleId
                    ? this.$route.query.roleId
                    : this.$route.query.userId,
                type: 2
            },
            //已选的站点操作
            userEchoApps:[],
            userEchoTemp:[],
            echoId:'',
            //未选状态的站点操作
            appTemps:[],
            //未选状态的频道操作
            unselectedTemp:[],
            viewId:null,
            viewTempId: null,
            timer:'',
            empty: false
        };
    },
    computed: {
        
        ...mapState("cms/site", ["sites"]),
        ...mapState("system/authority", ["temps", "userEcho"]),

        tableDatas() {
            const deep = arr => {
                arr.map(item => {
                    if (item.children && item.children.length)
                        deep(item.children);
                    item.siteIds = [];
                    item.templateIds = [];
                    item.temps = this.temps;
                    item.allShow = false;
                });
                return arr;
            };
            return deep(deepCopy(this.sites));
        }
    },
    watch: {
        temps (v) {
            v[0].app.map(item => {
                if (item.type === 1) this.viewId = item.id
            })
        }
    },
    created() {
        this.$route.query.roleId || this.$route.query.userId ? this.showSearch = true : false
        this._loadSites();
    },
    mounted() {
    },

    methods: {
        rowStyle({row, rowIndex}) {
            if(this.name !== '') {
                if (this.isSearch && row.name.indexOf(this.name) !== -1) {
                    return {
                        background: '#EEE'
                    }
                }
            }
            
            
        },
        filterData(siteDatas = []){
            return siteDatas.map(({children, ...item})=>{
                const itemData = {...item}
                itemData.children = []
                if(item.name.indexOf(this.name) > -1){
                    if(children && children.length > 0){
                        itemData.children = this.filterData(children).filter(Boolean)
                    }
                    return itemData;
                }
                if(children && children.length > 0){
                    const isFiltered = this.filterData(children, itemData.children).filter(Boolean)
                    if(isFiltered.length > 0){
                        itemData.children = isFiltered
                        return itemData
                    }
                }
                return false
            })
        },
        search(){
            this.tableData= this.filterData(this.tableDatas).filter(Boolean)
            this.isSearch = true
        },
        siteView (isChecked, val, row) {
            this.viewId = null
            row.temps[0].app.map(item => {
                if (item.type === 1) this.viewId = item.id
            })
            if (val.type !== 1) {
                row.siteIds = [...new Set([...row.siteIds, this.viewId])]
            } else {
                if (!isChecked) {
                    confirm('如果取消站点查看 将无法选择频道和文章，确认取消吗？', '警告', {
                        ok: async () => {  
                            this.empty = true
                            row.siteIds = [],
                            this.perms[row.id]["apps"] = [];
                        },
                        cancel: async () => {
                            row.siteIds.push(this.viewId)
                            if(row.siteIds.length === row.temps[0].app.length && row.templateIds.length === row.temps[0].template.length){
                                row.allShow = true
                            }
                        },
                    }) 
                } else {
                    this.empty = false
                }
            }
        },
        templateView (isChecked, val, row) {
            this.viewTempId = null
            row.temps[0].template.map(item => {
                if (item.type === 1) this.viewTempId = item.id
            })
            if (val.type !== 1) {
                row.templateIds = [...new Set([...row.templateIds, this.viewTempId])]
            } else {
                if (!isChecked) {
                    confirm('如果取消，则会清空其他操作，确认取消吗？', '警告', {
                        ok: async () => {  
                            row.templateIds = []
                            this.perms[row.id]["templates"] = [];
                        },
                        cancel: async () => {
                            row.templateIds.push(this.viewTempId)
                            if(row.siteIds.length === row.temps[0].app.length && row.templateIds.length === row.temps[0].template.length){
                                row.allShow = true
                            }
                        },
                    }) 
                }
            }
        },

        clickTable(row,index,e){
            // alert(123);
        },
        //全选
        handleCheckAllChange(val) {
            if(val.siteIds.length == 0 && val.templateIds.length == 0 ){
                val.allShow = true;
            }else{
                val.allShow = false;
            }
            
            if(val.allShow){
                var arrSiteIds = [];
                var arrTemplateIds = [];
                for (var i = 0 ; i < val.temps[0].app.length ; i++){
                    arrSiteIds.push(val.temps[0].app[i].id)
                }
                for (var j = 0 ; j < val.temps[0].template.length ; j++){
                    arrTemplateIds.push(val.temps[0].template[j].id)
                }
                val.siteIds = arrSiteIds;
                val.templateIds = arrTemplateIds;
                this.perms[val.id] = {};
                this.perms[val.id]["id"] = val.id;
                this.perms[val.id]["apps"] = val.siteIds;
                this.perms[val.id]["templates"] = val.templateIds;
            }else{
                val.siteIds = [] ;
                val.templateIds = []
                this.perms[val.id] = {};
            }

            this.isIndeterminate = false;

        },
        //打开对应站点下面的频道和文章
        toChannel(row) {
            
            if(row.siteIds.indexOf(this.viewId) !== -1) {
                this.$refs.more.title = row.name + "的频道";
                this.ids = row.id
                this.$refs.more.modalVisible = true;
                this.timer = new Date().getTime()
            }else {
                this.$message.error('必须要授权站点查看才能选择频道和文章');
            }
        },

        
        //选择站点的操作   
        siteSelect(value, type) {
            
            if(value.allShow){
                value.allShow = false
            }
            if(value.siteIds.length == this.temps[0].app.length && value.templateIds.length == this.temps[0].template.length){
                value.allShow = true
            }

            let keyId = value.id;
            if(!(this.perms[keyId])){
                this.perms[keyId] = {};
                this.perms[keyId]["id"] = keyId;

            }
            this.perms[keyId]["apps"] = value.siteIds;

        },
        //选择模块的操作
        templateSelect(value, type) {           
            if(value.allShow){
                value.allShow = false
            }
            if(value.siteIds.length === this.temps[0].app.length && value.templateIds.length === this.temps[0].template.length){
                value.allShow = true
            }
            let temkeyId = value.id;

            if(!(this.perms[temkeyId])){
                this.perms[temkeyId] = {};
                this.perms[temkeyId]["id"] = temkeyId;

            }
            this.perms[temkeyId]["templates"] = value.templateIds;



        },
        ...mapActions("cms/site", ["loadSites"]),
        ...mapActions("system/authority", [
            "authorityList",
            "appSelectList",
            "channelSelectList",
            "changePots",
            "userPermList",
            'rolePermList'
        ]),
        ...mapActions("cms/channel/channelList", ["getChannelList"]),


        //列表
        _authorityList() {
            showLoading(true, "数据加载中...");
            this.authorityList()
                .then(temp => {
                    if(this.userId || this.roleId){
                        if(this.$route.query.userId){
                            this.isUser = 1;
                            this._userPermList();
                        } else if(this.roleId){
                            this.isUser = 0 ;
                            this._rolePermList()
                        }

                    }
                    showLoading(false);
                })
                .catch(error => {
                    showLoading(false);
                    showError(error.message);
                });
        },
        saveAppSelect() {
            showLoading(true, '正在保存')
            this.types.perms = JSON.stringify(this.perms);
            this.appSelectList({ ...this.types })
                .then(data => {
                    showLoading(false)
                    showMessage('保存成功')
                    this.$router.go(-1)
                })
                .catch(error => {
                    showLoading(false);
                    showError(error.message);
                });
        },
        saveRoleSelect() {
            showLoading(true, '正在保存')
            this.roletype.perms = JSON.stringify(this.perms);
            this.channelSelectList({ ...this.roletype })
                .then(data => {
                    showLoading(false)
                    showMessage('保存成功')
                    this.$router.go(-1)
                })
                .catch(error => {
                    showLoading(false);
                    showError(error.message);
                });
        },
        //用户回显
        _userPermList() {
            this.echoUser.type = 1
            showLoading(true, "数据加载中...");
            this.userPermList({ ...this.echoUser })
                .then(data => {
                    var objs = this.tableDatas;
                    var apps = data.data;
                    this.toTableList(apps,objs);
                    showLoading(false);
                })
                .catch(error => {
                    showLoading(false);
                    showError(error.message);
                });
        },
        //角色回显
        _rolePermList() {
            this.echoRole.type = 1
            showLoading(true, "数据加载中...");
            this.rolePermList({ ...this.echoRole })
                .then(data => {
                    var objs = this.tableDatas;
                    var apps = data.data;
                    this.toTableList(apps,objs);
                   
                    showLoading(false);
                })
                .catch(error => {
                    showLoading(false);
                    showError(error.message);
                });
        },

        flatArr () {
            let result = []
            const deep = arr => {
                arr.map(item => {
                    if (item.children !== null && item.children.length) deep(item.children)
                    result.push(item)
                })
            }
            deep(this.tableDatas)
            return result
        },


        toTableList(apps){
            let objs = this.flatArr()
            for(var i = 0;i<objs.length;i++) {
                let obj = objs[i];
                let currSite = obj.id ;
                if(apps.apps[currSite] == undefined){
                    continue;
                }
                var arr = apps.apps[currSite];
                var arrApp = this.getApps(arr);
                var arrTemplateIds = this.getTemplateIds(arr)

                if(arrApp.length == obj.temps[0].app.length && arrTemplateIds.length == obj.temps[0].template.length){
                    obj.allShow = true;
                }
                obj.siteIds = [];
                obj.templateIds = [];
                obj.siteIds.length=arrApp.length
                obj.siteIds = arrApp;
                obj.templateIds.length=arrTemplateIds.length
                obj.templateIds = arrTemplateIds;
                this.perms[currSite] = {};
                this.perms[currSite]["id"] = currSite;
                this.perms[currSite]["apps"] = arrApp;
                this.perms[currSite]["templates"] = arrTemplateIds;
            }
        },



        //弹框的回显


        getApps(arr){
            var arrRetrun = [];
            for( var j = 0 ; j < arr.length ; j++){
                for(let i = 0;i<this.tableDatas[0].temps[0].app.length;i++){
                    if(arr[j] == this.tableDatas[0].temps[0].app[i].id){
                        arrRetrun.push(arr[j])
                        break;
                    }

                }
            }
            return arrRetrun;

        },

        getTemplateIds(arr){
            var arrRetrun = [];
            for( var j = 0 ; j < arr.length ; j++){
                for(let i = 0;i<this.tableDatas[0].temps[0].template.length;i++){
                    if(arr[j] == this.tableDatas[0].temps[0].template[i].id){
                        arrRetrun.push(arr[j])
                        break;
                    }
                }
            }
            return arrRetrun;

        },

        saveSelect() {
            if (this.$route.query.userId) {
                this.saveAppSelect()
            } else {
                this.saveRoleSelect();
            }
            this._loadSites()
        },

        _loadSites() {
            showLoading(true, "数据加载中...");
            this.loadSites(this.name)
                .then(() => {
                    this._authorityList();
                    showLoading(false);
                })
                .catch(error => {
                    showLoading(false);
                    showError(error.message);
                });
        },
        back(){
            this.$router.go(-1)
        }

    }
};
</script>
<style lang="scss" scoped>
.itemList {
    display: flex;
    > div:nth-child(1) {
        width: 100px;
    }
}
/deep/ .el-button--primary {
    background: #2F9FD2;
    color: #FFF;
}
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
    background: #2F9FD2;
}
/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #666
}
/deep/ .has-gutter {
    th {
        background: #E0F0FF;
        color: #1A1A1A
    }
}
.search {
    height:54px;
    background:rgba(248,248,248,1);
    border:1px solid rgba(234,234,234,1);
    border-radius:6px 6px 6px 6px;
    line-height: 54px
}
.searchTitle {
    font-size:18px;
    font-family:PingFang SC;
    font-weight:bold;
    font-size: 97%; 
    color:rgba(23,23,23,1);
    margin-left: 10px;
}
</style>

