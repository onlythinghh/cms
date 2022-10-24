<!--权限设置-->
<template>
    <div>
        <el-button icon="el-icon-arrow-left" @click="_back">返回</el-button>
        <div class="top-Box">
             <h3 v-if="orgType=='org'">
                权限设置【{{ editOrg.shortName }}】
                <span>组织</span>
            </h3>
            <h3 v-if="orgType=='user'">
                权限设置【{{ editUser.username }}】
                <span>用户</span>
            </h3>
            <i class="el-icon-warning infoIcon"></i>
            <div class="info-wordbox">
                <p>1.  权限设置可以在用户上设置，或者组织上设置，如果用户上设置了那么就会忽略组织上设置。</p>
                <p>2. 默认设置就是全局设置，私有设置为个别站点或频道设置。</p>
            </div>
        </div>
        <div class="table">
            <div>默认设置</div>
            <div>
                <el-row>
                    <el-form>
                        <el-col :span="4" class="title">
                            <el-form-item label-width="20%">
                                <el-checkbox v-model="OrgData.siteAll" @change="_siteAll">全站点</el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20" class="border">
                            <el-form-item label="站点：" label-width="80px">
                                <el-checkbox-group v-model="ckeckBox.siteAll">
                                    <el-checkbox v-for="item in Options.op_siteAll" :key="item.value" :label="item.value">{{
                                        item.name
                                    }}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" class="bgBorder"></el-col>
                        <el-col :span="4" class="title">
                            <el-form-item label-width="20%">
                                <el-checkbox v-model="OrgData.idAll" @change="_idAll">站点</el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20" class="border">
                            <el-form-item label="站点：" label-width="80px">
                                <el-checkbox-group v-model="ckeckBox.idAll">
                                    <el-checkbox v-for="item in Options.op_site" :key="item.value" :label="item.value">{{ item.name }}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label="模板：" label-width="80px">
                                <el-checkbox-group v-model="ckeckBox.idAll">
                                    <el-checkbox v-for="item in Options.op_template" :key="item.value" :label="item.value">{{
                                        item.name
                                    }}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label="频道：" label-width="80px">
                                <el-checkbox-group v-model="ckeckBox.idAll">
                                    <el-checkbox v-for="item in Options.op_channelAll" :key="item.value" :label="item.value">{{
                                        item.name
                                    }}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" class="bgBorder"></el-col>
                        <el-col :span="4" class="title">
                            <el-form-item label-width="20%">
                                <el-checkbox v-model="OrgData.channelAll" @change="_channelAll">频道</el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20" class="border">
                            <el-form-item label="频道：" label-width="80px">
                                <el-checkbox-group v-model="ckeckBox.channelAll">
                                    <el-checkbox v-for="item in Options.op_channel" :key="item.value" :label="item.value">{{
                                        item.name
                                    }}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label="内容：" label-width="80px">
                                <el-checkbox-group v-model="ckeckBox.channelAll">
                                    <el-checkbox v-for="item in Options.op_contentAll" :key="item.value" :label="item.value">{{
                                        item.name
                                    }}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" class="bgBorder"></el-col>
                        <el-col :span="4" class="title">
                            <el-form-item label-width="20%">
                                <el-checkbox v-model="OrgData.contentAll" @change="_contentAll">内容</el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20" class="border">
                            <el-form-item label="内容：" label-width="80px">
                                <el-checkbox-group v-model="ckeckBox.contentAll">
                                    <el-checkbox v-for="item in Options.op_content" :key="item.value" :label="item.value">{{
                                        item.name
                                    }}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </div>
        </div>
        <div class="btn">
            <el-button type="primary" size="mini" @click="addPower(1)">增加私有站点设置</el-button>
            <el-button type="primary" size="mini" @click="addPower(0)">增加私有频道设置</el-button>
        </div>
        <div v-if="appList.length">
            <div v-for="(item,key) in appList" :key="item.id" class="tableList">
                <div>
                    <p v-for="name in item.appList" :key="name.id">{{ name.name }}</p>
                </div>
                <div>
                <!--eslint-disable-->
                    <add-table :dialogVal="0" :authString="item" :show="false" :jurisdiction="jurisdiction" :dialog="item.dialog"></add-table>
                </div>
                <div>
                    <el-button @click="_modify(1,item,key)">修改</el-button>
                    <el-button type="danger" @click="appList.splice(key,1)">删除</el-button>
                </div>
            </div>
        </div>
        <div v-if="channelList.length">
            <div v-for="(item,key) in channelList" :key="item.id" class="tableList">
              <div class="channelName">
                    <p>{{item.channelList.app.name}}</p>
                    <div class="channer_list" :style="{height:tabHeight}">
                        <span v-for="name in item.channelList.channel" :key="name.id">{{name.name}}&nbsp;&nbsp;</span>
                    </div>
                </div>
                <div ref="tabHe" class="tabHe">
                    <add-table :dialogVal="1" :authString="item" :show="false" :jurisdiction="jurisdiction" :dialog="dialog"></add-table>
                </div>
                <div>
                    <el-button @click="_modify(0,item,key)">修改</el-button>
                    <el-button type="danger" @click="channelList.splice(key,1)">删除</el-button>
                </div>
            </div>
        </div>
        <el-dialog :title="dialog.title" center :visible="jurisdiction" width="70%" :show-close="false" :close-on-click-modal="false">
            <!--eslint-disable-->
            <add-table
                ref="Tabale"
                :authString="TABLE_data"
                :dialogVal="dialogVal"
                :modify="false"
                :jurisdiction="jurisdiction"
                :dialog="dialog"
                @closeModal="closeModal"
                @preservation="preservation"
            ></add-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="_closeModal()">关 闭</el-button>
                <el-button type="primary" @click="_dialogKeep">保 存</el-button>
            </div>
        </el-dialog>
        <div class="footer_btn">
            <el-button type="primary" @click="org_save">保 存 设 置</el-button>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { showLoading, showMessage,showError } from "@/utils";
import AddTable from "./tabale.vue";
export default {
    name: "Jurisdiction",
    components: {
        AddTable
    },
    data() {
        // eslint-disable
        return {
            tabHeight:'',
            jurisdiction: false,
            orgForm: {},
            OrgData: {
                idAll: false,
                siteAll: false,
                channelAll: false,
                contentAll: false,
            },
            TABLE_data: {
                authString: [],
                channelAuthString: [],
                featureString: [],
                infoAuthString: [],
                Channe_Name:[],
                value_1: [],
                value3: [],
                value2: "",
                id: 0
            },
            ckeckBox: {
                idAll: [],
                siteAll: [],
                channelAll: [],
                contentAll: []
            },
            dialogVal:0,
            dialog: {
                title: "私有站点设置",
                idAll: false,
                effectAll: false,
                channelAll: false,
                contentAll: false
            },
            appList: [],
            channelList: [],
            modify_Key:null,
        };
    },
    computed: {
        ...mapState("system/user/jurisdiction", ["Options", "st_IDALL", "st_SITEALL", "st_CHANNELALL", "st_CONTENTALL"]),
        ...mapState("system/user/org", ["editOrg", "orgUser", "rootId",'editUser','orgType']),
        ...mapGetters("cms/site", { site: "site" })
    },
    watch: {
        editOrg(Org) {
            this.orgForm = { ...Org };
            this.getData();
        },
        jurisdiction(v) {
            !v && this.dialogReset();
        },
        "ckeckBox.idAll"(v) {
            v.length === this.st_IDALL.length ? (this.OrgData.idAll = true) : (this.OrgData.idAll = false);
        },
        "ckeckBox.siteAll"(v) {
            v.length === this.st_SITEALL.length ? (this.OrgData.siteAll = true) : (this.OrgData.siteAll = false);
        },
        "ckeckBox.channelAll"(v) {
            v.length === this.st_CHANNELALL.length ? (this.OrgData.channelAll = true) : (this.OrgData.channelAll = false);
        },
        "ckeckBox.contentAll"(v) {
            v.length === this.st_CONTENTALL.length ? (this.OrgData.contentAll = true) : (this.OrgData.contentAll = false);
        }
    },
    created() {
        this.orgForm = { ...this.editOrg };
        this.getData();
    },
    mounted() {
        var _this = this
        window.onresize = function(){
            if(this.channelList.length){
                _this.tabHeight = (_this.$refs['tabHe'][0].children[0].clientHeight-50)+'px'
            }
        };
    },
    methods: {
        ...mapActions("cms/site", ["loadSites"]),
        ...mapActions("system/user/jurisdiction", ["getOrg", "saveOrg"]),
        ...mapActions('system/log',['addLog']),
        async getData() {
            let id = this.editOrg.id
            if(!id){
                this._back()
                throw new Error('')
            }
            let type = this.orgType
            showLoading(true, "正在加载权限数据");
            if(type=='user'){
                id = this.editUser.id
            }
            let res = await this.getOrg({
                id,
                type
            });
            if(res.success){
                let data = res.data
                this.ckeckBox.idAll = this.separate(data.global, this.st_IDALL);
                this.ckeckBox.siteAll = this.separate(data.global, this.st_SITEALL);
                this.ckeckBox.channelAll = this.separate(data.global, this.st_CHANNELALL);
                this.ckeckBox.contentAll = this.separate(data.global, this.st_CONTENTALL);
                this.appList = data.appList;
                this.channelList = data.channelList;
                this.Check_all()
                this.$nextTick(() => {
                    if(this.channelList.length){
                        this.tabHeight = (this.$refs['tabHe'][0].children[0].clientHeight-50)+'px'
                    }
                });
            }else{
                showError(res.errMsg)
            }
            showLoading(false);
            this.addLog({
                value:'权限设置'
            });
        },
        // 判断全选
        Check_all(){
            this.appList.forEach(ele=>{
                ele.dialog = {
                    effectAll:false,
                    idAll:false,
                }
                ele.featureString.length==1?ele.dialog.effectAll = true:''
                ele.authString.length===this.st_IDALL.length?ele.dialog.idAll = true:''
            })
            this.channelList.forEach(ele=>{
                ele.dialog = {
                    effectAll:false,
                    channelAll: false,
                    contentAll: false
                }
                ele.featureString.length==1?ele.dialog.effectAll = true:''
                ele.channelAuthString===this.st_CHANNELALL.length?ele.dialog.channelAll = true:''
                ele.infoAuthString===this.st_CONTENTALL.length?ele.dialog.contentAll = true:''
            })
        },
        // 分离权限数据
        separate(arry1, arry2) {
            return arry1.filter(function(n) {
                return arry2.indexOf(n) != -1;
            });
        },
        addPower(v) {
            if (v) {
                this.dialogVal = 0;
                this.dialog.title = "新增私有站点设置";
            } else {
                this.dialogVal = 1;
                this.dialog.title = "新增私有频道设置";
            }
            this.jurisdiction = true;
            setTimeout(()=>{
                this.$refs.Tabale._loadSites();
            })
        },
        closeModal() {
            this.jurisdiction = false;
        },
        // 保存
        preservation(data) {
            if(this.modify_Key===null){
                if (this.dialogVal) {
                    this.channelList.push({ ...data });
                } else {
                    this.appList.push({ ...data });
                }
            }else{
                var _List = []
                if (this.dialogVal) {
                    _List = [...this.channelList];
                    _List.splice(this.modify_Key,1,data)
                    this.channelList = [];
                    setTimeout(() => {
                        this.channelList = [..._List]
                    });
                } else {
                    _List = [...this.appList];
                    _List.splice(this.modify_Key,1,data)
                    this.appList = []
                    setTimeout(() => {
                        this.appList = [..._List]
                    })
                }
            }
            this.closeModal();
        },
        // 修改
        _modify(v, data,k) {
            this.modify_Key = k
            this.TABLE_data.id = data.id;
            this.TABLE_data.featureString = data.featureString;
            if (v) {
                this.dialogVal = 0;
                this.dialog.title = "修改私有站点设置";
                var _appList = [];
                data.appList.forEach(ele => {
                    _appList.push(ele.id);
                });
                this.TABLE_data.authString = data.authString;
                this.TABLE_data.value_1 = _appList;
            } else {
                this.dialogVal = 1;
                this.dialog.title = "修改私有频道设置";
                this.TABLE_data.Channe_Name = data.channelList.channel;
                this.TABLE_data.channelAuthString = data.channelAuthString
                this.TABLE_data.infoAuthString = data.infoAuthString
                this.TABLE_data.value2 = data.channelList.app.id
            }
            this.$forceUpdate();
            this.jurisdiction = true;
            setTimeout(()=>{
                this.$refs.Tabale._loadSites();
            })
        },
        // 关闭弹窗
        _closeModal() {
            this.closeModal();
            this.$forceUpdate();
        },
        // 添加保存
        _dialogKeep() {
            this.$refs.Tabale.dialogKeep();
        },
        async org_save() {
            var global = this.ckeckBox.idAll
                .concat(this.ckeckBox.siteAll)
                .concat(this.ckeckBox.channelAll)
                .concat(this.ckeckBox.contentAll);
            let res = await this.saveOrg({
                global,
                id: this.editOrg.id,
                appList: this.appList,
                channelList: this.channelList,
                type:this.orgType
            });
            if (res.success) {
                showMessage(res.errMsg);
            } else {
                this.$message.error("保存失败");
            }
        },
        _back() {
            this.$router.go(-1);
        },
        // 数据重置
        dialogReset() {
            this.modify_Key = null;
            this.dialog.idAll = false;
            this.dialog.effectAll = false;
            this.dialog.contentAll = false;
            this.dialog.channelAll = false;
            this.TABLE_data.id = 0;
            this.TABLE_data.value_1 = [];
            this.TABLE_data.value2 = "";
            this.TABLE_data.Channe_Name = ''
            this.TABLE_data.value3 = [];
            this.TABLE_data.authString = [];
            this.TABLE_data.channelAuthString = [];
            this.TABLE_data.featureString = [];
            this.TABLE_data.infoAuthString = [];
            this.$forceUpdate();
        },
        _reset() {
            this.ckeckBox.idAll = [];
            this.ckeckBox.siteAll = [];
            this.ckeckBox.channelAll = [];
            this.ckeckBox.contentAll = [];
            this.dialogReset();
        },
        // 站点
        _idAll(v) {
            v ? (this.ckeckBox.idAll = [...this.st_IDALL]) : (this.ckeckBox.idAll = []);
        },
        // 全站点
        _siteAll(v) {
            v ? (this.ckeckBox.siteAll = [...this.st_SITEALL]) : (this.ckeckBox.siteAll = []);
        },
        // 频道
        _channelAll(v) {
            v ? (this.ckeckBox.channelAll = [...this.st_CHANNELALL]) : (this.ckeckBox.channelAll = []);
        },
        // 内容
        _contentAll(v) {
            v ? (this.ckeckBox.contentAll = [...this.st_CONTENTALL]) : (this.ckeckBox.contentAll = []);
        }
    }
};
</script>
<style lang="scss" scoped>
.tableList,
.table {
    display: flex;
    border: 1px solid #e6ebf5;
    > div:first-child {
        width: 40%;
        text-align: center;
        margin: auto 0;
    }
}
.tableList {
    .channelName{
        p{
            padding: 15px 0;
            margin: 0;
            font-weight: bold;
            background: #e6ebf5;
        }
        .channer_list{
            overflow-y: auto;
            span{
                margin: 5px 0;
                display: block;
            }
        }
    }
    margin-bottom: 15px;
    > div:nth-child(1) {
        width: 20%;
    }
    > div:nth-child(2) {
        flex: 1;
    }
    > div:nth-child(3) {
        margin: auto 0;
        /deep/ .el-button {
            display: block;
            margin: 10px 0;
        }
    }
    /deep/.el-checkbox.is-checked.is-disabled{
        >span{
            color: #1890ff;
        }
    }
}
.btn {
    margin: 15px 0;
}
/deep/ .el-button--primary {
    background: #2f9fd2;
    color: #fff;
}
/deep/ .el-row {
    border: 1px solid #e6ebf5;
    .bgBorder {
        height: 1px;
        width: 100%;
        background: #e6ebf5;
    }
    .el-form-item {
        margin: 0;
    }
    .title {
        position: relative;
    }
    .border {
        border-left: 1px solid #e6ebf5;
        height: 100%;
    }
}
.dialogTable {
    width: 100%;
}
.footer_btn {
    text-align: center;
}
.top-Box{
    display:flex;
    align-items:center;
    position: relative;
    cursor: pointer;
}
.infoIcon{
    margin-left: 10px;
    cursor: pointer;
    color: #1890ff;
}
.top-Box:hover .info-wordbox{
    display: block;
}
.info-wordbox{
    width: 400px;
    background: #fff;
    position: absolute;
    top: 42px;
    left: 235px;
    z-index: 9;
    box-shadow: 0px 0px 10px 2px #ddd;
    border-radius: 10px;
    display: none;
    padding: 10px 10px;
}
.info-wordbox p{
    line-height: 1.5;
}
</style>
