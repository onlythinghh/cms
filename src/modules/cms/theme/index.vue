<!--主题管理--> 
<template>
    <div>
        <div class="header">
            <el-form ref="search" :model="searchForm">
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="名称" label-width="100px" prop="themeId">
                            <el-select v-model="searchForm.themeId" style="width:100%" placeholder="请输入主题名称" clearable filterable>
                                <el-option v-for="item in list" :key="item.id" :label="item.themeName" :value="item.id"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="触发条件" label-width="100px">
                            <el-date-picker
                                v-model="searchFormTime"
                                type="daterange"
                                style="width:100%"
                                value-format="timestamp"
                                start-placeholde="开始时间"
                                end-placeholde="结束时间"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="类型" label-width="100px" prop="type">
                            <el-select v-model="searchForm.type" style="width:100%" placeholder="请选择主题类型" clearable>
                                <el-option label="默认" value="1"></el-option>
                                <el-option label="时限" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态" label-width="100px" prop="enabled">
                            <el-select v-model="searchForm.enabled" style="width:100%" placeholder="请选择主题状态" clearable>
                                <el-option label="启用中" :value="1"></el-option>
                                <el-option label="禁用中" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="站点选择" label-width="100px" prop="app">
                            <el-select v-model="searchForm.app" style="width:100%" placeholder="请选择站点" clearable filterable>
                                <el-option v-for="item in SitesAll" :key="item.id" :label="item.name" :value="item.id"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="btn" label-width="100px">
                            <el-button type="primary" size="medium" @click="searchList">查询</el-button>
                            <el-button size="medium" @click="resetForm">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div>
            <el-dialog :title="title" :visible.sync="addVisible" width="35%" center @close="closeDialog">
                <el-row>
                    <el-form ref="ruledatch" :model="addForm" :rules="addFormRules" label-width="80px">
                        <el-form-item v-if="title==='新增主题'" label="主题站点" label-width="100px" prop="appId">
                            <el-select
                                v-model="addForm.appId"
                                style="width:87%"
                                placeholder="请选择站点"
                                clearable
                                filterable
                                :disabled="!!addForm.fileName"
                            >
                                <el-option v-for="item in SitesAll" :key="item.id" :label="item.name" :value="item.id"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="主题名称" prop="themeName" label-width="100px">
                            <el-input v-model="addForm.themeName" placeholder="请输入主题名称" maxlength="10" style="width:87%" clearable/>
                        </el-form-item>
                        <el-form-item label="主题类型" prop="type" label-width="100px">
                            <el-select v-model="addForm.type" style="width:87%" placeholder="请选择主题类型">
                                <el-option label="默认" :value="1"></el-option>
                                <el-option label="时限" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="addForm.type==2" label="触发条件" label-width="100px" prop="start">
                            <el-date-picker
                                v-model="addTrigger"
                                :disabled="!addForm.appId"
                                type="daterange"
                                value-format="timestamp"
                                style="width:87%"
                                start-placeholde="开始时间"
                                end-placeholde="结束时间"
                                @change="showOffMsg"
                            />
                        </el-form-item>
                        <el-form-item label="主题文件" label-width="100px" required>
                            <div v-if="addForm.fileName" style="width:87%" class="flex">
                                <span>{{addForm.fileName}}</span>
                                <i class="el-icon-delete" @click="_removeImage"></i>
                            </div>
                            <el-upload
                                v-else
                                action
                                :disabled="isReadOnly"
                                :multiple="false"
                                :show-file-list="false"
                                :on-change="_selectFile"
                                :http-request="_uploadFile"
                                accept=".css"
                            >
                                <el-button @click="showFile">选择文件</el-button>
                            </el-upload>
                                    <span class="el-form-item__error">{{fileMsg}}</span>
                        </el-form-item>
                        <el-form-item label="主题描述" label-width="100px">
                            <el-input
                                v-model="addForm.description"
                                type="textarea"
                                :rows="4"
                                maxlength="100"
                                style="width:87%"
                                show-word-limit
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </el-row>
                <div slot="footer">
                    <el-button type="primary" @click="batchAdoptclick">保存</el-button>
                    <el-button @click="closeDialog">取消</el-button>
                </div>
            </el-dialog>
        </div>
        <div>
            <el-button type="primary" @click="add(0)">新增</el-button>
            <el-button @click="_publish">发布</el-button>
            <el-table
                ref="Tabledata"
                tooltip-effect="dark"
                style="width: 100%"
                max-height="595"
                row-key="id"
                :data="list"
                :row-style="{ height: '54px' }"
                :cell-style="{ padding: '0' }"
                :header-cell-style="{ 'text-align': 'center' }"
            >
                <el-table-column label="序号" width="60" type="index" align="center" />
                <el-table-column prop="appName" label="站点" align="center" />
                <el-table-column prop="themeName" label="名称" align="center" />
                <el-table-column prop="file.origin" label="文件" align="center">
                </el-table-column>
                <el-table-column label="类型" align="center">
                    <template v-slot="{row}">
                        <span>{{row.type==1?'默认':'时限'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="触发条件" align="center" width="170px">
                    <template v-slot="{row}">
                        <span>{{row.start|dateFormat('YYYY/MM/DD')}}-{{row.end|dateFormat('YYYY/MM/DD')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="配置状态" align="center">
                    <template v-slot="{row}">
                        <span :class="row.enabled?'ok':'err'">{{row.enabled?'启用中':'禁用中'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="code" label="发布状态" align="center">
                    <template v-slot="{row}">
                        <span :class="row.state!=='online'?'err':'ok'">{{row.stateStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200" fixed="right">
                    <template v-slot="{row}">
                        <el-button type="text" size="mini" @click="add(row)">配置</el-button>
                        <el-button type="text"
                            :class="row.enabled?'sperr':'spok'" 
                            size="mini" 
                            @click="batch(row.id,row.enabled)"
                        >{{row.enabled?'禁用':'启用'}}</el-button>
                        <el-button type="text" size="mini" style="color:#f56c6c" @click="forward(row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { showLoading,showError, showMessage,hideLoading, confirm } from "@/utils";
import { mapActions } from "vuex";
import { BASE64Helper } from '@/utils/CryptUtil'
export default {
    name:'Theme',
    data() {
        return {
            title: "",
            file: {},
            addVisible: false,
            addForm:{
                id:null,
                appId:null,
                themeName:null,
                type:1,
                state:'2',
                file:{},
                enabled:null,
                start:null,
                end:null,
                fileName:'',
                description:'',
            },
            fileMsg:'只支持.css格式',
            addTrigger:[],
            addFormRules:{
                appId:[{required: true,message: "请选择站点"}],
                themeName:[{required: true,message: "主题名称不能为空",trigger: "blur"}],
                start:[{required: true,message: "请选择触发条件,且与已有触发条件不可重叠",trigger: "blur"},{
                    validator: (rule, value, callback) =>{
                        if(this.addForm.type==2){
                            let {end,id} = this.addForm
                            let err = null
                            try {
                                this.times.forEach(ele=>{
                                    // eslint-disable-next-line
                                    if( (value>ele[1] && end>ele[1] ) || (value<ele[0] && end<ele[0]) || id==ele[2]){
                                    }else{
                                        err = "触发条件不可重叠"
                                        throw new Error('触发条件不可重叠')
                                    }
                                })
                            } catch {
                                err?callback(err):callback()
                            }
                        }
                        callback()
                    },
                    trigger: "blur"
                }],
                type:[{required: true,message: "请选择主题类型"}],
                fileName:[{required: true,message: "请上传附件"}]
            },
            searchForm: {
                app:null,
                themeId:null,
                enabled:null,
                type:'',
            },
            isReadOnly:true,
            searchFormTime:[],
            list:[],
            SitesAll:[],
            times:[],
        };
    },
    watch: {
        "addForm.appId"(v){
            this.times = []
            v && (this.fileMsg = '只支持.css格式')
            this.isReadOnly = !v
            if(this.addForm.fileName){
                this.fileMsg = ''
            }
            this.list.forEach(t=>{
                if(t.type==2&&t.appId==v){
                    this.times.push([t.start,t.end,t.id])
                }
            })
        }
    },
    created() {
        this.searchList();
    },

    methods: {
        ...mapActions("cms/site", ["loadSites"]),
        ...mapActions("cms", ["fileUpload"]),
        ...mapActions('cms/site/filexplorer', ['_readFiles']),
        ...mapActions("cms/theme", ["schedulerList", "thsave","nostop","colldel","publish"]),

        async searchList() {
            showLoading(true);
            if(this.searchFormTime==null){
                this.searchFormTime = []
            }
            let res = await this.schedulerList({
                ...this.searchForm,
                start:this.searchFormTime[0],
                end:this.searchFormTime[1]+(24*60*60*1000-1000),
            });
            this.list = res.data;
            this._loadSites()
        },

        resetForm(){
            this.searchFormTime = []
            this.$refs.search.resetFields()
            this.searchList()
        },

        async _loadSites() {
            let {tree} = await this.loadSites()
            this.SitesAll = []
            this._forEach(tree)
            hideLoading();
        },
        
        _forEach(arry){
            arry.forEach(ele=>{
                this.SitesAll.push({id:ele.id,name:ele.name})
                if(ele.children){
                    this._forEach(ele.children)
                }
            })
        },

        add(v){
            this.title = '新增主题'
            this.addVisible = true  
            if(v){
                this.title = '配置主题'
                this.addForm = {...v}
                if(v.type==1){
                    this.addTrigger = []
                }else{
                    this.addTrigger = [v.start,v.end]
                }
                this.addForm.fileName = v.file.origin
            }
        },
        closeDialog(){
            this.addTrigger = [],
            this.addForm.fileName = null
            this.addVisible = false
            this.fileMsg = '只支持.css格式'
            this.addForm = {
                id:null,
                appId:null,
                themeName:null,
                type:1,
                state:'2',
                file:{},
                enabled:null,
                start:null,
                end:null,
                fileName:'',
                description:'',
            }
            this.$refs.ruledatch.resetFields()
        },
        showFile(){
            this.isReadOnly && (this.fileMsg = '请先选择主题站点，只支持.css格式')
        },
        _selectFile(file) {
            this.file = file
        },
        _removeImage(){
            this.addForm.file = {}
            this.addForm.fileName = null
            this.$forceUpdate()
        },
        async _uploadFile(param) {
            try {
                BASE64Helper.imgMd5(param.file).then(async _file => {
                    let {data} = await this.fileUpload({
                        appid: this.addForm.appId,
                        file: _file,
                        type: 61,
                    })
                    if(data.success){
                        this.fileName = data.data.origin
                        this.fileMsg = ''
                        this.addForm.file = {...data.data}
                        this.addForm.fileName = data.data.origin
                        this.$forceUpdate()
                    }else{
                        showError('上传失败')
                    }
                })
            } catch (error) {
                console.error(error)
                alert(error)
            }
        },
        showOffMsg(v){
            this.addForm.start = v?v[0]:null
            this.addForm.end = v?v[1]+(24*60*60*1000-1000):null
        },
        batchAdoptclick() {
            this.$refs.ruledatch.validate(async valid => {
                if (!valid) {
                    return false;
                }
                if(!this.addForm.file.id){
                    this.fileMsg = '请上传主题样式文件'
                    return false
                }
                let res = await this.thsave({
                    ...this.addForm,
                });
                if (res.success) {
                    this.$message({
                        type: "success",
                        message: res.errMsg
                    });
                    this.addVisible = false;
                    this.searchList();
                } else {
                    this.$message.error("保存失败");
                }
            });
        },
        async batch(id,v){
            let res = await this.nostop({id,enabled:!v})
            if (res.success) {
                showMessage(res.data)
                this.searchList();
            } else {
                showError(res.errMsg || (v?'启用失败':'禁用失败'))
            }
        },
        async forward(id) {
            confirm("您确认删除吗？", "警告", {
                ok: async () => {
                    showLoading("正在删除...");
                    let res = await this.colldel({ id });
                    if (res.success) {
                        showMessage(res.errMsg || '删除成功')
                        this.searchList();
                    } else {
                        this.$message.error(res.errMsg||"删除失败");
                    }
                    hideLoading();
                }
            });
        },
        async _publish(){
            let {success,errMsg} = await this.publish()
            success?showMessage('发布成功'):showError(errMsg||'发布失败')
            this.searchList();
        }
    }
};
</script>
<style lang="scss" scoped>
.ok::before,
.err::before{
    content: '';
    width:5px;
    height: 5px;
    margin-right: 5px;
    display: inline-block;
    vertical-align: middle;
    border-radius: 50%;
    background-color:#67c23a;
}
.err::before{
    background-color: #ff4949;
}
/deep/ .sperr{
    color: #ff4949;
}
/deep/ .spok{
    color:#67c23a;
}
.flex{
    display: flex;
    cursor: default;
    justify-content: space-between;
    align-items: center;
    i:hover::before{
        cursor: pointer;
        color: #ff4949;
    }
}
</style>
