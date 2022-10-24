<template>
    <Modal :title="title" :visible="modalVisible" width="90%" append-to-body @close="close">
        <div v-if="showSearch" class="search">
            <div style="float:left" class="searchTitle">请输入频道名称：</div>
            <div 
                style="width: 200px;float:left "
            ><el-input v-model="name" placeholder="请输入频道" min-width="200px" @change="isSearch = false"></el-input></div>
            <el-button type="primary" icon="el-icon-search" style="margin-left: 20px" @click="search">搜索</el-button>
        </div>
        <el-table 
            :data="channelList.length ? channelList :channelLists" 
            row-key="id" 
            border
            :row-style="rowStyle"
        >
            <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
            <el-table-column label="频道" prop="name" width="190"></el-table-column>
            <el-table-column label="全选" width="50">
                <template v-slot="{ row }">
                    <el-checkbox
                        v-model="row.allShow"
                        :indeterminate="row.isIndeterminate"
                        @change="handleCheckAllChange(row)"
                    ></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column label="权限操作">
                <template v-slot="{ row }">
                    <div class="itemList">
                        <div>频道：</div>
                        <div class="checkboxList">
                            <el-checkbox-group
                                v-model="row.channelIds"
                                @change="channelSelect(row)"
                            >
                                <el-checkbox
                                    v-for="item in row.channel"
                                    :key="item.id"
                                    :label="item.id"
                                    class="sendson"
                                    @change="channelView($event, item, row)"
                                >{{item.name}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>

                    <div class="itemList">
                        <div style="width: 47px;">文章:</div>
                        <div class="checkboxList">
                            <el-checkbox-group
                                v-model="row.articleIds"
                                @change="articleSelect(row)"
                            >
                                <el-checkbox
                                    v-for="item in row.article"
                                    :key="item.id"
                                    :label="item.id"
                                    class="sendson"
                                    @change="articleView($event, item, row)"
                                >{{item.name}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-row style="margin-top:20px;text-align: center">
            <el-button type="primary" style="margin-right:50px;" @click="saveSelect">保存</el-button>
            <el-button type="danger" @click="close">取消</el-button>
        </el-row>
    </Modal>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { showLoading, showError, confirm } from "../../../utils";
import { deepCopy } from "@/utils/BaseUtil";
// import { isNumber } from 'util';
export default {
    name: "More",
    // props:["appid","isUser"],
    props:{
        appid:{
            type: Number,
            default: null
        },
        isUser:{
            type: Number,
            default: 0
        },
        empty: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            name: '',
            showSearch: false,
            channelList:[],
            title: "频道",
            is__checked: false,
            modalVisible: false,
            isChange:0,
            checkChannel: [],
            checkArticle: [],
            perms: {},
            isIndeterminate: false,
            types: {
                module: this.$route.query.userTag
                    ? this.$route.query.userTag
                    : this.$route.query.roleTag,
                ids: this.$route.query.userId
                    ? this.$route.query.userId
                    : this.$route.query.roleId,
                type: 2,
                perms: {}
            },
            roletype: {
                module: this.$route.query.userTag
                    ? this.$route.query.userTag
                    : this.$route.query.roleTag,
                ids: this.$route.query.roleId
                    ? this.$route.query.roleId
                    : this.$route.query.userId,
                type: 2,
                perms: {}
            },
            echoUser: {
                module: this.$route.query.userTag
                    ? this.$route.query.userTag
                    : this.$route.query.roleTag,
                id: this.$route.query.userId
                    ? this.$route.query.userId
                    : this.$route.query.roleId,
                type: 2
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
            viewChannelId:null,
            viewArticleId: null,
            wid:''
        };
    },
    computed: {
        ...mapState("cms/site", ["sites"]),
        ...mapState("system/authority", ["temps"]),
        ...mapState("cms/channel/channelList", ["channelsList"]),

        channelLists() {
            const deep = arr => {
                arr.forEach(item => {
                    if (item.children && item.children.length)
                        deep(item.children);
                    item["channel"] = [];
                    item["channel"] = this.temps[0].channel;
                    item["article"] = [];
                    item["article"] = this.temps[0].article;
                    item["channelIds"] = [];
                    item["articleIds"] = [];
                    item["allShow"] = false;
                });

                return arr;
            };
            return deep(deepCopy(this.channelsList));
        }
    },
    watch: {
        appid(newV,oldV){
            
            if(newV) {
                this.wid = newV
                this._getChannelList();
            }
        },
        empty(v) {
            if(v) {
                this._saveSelect()
            }
        }
    },

    created() {
        this.$route.query.roleId || this.$route.query.userId ? this.showSearch = true : false
    },
    mounted() {
        
        //     this.$nextTick(()=>{
        //         if(this.empty) {
        //         this.perms = []
        //         console.log(this.perms,1111111111)
        // }

        //     })
        
    },
    methods: {
        ...mapActions("cms/channel/channelList", ["getChannelList"]),
        ...mapActions("system/authority", ["setUserPerm"]),
        ...mapActions("system/authority", [
            "authorityList",
            "appSelectList",
            "channelSelectList",
            "changePots",
            "userPermList",
            'rolePermList'
        ]),
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
            this.channelList= this.filterData(this.channelLists).filter(Boolean)
            this.isSearch = true
        },
        _getChannelList() {
            showLoading(true, "数据加载中...");
            this.getChannelList({appid:this.wid})
                .then((data) => {
                    if(this.isUser==1){
                        this.__userPermList(this.appid);
                    }else{
                        this.__rolePermList(this.appid)
                    }
                    showLoading(false);
                })
                .catch(error => {
                    showLoading(false);
                    // showError(error.message);
                });
        },

        channelView (isChecked, val, row) {
            this.viewChannelId = null
            row.channel.map(item => {
                if (item.type === 1) this.viewChannelId = item.id
            })
            if (val.type !== 1) {
                row.channelIds = [...new Set([...row.channelIds, this.viewChannelId])]
            } else {
                if (!isChecked) {
                    confirm('如果取消，进行其他频道操作必须选择频道查看，确认取消吗？', '警告', {
                        zIndex: 9999,
                        ok: () => {  
                            row.channelIds = []
                            this.perms[row.id]["channels"] = []
                        },
                        cancel: async () => {
                            row.channelIds.push(this.viewChannelId)
                            if(row.channelIds.length === row.channel.length && row.articleIds.length === row.article.length){
                                row.allShow = true
                            }
                        },
                    }) 
                }   
            }
        },
        articleView (isChecked, val, row) {
            this.viewArticleId = null
            row.article.map(item => {
                if (item.type === 1) this.viewArticleId = item.id
            })
            if (val.type !== 1) {
                row.articleIds = [...new Set([...row.articleIds, this.viewArticleId])]
            } else {
                if (!isChecked) {
                    confirm('如果取消，进行其他文章操作必须选择文章查看，确认取消吗？', '警告', {
                        zIndex: 9999,
                        ok: async () => {  
                            row.articleIds = []
                            this.perms[row.id]["articles"] = []
                        },
                        cancel: async () => {
                            row.articleIds.push(this.viewArticleId)
                            if(row.channelIds.length === row.channel.length && row.articleIds.length === row.article.length){
                                row.allShow = true
                            }
                        },
                    }) 
                }
            }
        },
        //用户回显
        __userPermList() {
            // setTimeout(() => {
            this.echoUser.type = 2
            showLoading(true, "数据加载中...");
            this.userPermList({ ...this.echoUser })
                .then(data => {
                    var objs = this.channelLists;
                    var apps = data.data;
                    this.toTableList(apps,objs);
                    showLoading(false);
                })
                .catch(error => {
                    showLoading(false);
                    showError(error.message);
                });
            // }, 200)
           
        },
        __rolePermList(value) {
            // setTimeout(() => {
            this.echoUser.type = 2
            showLoading(true, "数据加载中...");
            this.rolePermList({ ...this.echoRole })
                .then(data => {
                    var objs = this.channelLists;
                    var apps = data.data;
                    this.toTableList(apps,objs);
                    showLoading(false);
                })
                .catch(error => {
                    showLoading(false);
                    showError(error.message);
                });
            // }, 200)
            
           
        },


        flatArr () {
            let result = []
            const deep = arr => {
                arr.map(item => {
                    if (Array.isArray(item.children)) deep(item.children)
                    result.push(item)
                })
            }
            deep(this.channelLists)
            return result
        },

        toTableList(apps){
            let objs = this.flatArr()
            for(var i = 0;i<objs.length;i++) {
                let obj = objs[i];
                let currSite = obj.id ;
                if(apps.channels[currSite] == undefined){
                    continue;
                }
                var arr = apps.channels[currSite];
                var arrChannel = this.getChannelIds(arr);
                var arrArticle = this.getArticleIds(arr)
                if(arrChannel.length == this.temps[0].channel.length && arrArticle.length == this.temps[0].article.length){
                    obj.allShow = true;
                }
                obj.channelIds = [];
                obj.articleIds = [];
                obj.channelIds.length=arrChannel.length
                obj.channelIds = arrChannel;
                obj.articleIds.length=arrArticle.length
                obj.articleIds = arrArticle;
                this.perms[currSite] = {};
                this.perms[currSite]["id"] = currSite;
                this.perms[currSite]["channels"] = arrChannel;
                this.perms[currSite]["articles"] = arrArticle;
                // if(obj.children != null){
                //     this.toTableList(apps,obj.children);
                // }
            }
        },

        getChannelIds(arr){
            var arrRetrun = [];
            for( var j = 0 ; j < arr.length ; j++){
                for(let i = 0;i<this.channelLists[0].channel.length;i++){
                    if(arr[j] == this.channelLists[0].channel[i].id){
                        arrRetrun.push(arr[j])
                        break;
                    }

                }
            }
            return arrRetrun;

        },

        getArticleIds(arr){
            var arrRetrun = [];
            for( var j = 0 ; j < arr.length ; j++){
                for(let i = 0;i<this.channelLists[0].article.length;i++){
                    if(arr[j] == this.channelLists[0].article[i].id){
                        arrRetrun.push(arr[j])
                        break;
                    }
                }
            }
            return arrRetrun;

        },


        saveRoleSelect() {
            showLoading(true, "数据加载中...");
            this.roletype.perms = JSON.stringify(this.perms);
            this.channelSelectList({ ...this.roletype })
                .then(data => {
                    showLoading(false);
                    this.close();
                })
                .catch(error => {
                    showLoading(false);
                    showError(error.message);
                });
        },
        //站点为空的处理
        _saveRoleSelect() {
            showLoading(true, "数据加载中...");
            this.roletype.perms = [];
            this.channelSelectList({ ...this.roletype })
                .then(data => {
                    showLoading(false);
                    this.close();
                })
                .catch(error => {
                    showLoading(false);
                    showError(error.message);
                });
        },
        saveAppSelect() {
            showLoading(true, "数据加载中...");
            this.types.perms = JSON.stringify(this.perms);
            this.appSelectList({ ...this.types })
                .then(data => {
                    showLoading(false);
                    this.close();
                })
                .catch(error => {
                    showLoading(false);
                    showError(error.message);
                });
        },
        //站点为空的处理
        _saveAppSelect() {
            showLoading(true, "数据加载中...");
            this.types.perms = [];
            this.appSelectList({ ...this.types })
                .then(data => {
                    showLoading(false);
                    this.close();
                })
                .catch(error => {
                    showLoading(false);
                    showError(error.message);
                });
        },

        saveSelect() {
            if (this.$route.query.userId) {
                this.saveAppSelect();

            } else {
                this.saveRoleSelect();

            }
        },
        //站点为空的处理
        _saveSelect() {
            if (this.$route.query.userId) {
                this._saveAppSelect();

            } else {
                this._saveRoleSelect();

            }
        },

        close() {
            this._getChannelList();
            this.modalVisible = false;
        },
        channelSelect(value) {
            if(value.allShow){
                value.allShow = false
            }
            
            if(value.channelIds.length == this.temps[0].channel.length && value.articleIds.length == this.temps[0].article.length){
                value.allShow = true
            }

            let keyId = value.id;
            if(!(this.perms[keyId])){
                this.perms[keyId] = {};
                this.perms[keyId]["id"] = keyId;

            }
            this.perms[keyId]["channels"] = value.channelIds;

        },
        articleSelect(value) {
            if(value.allShow){
                value.allShow = false
            }
            if(value.channelIds.length == this.temps[0].channel.length && value.articleIds.length == this.temps[0].article.length){
                value.allShow = true
            }
            
            let keyId = value.id;

            if(!(this.perms[keyId])){
                this.perms[keyId] = {};
                this.perms[keyId]["id"] = keyId;

            }
            this.perms[keyId]["articles"] = value.articleIds;
        },
        //全选
        handleCheckAllChange(val) {
            if(val.channelIds.length == 0 && val.articleIds.length == 0 ){
                val.allShow = true;
                this.isIndeterminate = true
            }else{
                val.allShow = false;
            }
            
            if(val.allShow){
                var arrChannelIds = [];
                var arrArticleIds = [];
                for (var i = 0 ; i < val.channel.length ; i++){
                    arrChannelIds.push(val.channel[i].id)
                }
                for (var j = 0 ; j < val.article.length ; j++){
                    arrArticleIds.push(val.article[j].id)
                }
                val.channelIds = arrChannelIds;
                val.articleIds = arrArticleIds;
                this.perms[val.id] = {};
                this.perms[val.id]["id"] = val.id;
                this.perms[val.id]["channels"] = val.channelIds;
                this.perms[val.id]["articles"] = val.articleIds;
            }else{
                val.channelIds = [] ;
                val.articleIds = []
                this.perms[val.id] = {};

            }

            this.isIndeterminate = false;
        }
        
    }
};
</script>
<style lang="scss" scoped>
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

