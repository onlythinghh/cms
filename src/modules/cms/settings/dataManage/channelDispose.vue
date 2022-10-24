<template>
<!-- 渠道配置 -->
    <div class="channel_dispose">
        <TableRow :has-form="true" :has-header="true" :has-pagination="true">
            <template v-slot:form>
                <el-form ref="searchRef" label-width="80px" :model="searchInfo">
                    <el-row :gutter="10">
                        <el-col>
                            <el-form-item label="渠道">
                                <el-input
                                    v-model="searchInfo.keyword"
                                    placeholder="请输入名称"
                                    clearable
                                    style="width: 240px; margin-right: 10px"
                                    maxlength="30"
                                />
                                <el-button type="primary" @click="queryDataList">查询</el-button>
                                <el-button @click="restQueryDataList">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
            <template v-slot:header-right>
                <el-button type="primary" @click="addVisible = true">新增</el-button>
            </template>
            <el-table ref="tableList" :data="dataList" class="tableList">
                <el-table-column label="渠道种类" prop="eventName"></el-table-column>
                <el-table-column label="渠道访问量" prop="visits"></el-table-column>
                <el-table-column label="更新时间" prop="updateTime"></el-table-column>
                <el-table-column label="描述">
                    <template slot-scope="scope">
                        <span v-show="!scope.row.iseditor" class="disc" @click="itemEditor(scope, scope.$index)">
                            {{scope.row.disc}} <i class="el-icon-edit-outline"></i>
                        </span>
                        <el-input
                            v-show="scope.row.iseditor"
                            :ref="'inpt'+scope.$index"
                            v-model="scope.row.disc"
                            placeholder="请输入描述"
                            clearable
                            maxlength="50"
                            focus="true"
                            @blur="seaveEditor(scope)"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="disposeItem(scope.row)">配置</el-button>
                        <el-button type="text" size="mini" @click="itemDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                v-if="dataTotal > 10"
                class="pages"
                :page-sizes="[10, 20, 30, 40, 50]"
                :page-size="pageInfo.size"
                :total="dataTotal"
                layout="total, sizes, prev, pager, next"
                @size-change="sizeChange"
                @current-change="currentChange"
            ></el-pagination>
        </TableRow>
        <el-dialog
            title="新增渠道"
            :visible.sync="addVisible"
            :close-on-click-modal="false"
            width="50%"
            @close="handleAddClose"
        >
            <el-form ref="fomAddInfo" :model="addInfo" :rules="formAddRules" label-width="80px">
                <el-form-item label="字段名称" prop="eventName">
                        <el-input v-model="addInfo.channelName" placeholder="请输入渠道名称" clearable maxlength="30" />
                    </el-form-item>
                <el-form-item label="字段名称" prop="channelId">
                    <el-input v-model="addInfo.channelId" placeholder="请输入2~10位数的long值" clearable maxlength="10" />
                </el-form-item>
                <el-form-item label="字段名称" prop="channelDisc">
                    <el-input v-model="addInfo.channelDisc" placeholder="请输入字段名称" clearable maxlength="50" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="serveAdd">确 定</el-button>
                <el-button @click="handleAddClose">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog
            title="页面配置"
            :visible.sync="disposeDialog"
            width="40%"
            :before-close="disposeDialogClose"
            :close-on-click-modal="false"
        >
            <el-form ref="disposeref" :model="disposeForm" :rules="disposeRules" label-width="80px">
                <el-form-item label="分群名称">
                    <el-input v-model="disposeForm.name" disabled />
                </el-form-item>
                <el-form-item label="选择频道" prop="channel">
                    <TreeSelect
                        ref="testSelect"
                        v-model="disposeForm.channel"
                        placeholder="请选择父级资源"
                        :options="channerDatas"
                        :default-expand-all="true"
                        :checked-on-click="true"
                        text-prop="label"
                    />
                </el-form-item>
                <el-form-item label="选择页面" prop="porductId">
                    <el-select v-model="disposeForm.porductId" style="width: 392px" clearable placeholder="请选择">
                        <el-option
                            v-for="item in userAttrsOpt"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="disposeDialogClose">取 消</el-button>
                <el-button type="primary" @click="disposeConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { showLoading } from "@/utils"
import { deepCopy } from '@/utils/BaseUtil'
export default {
    data() {
        return {
            searchInfo: {
                keyword: ''
            },
            dataList: [],
            dataTotal: 0,
            pageInfo: {
                size: 10,
                page: 1
            },
            showChangeDise: false,

            addVisible: false,
            addInfo: {
                channelName: '',
                channelId: '',
                channelDisc: ''
            },
            formAddRules: {
                channelName: [{required: true, message: "渠道名为必填项", trigger: "blur" }],
                channelId: [{required: true, message: "渠道ID为必填项", trigger: "blur" }]
            },
            // 配置弹框
            channerDatas: [],
            disposeDialog: false,
            disposeRow: null,
            disposeForm: {
                name: '',
                channel: '',
                porductId: ''
            },
            disposeRules:{
                channel:[
                    { required: true, message: "渠道不能为空", trigger: "blur" }
                ]
            },
            userAttrsOpt: [
                {value: '1', label: '性别'},
                {value: '2', label: '感情状态'},
                {value: '3', label: '手机号'},
                {value: '4', label: '注册时间'},
            ],
        }
    },
    mounted(){
        this.queryDataList()
        this.getchannel()
    },
    methods:{
        ...mapActions("cms/channel/channelList", ["getChannelList"]),
        // 查询数据列表
        queryDataList() {
            let params = {
                ...this.searchInfo,
                ...this.pageInfo
            }
            console.log('查询数据列表', params)
            let obj = [
                {eventName: '渠道种类', visits: '1234', updateTime: '2022-02-02', disc: '预置', id: '1',iseditor: false},
                {eventName: '渠道种类2', visits: '1234', updateTime: '2022-02-02', disc: '预置', id: '2',iseditor: false}
            ]
            this.dataList = obj
            // this.dataTotal = res.total
        },
        // 获取频道
        async getchannel(){
            showLoading(true, "正在加载站频道");
            let _site = JSON.parse(sessionStorage.getItem("SITE"));
            // this.appid = _site.id
            let data = await this.getChannelList({ appid: _site.id });
            console.log('频道信息',data)
            const treeResources = deepCopy(data || [])
            this.channerDatas = this.toOptions(treeResources)
            showLoading(false);
        },
        // 父级资源
        toOptions(resources) {
            return resources.map(({ name: label, id: value, children }) => {
                const opt = { label, value}
                if (children && children.length > 0) {
                    opt.children = this.toOptions(children)
                }
                return opt
            })
        },

        // 重置查询
        restQueryDataList(){
            this.searchInfo = this.$options.data().searchInfo
            this.queryDataList()
        },
        // 保存新增
        serveAdd() {
            this.$refs.fomAddInfo.validate(valid => {
                if (!valid) {
                    return false;
                }
                console.log('addInfo', this.addInfo)
                // this.queryDataList()
                
            })
        },
        // 取消新增
        handleAddClose(){
            this.$refs.fomAddInfo.resetFields()
            this.addInfo = this.$options.data().addInfo
            this.addVisible = false
        },
        // 编辑表格描述
        itemEditor(scope, index) {
            this.dataList[index].iseditor = true
            this.$nextTick(() => {
                let videoPlayer = eval("this.$refs.inpt" +index)
                videoPlayer.focus()
            })
            
        },
        seaveEditor(scope) {
            console.log('scopescope',scope)
            let row = scope.row
            this.dataList[scope.$index].iseditor = false // 将当前行的修改隐藏
            let param = {
                id: row.id,
                disc: row.disc
            }
            console.log('编辑描述param:',param)
        },
        //表格删除
        itemDelete(row){
            console.log('删除', row)
        },
        
        // 配置弹框
        disposeItem(row){
            this.disposeDialog = true
            this.disposeRow = row
            this.disposeForm.name = row.eventName
        },
        disposeConfirm() {
            console.log('this.disposeForm',this.disposeForm)
        },
        disposeDialogClose(){
            this.disposeDialog = false
            this.disposeForm = this.$options.data().disposeForm
            this.disposeRow = null
        },

        sizeChange(v){
            this.pageInfo.size = v
            this.queryDataList()
        },
        currentChange(v){
            this.pageInfo.page = v
            this.queryDataList()
        },
    }
}
</script>
<style lang="scss" scoped>
.tableList{
    .disc{
        cursor: pointer;
        i{
            color: #46a6ff;
        }
    }
}
</style>