<template>
    <div class="overview_form">
        <!-- 表单概览 -->
        <TableRow :has-form="true" :has-header="true" :has-pagination="true">
            <template v-slot:form>
                <el-form ref="searchRef" label-width="80px" :model="searchData">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="表单名称">
                                <el-input
                                    v-model="searchData.formName"
                                    placeholder="请输入表单名称"
                                    clearable
                                    maxlength="30"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="显示名称">
                                <el-input
                                    v-model="searchData.displayName"
                                    placeholder="请输入显示名称"
                                    clearable
                                    maxlength="30"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-button type="primary" @click="searchList">查询</el-button>
                            <el-button @click="resetForm">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
            <template v-slot:header-right>
                <el-button type="primary" @click="addfroms">新增表单</el-button>
            </template>
            <el-table ref="tableList" :data="tableData">
                <el-table-column label="序号" width="50">
                    <template slot-scope="scope"> {{scope.$index+1}} </template>
                </el-table-column>
                <el-table-column label="表单名称" prop="formName"></el-table-column>
                <el-table-column label="显示名称" prop="displayName"></el-table-column>
                <el-table-column label="创建人" prop="createUser"></el-table-column>
                <el-table-column label="创建时间" prop="createTime">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime|dateFormat}}</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="formDetaill(scope.row)">详情</el-button>
                        <el-button type="text" size="small" @click="formEdit(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="formCopy(scope.row)">复制</el-button>
                        <el-button type="text" size="small" @click="formDeploy(scope.row)">配置</el-button>
                        <el-button type="text" size="small" @click="formDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                v-if="total > 10"
                class="pages"
                :page-sizes="[20, 40, 60, 80]"
                :page-size="listInfo.limit"
                :total="total"
                layout="total, sizes, prev, pager, next"
                @size-change="sizeChange"
                @current-change="currentChange"
            ></el-pagination>
        </TableRow>
        <el-dialog
            :title="titles[formTitleType]"
            :visible.sync="formVisible"
            :close-on-click-modal="false"
            width="90%"
            @close="handleClose"
        >
            <el-form ref="handleData" :rules="editDataRules" :model="addData" label-width="100px">
                <el-row class="meta">
                    <el-col :span="14">
                        <el-form-item label="新增表单"></el-form-item>
                        <el-form-item label="表单名称" prop="formName">
                            <el-input v-model="addData.formName" maxlength="30" placeholder="请输入表单名称" clearable />
                        </el-form-item>
                        <el-form-item label="显示名称" prop="displayName">
                            <el-input v-model="addData.displayName" maxlength="30" placeholder="请输入表单名称" clearable />
                        </el-form-item>
                        <el-form-item label="验证方式" prop="checkType">
                            <el-radio-group v-model="addData.checkType">
                                <el-radio :label="0">图片滑块</el-radio>
                                <el-radio :label="1">验证码</el-radio>
                                <el-radio :label="2">两者</el-radio>
                            </el-radio-group> 
                        </el-form-item>
                        <el-form-item>
                            <div class="transfer">
                                <el-transfer
                                    v-model="addData.selectIds"
                                    filterable
                                    filter-placeholder="请输入字段名"
                                    :data="transferData"
                                    :props="{
                                        key: 'id',
                                        label: 'displayName'
                                    }"
                                    :titles="['字段库', '已选字段']"
                                    @change="changeTransfer"
                                >
                                </el-transfer>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="表单预览"></el-form-item>
                        <div class="right_view">
                            <p class="tit">{{addData.displayName}}</p>
                        </div>
                        <el-row v-for="(arr, index) in previewData" :key="index">
                            <el-col v-for="obj in arr.grop" :key="obj.id" :span="12">
                                <el-form-item :label="obj.displayName">
                                    <span v-if="obj.fieldType == 4">
                                        <el-input disabled placeholder="请输入" />
                                    </span>
                                    <span v-if="obj.fieldType == 1">
                                        <el-radio disabled label="1">选项1</el-radio>
                                        <el-radio disabled label="2">选项2</el-radio>
                                    </span>
                                    <span v-else-if="obj.fieldType == 2">
                                        <el-checkbox disabled>选项1</el-checkbox>
                                        <el-checkbox disabled>选项2</el-checkbox>
                                    </span>
                                    <span v-else-if="obj.fieldType == 3">
                                        <el-select disabled placeholder="请选择时间"></el-select>
                                    </span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="serveAdd">保 存</el-button>
                <el-button @click="formVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="页面配置"
            :visible.sync="deployVisible"
            :close-on-click-modal="false"
            width="60%"
            @close="handleDeployClose"
        >
            <el-form ref="deployref" :model="deployData" class="deployfm" label-width="80px">
                <el-form-item label="关联频道" prop="channel">
                    <el-button type="primary" size="mini" @click="channeShow = true">选择</el-button>
                    <div class="Channe_Name">
                        <span v-for="(val, key) in selectChannel" :key="key" class="cl_name">
                            {{ val.label }}
                        </span>
                    </div>
                    <el-dialog title="频道选择" :modal="false" :visible.sync="channeShow" center>
                        <!-- :props="defaultProps" -->
                        <el-tree
                            ref="tree"
                            :data="channerDatas"
                            show-checkbox
                            node-key="id"
                            check-strictly
                            :default-checked-keys="selectChannel"
                            highlight-current
                            @check-change="handleCheckChange"
                        ></el-tree>
                        <div slot="footer" class="dialog-footer">
                            <el-button size="mini" @click="channeShow = false">取 消</el-button>
                            <el-button size="mini" type="primary" @click="channeOk">确 定</el-button>
                        </div>
                    </el-dialog>
                </el-form-item>
                <!-- <el-form-item :label="!isLoadOpt2 ? '' : '详情'">
                    <el-select v-show="isLoadOpt2" v-model="deployData.product" multiple collapse-tags clearable placeholder="请选择">
                        <el-option
                            v-for="item in deployOpt2"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                    <span class="ad" @click="onloadChild">{{ !isLoadOpt2 ? '添加' : '删除' }}</span>
                </el-form-item> -->
            </el-form>
             <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="serveDeploy">保 存</el-button>
                <el-button @click="deployVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { deepCopy } from '@/utils/BaseUtil'
import { matchCode } from "@/utils/RegExpUtil"
import { showLoading } from "@/utils"
export default {
    data() {
        return {
            searchData:{
                formName: '',
                displayName: ''
            },
            listInfo:{
                page: 1,
                limit: 20
            },
            total: 0,
            tableData: [],
            formVisible: false,
            formTitleType: '0',
            titles: ['新增表单', '编辑表单', '复制表单'],
            editDataRules: { // 表单验证规则
                formName: [{ required: true, message: "表单名称为必填项", trigger: "blur" },
                    {validator: function(rule, value, callback) {
                        if (value && !matchCode(value)) {
                            callback("表单名称只能输入数字、字母、下划线");
                        } else {
                            callback();
                        }
                    }}
                ],
                displayName: [{required: true, message: "显示名称为必填项", trigger: "blur"}]
            },
            addData: {
                formName: '',
                checkType: 0,
                displayName: '',
                selectIds: [],// 字段库选中的id
            },
            transferData:[],
            checkedData: [],// 字段库选中的数据（右边的）
            previewData: [], // 右侧预览数据（两条一组）
            deployVisible: false, // 显示配置弹框
            deployData: {
                product: []
            },
            isLoadOpt2: false,
            deployOpt2: [], // 详情数据
            deployItem:[],
            channerDatas: [], // 渠道数据
            selectChannel: [], // 选择的渠道数据
            channeShow: false,
            
        }
    },
    created() {
        this.queryTableList()
    },
    watch:{
        deployVisible(newVal) {
            if(newVal) {
                this.getchannel()
            }
        }
    },
    methods: {
        ...mapActions('cms/dataform',[
            'getlzFormSave',
            'getlzCapitalList',
            'getlzCapitalFormDel',
            'getlzCapitalBindChannel',
            'getFieldList'
        ]),
        ...mapActions("cms/channel/channelList", ["getChannelList"]),
        // ---------------参考系统管理>资源管理-----------------
        // 获取频道
        async getchannel(){
            showLoading(true, "正在加载站频道");
            let _site = JSON.parse(sessionStorage.getItem("SITE"));
            let data = await this.getChannelList({ appid: _site.id });
            // console.log('频道信息',data)
            const treeResources = deepCopy(data || [])
            this.channerDatas = this.toOptions(treeResources)
            showLoading(false);
        },

        // 选择频道
        handleCheckChange(data, v) {
            console.log('选择频道:', data, v)
            if (v) {
                this.selectChannel.push({ id: data.id, label: data.label });
            } else {
                let name = [];
                this.selectChannel.forEach(ele => {
                    if (ele.id !== data.id) {
                        name.push(ele);
                    }
                });
                this.selectChannel = [...name];
            }
        },
        channeOk() {
            this.channeShow = false;
        },

        // 父级资源
        toOptions(resources) {
            // const restest ={ id: null}
            // const { id: currentId } = restest // this.resourceForm
            return resources.map(({ name: label, id, children }) => {
                const opt = { label, id}
                if (children && children.length > 0) {
                    opt.children = this.toOptions(children)
                }
                return opt
            })
            // .filter(res => {
            //     if (res.type === 1) {
            //         // 父级不能选中自己和自己的子级
            //         if (currentId === res.value) {
            //             return false
            //         }
            //         return true
            //     }
            //     return false
            // })
        },
        // --------------------------------
        // 查询数据列表
        queryTableList(){
            let params = {
                ...this.searchData,
                ...this.listInfo
            }
            this.getlzCapitalList(params).then(res => {
                console.log('查询数据列表1',res)
                if(res.success){
                    this.tableData = res.data
                    this.total = res.count
                } else {
                    this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                }
            })
        },
        searchList() {
            this.queryTableList()
        },
        // 重置查询
        resetForm() {
            this.searchData = this.$options.data().searchData
            this.queryTableList()
        },

        // 新增表单
        addfroms() {
            this.formVisible = true
            this.formTitleType = '0'
            this.getcheckData()
        },
        // 获取字段库数据
        getcheckData(selArr=[]){
            this.getFieldList({limit: 999}).then(res => {
                const { success, data, errMsg } = res
                console.log('字段信息：', res)
                if(success){
                    this.transferData = data
                    console.log('selArr',selArr)
                    
                    let selId = selArr.map(ele => ele.id)
                    let idsArr = []
                    this.checkedData = data.filter(item => {
                        if(selId.includes(item.id)) {
                            idsArr.push(item.id)
                            return item
                        }
                    })
                    this.addData.selectIds = idsArr
                    
                    this.previewData = this.viewsplit(this.checkedData, 2)
                } else {
                    this.$message.error(data||errMsg||'服务器繁忙，请稍后再试！')
                }
                
            
            })
        },
        changeTransfer(value, direction, movedKeys) {
            this.checkedData = this.commonEvt(this.transferData, value)
            this.previewData = this.viewsplit(this.checkedData, 2)
            // console.log('切割：', this.viewsplit(this.checkedData, 2))
        },
       
        

        // 保存
        serveAdd() {
            this.$refs.handleData.validate(valid => {
                if (!valid) {
                    return false;
                }
                let { formName, checkType, displayName, selectIds, id='' } = this.addData
                let params = {
                    formName,
                    checkType,
                    displayName,
                    selectIds,
                }
                if(this.formTitleType == '1') {
                    params.id = id
                }
                console.log('保存表单', params)
                this.getlzFormSave(params).then(res => {
                    if(res.success){
                        this.queryTableList()
                        this.formVisible = false
                        this.$message.success(res.data)
                    } else {
                        this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                    }
                })
            })
        },
        // 查看详情
        formDetaill(row) {
            // console.log('查看详情', row)
            this.$router.push({path: '/dataform/detail', query:{id:row.id}})
        },
        // 编辑
        formEdit(row){
            this.formTitleType = '1'
            this.formVisible = true
            this.addData = row
            let selList = row.selectFieldList || []
            this.getcheckData(selList)
        },
        // 复制
        formCopy(row) {
            this.formTitleType = '2'
            this.formVisible = true
            this.addData = row
            let selList = row.selectFieldList || []
            this.getcheckData(selList)
        },

        
        formDeploy(row) {
            this.deployVisible = true
            this.deployItem = row
            this.getchannel()
        },
        // 添加详情按钮切换
        onloadChild(){
            this.isLoadOpt2 = !this.isLoadOpt2
            if(!this.isLoadOpt2){
                this.deployData.product = []
            }
        },
        // 配置保存
        serveDeploy(){
            if(!this.selectChannel.length) {
                return this.$message.warning('请至少选择一个频道!')
            }
            let channelIds = this.selectChannel.map(ele => ele.id)
            let params = {
                channel: channelIds,
                ids: [this.deployItem.id]
            }
            this.getlzCapitalBindChannel(params).then(res => {
                console.log('保存配置', res)
                if(res.success){
                    this.deployVisible = false
                    this.$message.success(res.data)
                } else {
                    this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                }
            }).catch(err => {
                this.$message.error(err||'服务器繁忙，请稍后再试！')
            })
        },
        // 删除
        formDelete(row) {
            showLoading(true, "正在加载...");
            let params = {
                ids: [row.id]
            }
            this.getlzCapitalFormDel(params).then(res => {
                showLoading();
                console.log('删除表格', res)
                if(res.success){
                    this.queryTableList()
                    this.$message.success(res.data)
                } else {
                    this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                }
            })
        },

        // 新增弹窗关闭
        handleClose(){
            this.addData = this.$options.data().addData
            this.$refs.handleData.resetFields()
            this.checkedData = []
            this.previewData = []
        },
        // 配置弹框关闭
        handleDeployClose() {
            this.deployData = this.$options.data().deployData
            this.selectChannel = this.$options.data().selectChannel
            this.channerDatas = this.$options.data().channerDatas
            // this.isLoadOpt2 = false
            this.$refs.deployref.resetFields()
        },

        sizeChange(v){
            this.listInfo.limit = v
            // console.log('翻页1： ', v)
            this.queryTableList()
        },
        currentChange(v){
            this.listInfo.page = v
            // console.log('翻页2： ', v)
            this.queryTableList()
        },

        /**
         * 过滤选择的数据
         */
        commonEvt(data,state=[]) {
            return data.filter(item => state.includes(item.id))
        },
        // 预览数据拆分
        viewsplit(data, size=2){
            let idx = 0
            let newArray = []
            while(idx < data.length) {
                let arr = data.slice(idx, idx+=size)
                newArray.push({grop: arr})
            }
            return newArray
        }

    }
}
</script>
<style lang="scss" scoped>
.overview_form{
    /deep/ .meta {
        .el-col-14 {
            padding-right: 30px;
            border-right: 1px solid #dcdfe6;
        }
    }
    .right_view{
        .tit{
            text-align: center;
        }
    }
    .deployfm{
        .ad{
            color: #46a6ff;
            margin-left: 10px;
            cursor: pointer;
        }
        .Channe_Name{
            .cl_name{
                padding: 5px 8px;
                font-size: 14px;
                border: 1px solid #46a6ff;
                border-radius: 14px;
                margin: 4px 6px;
            }
        }
    }
    
}

</style>