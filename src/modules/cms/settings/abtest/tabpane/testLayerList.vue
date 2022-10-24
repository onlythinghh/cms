<template>
    <div class="test_list">
        <TableRow :has-form="true" :has-header="true" :has-pagination="true">
            <template v-slot:form>
                <el-form ref="tesSearchRef" label-width="80px" :model="searchInfo">
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="名称">
                                <el-input
                                    v-model="searchInfo.keyword"
                                    placeholder="请输入测试名称，创建人"
                                    clearable
                                    maxlength="30"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-button type="primary" @click="searchList">查询</el-button>
                            <el-button @click="resetForm">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
            <template v-slot:header-right>
                <el-button type="primary" @click="itemEdit(null, 0)">新建</el-button>
            </template>
        </TableRow>
        <el-table ref="tableList" :data="layerList" class="tableList">
            <el-table-column label="实验层名称" prop="name">
                <template v-slot="{ row }">
                    <div class="tab_cont">
                        <span>{{row.name}}</span>
                        <span>运行实验{{row.runNum}}个</span>
                    </div>
                    <el-progress :percentage="row.percent||0" :show-text="false"></el-progress>
                    <div class="tab_cont">
                        <span>无可用流量</span>
                        <span>{{row.percent}}%</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime">
                <template v-slot="{ row }">{{row.createTime|dateFormat}}</template>
            </el-table-column>
            <el-table-column label="创建人" prop="createUser"></el-table-column>
            <el-table-column label="描述" prop="description"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <!-- <el-button type="text" size="mini" @click="lookupInfo(scope.row)">详情</el-button> -->
                    <el-button type="text" size="mini" @click="itemEdit(scope.row, 1)">编辑</el-button>
                    <el-button type="text" size="mini" @click="itemDel(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :title="addtestType == 0 ?'新建实验层' : '编辑实验层'"
            :visible.sync="addtestDialog"
            width="50%"
            :before-close="addtestDialogClose"
        >
            <el-form ref="addtestDialogref" :model="formData" :rules="addRules" label-width="80px">
                <div class="title">基本信息</div>
                <el-form-item label="实验名称" prop="name">
                    <el-input
                        v-model="formData.name"
                        placeholder="请输入实验名称"
                        clearable
                        maxlength="30"
                    />
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                        v-model="formData.description"
                        type="textarea"
                        placeholder="请输入实验名称"
                        clearable
                        maxlength="150"
                        show-word-limit
                    />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addtestDialogClose">取 消</el-button>
                <el-button type="primary" @click="addtestDialogConfirm">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            :visible.sync="showtstInfo"
            class="show_tst_Info"
            title="实验层详情"
            width="60%"
        >
            <div class="info_conts">
                <div class="tab_cont">
                    <span>{{itemInfo.name}}</span>
                    <span>运行实验{{itemInfo.runNum}}个</span>
                </div>
                <el-progress :percentage="itemInfo.percent" class="percent" :show-text="false"></el-progress>
                <div class="tab_cont">
                    <span>无可用流量</span>
                    <span>{{itemInfo.percent}}%</span>
                </div>
            </div>
            <div class="info_table">
                <div class="tit">实验信息</div>
                <el-table :data="layerList">
                    <el-table-column label="实验名称" prop="name">测试名称</el-table-column>
                    <el-table-column label="创建人" prop="creatUsr">micro</el-table-column>
                    <el-table-column label="状态" prop="status">进行中</el-table-column>
                    <el-table-column label="进组流量比例">
                        <template>
                            <el-progress :percentage="50"></el-progress>
                        </template>
                    </el-table-column>
                    
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showtstInfo = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    data() {
        return {
            searchInfo:{
                keyword: ''
            },
            // tableList:[],
            addtestDialog: false,
            addtestType: 0, // 0新增 1编辑
            formData:{
                name: '',
                description: ''
            },
            addRules:{
                name: [{ required: true, message: "请输入名称", trigger: "blur" }],
            },
            showtstInfo: false,
            itemInfo: []

        }
    },
    computed:{
        ...mapGetters('cms/settings/abtest', ['layerList']) // tableList
    },
    mounted(){
        this.queryTableList()
    },
    methods:{
        ...mapActions('cms/settings/abtest', [
            'getabtestLayer',
            'getlayerSave',
            'getlayerdDelete'
        ]),
        queryTableList() {
            let params = {
                ...this.searchInfo
            }
            this.getabtestLayer(params).then(res => {
                console.log('实验层列表',res)
            })
        },
        // 查询
        searchList(){
            console.log('查询')
            this.queryTableList()
        },
        // 重置查询
        resetForm() {
            this.searchInfo = this.$options.data().searchInfo
            this.queryTableList()
        },

        // 查看详情
        lookupInfo(row) {
            this.itemInfo = row
            this.showtstInfo = true
        },
        // 编辑
        itemEdit(row = null, type = 0) {
            this.addtestDialog = true
            this.addtestType = type
            if(type == 1) {
                let obj = { 
                    name: row.name,
                    description: row.description,
                    testId: row.testId,
                    id: row.id
                }
                this.formData = obj
            }
        },
        //保存新建 编辑
        addtestDialogConfirm(){
            console.log('保存新建', this.formData)
            this.$refs.addtestDialogref.validate(valid => {
                if (!valid) {
                    return false;
                }
                let params = {
                    ...this.formData
                }
                this.getlayerSave(params).then(res => {
                    console.log('保存新建/编辑', res)
                    if(res.success) {
                        this.$message.success(res.data);
                        this.queryTableList()
                        this.addtestDialogClose()
                    } else {
                        this.$message.error(res.errMsg);
                    }
                })
            })
        },
        // 删除
        itemDel(row) {
            let params = {
                id: row.id
            }
            this.getlayerdDelete(params).then(res => {
                console.log('删除',res)
                if(res.success){
                    this.$message.success(res.data)
                    this.queryTableList()
                } else {
                    this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                }
            })
        },
        addtestDialogClose(){
            this.addtestDialog = false
            this.formData = this.$options.data().formData
        }
    }
}
</script>
<style lang="scss" scoped>
.tab_cont{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 12px;
    color: #666666;
}
.info_table{
    .tit{
        font-size: 16px;
        border-top: 1px solid #eaeaea;
        padding-top: 20px;
        margin: 20px 10px;
    }
}
.percent{
    margin: 5px 0;
}
</style>