<template>
    <div class="guidance">
        <div class="header">
            <el-form ref="form" :model="form" :inline="true" label-width="50px">
                <!-- <el-form-item label="分类">
                    <el-select v-model="form.region" placeholder="请选择">
                    <el-option label="证件办理" value="shanghai"></el-option>
                    <el-option label="服务咨询" value="beijing"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="事项">
                    <el-select v-model="form.type" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in matter" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left: 50px;">
                    <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="btngroup" style="margin:24px 0;">
            <el-button type="primary" @click="write">填写</el-button>
            <el-button v-if="hasPermission('guidance_audit')" type="primary" @click="onSubmit">批量操作</el-button>
            <el-button type="primary" @click="_gowater">水印管理</el-button>

        </div>
        <div class="table">
            <el-table
            :data="tableData"
            border
            style="width: 100%"
            @selection-change="handleSelectionChange"
            >
                <el-table-column
                type="selection"
                width="55"
                align="center"
                >
                </el-table-column>
                <el-table-column
                type="index"
                label="序号"
                width="80"
                align="center"
                >
                </el-table-column>
                <!-- <el-table-column
                    prop="title"
                    label="分类"
                    align="center"
                >
                </el-table-column> -->
                <el-table-column
                    label="申请人"
                    align="center"
                >
                    <template slot-scope="scope">
                        <div class="people" style="color:#1890ff;" @click="details(scope.row)">{{scope.row.applyMan}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="事项"
                    align="center"
                >
                    <template slot-scope="scope">
                        <div>
                            {{matterChange(scope.row.type)}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="applyDate"
                    label="申请日期"
                    align="center"
                >
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.applyDate ? dateFormat(scope.row.applyDate) : ''}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="handler"
                    label="处理人员"
                    align="center"
                >
                </el-table-column>

                <el-table-column
                    label="状态"
                    align="center"
                >
                    <template slot-scope="scope">
                        <div>
                            {{stateChange(scope.row.state)}}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                    prop="reason"
                    label="处理意见"
                    align="center"
                >
                </el-table-column>

                <el-table-column
                    label="操作"
                    align="center"
                >
                 <template slot-scope="scope">
                     <div>
                         <el-button
                            v-if="scope.row.powers.includes('examine')"
                            type="text"
                            @click="check(scope.row)"
                         >审核</el-button>
                         <el-button
                          v-if="scope.row.powers.includes('update')"
                         type="text"
                         @click="update(scope.row)"
                         >修改</el-button>
                         <el-button v-if="scope.row.powers.includes('delete')" type="text" @click="del(scope.row)">删除</el-button>
                     </div>
                 </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination
            :page-sizes="[10, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            >
            </el-pagination>
        </div>
        <Dia
            v-if="dialog" ref="dialog"
            :show-b="showB"
            :title="title"
            :check="checkStatus"
            :type="type"
            :form-echo="formEcho"
            @closeDialog="closeDialog"
/>
        <Batch v-if="batch" ref="batch" :ids="ids" @closeDialog="closeDialog"/>
    </div>
</template>

<script>
import Dia from "./dialog.vue";
import Batch from "./batch.vue";
import { mapActions,mapState } from "vuex";
import { showLoading, hideLoading, confirm  } from "@/utils";
export default {
    components: {
        Dia,
        Batch
    },
    data() {
        return {
            title:'申请信息',
            showB:true,
            matter: [
                {
                    label: '车辆出入',
                    value: 11
                },
                {
                    label: '车辆恢复',
                    value: 12
                },
                {
                    label: '门禁',
                    value: 13
                },
                // {
                //     label: '就餐',
                //     value: 14
                // },
                // {
                //     label: '脸部识别',
                //     value: 15
                // }
            ],
            ids: [],
            batch: false,
            dialog: false,
            formEcho: {},
            form: {
                type: ''
            },
            checkStatus: false,
            tableData: [],
            page: 1,
            limit: 10,
            total: 0,
            type: ''
        }
    },
    computed:{
        ...mapState('authen', ['buttons']),
    },
    created() {
        this.search()
    },
    methods: {
        ...mapActions('cms/settings/guidance',['list','_del']),
        // 事项处理
        hasPermission(permission){
            return (this.buttons || []).indexOf(permission) != -1;
        },
        matterChange(type) {
            switch(type) {
            case 11:
                return '车辆出入'
            case 12:
                return '车辆恢复'
            case 13:
                return '门禁'
            case 14:
                return '就餐'
            case 15:
                return '脸部识别'
            }
        },
        // 状态处理
        stateChange(type) {
            switch(type) {
            case 'init':
                return '待处理'
            case 'adopt':
                return '通过'
            case 'reject':
                return '驳回'
            }
        },
        // 关掉dialog
        closeDialog() {
            this.dialog = false
            this.showB = true
            this.title = '申请信息'
            this.batch = false
            this.search()
        },
        // 填写
        write() {
            this.showB = false
            this.type = ''
            this.checkStatus = false
            this.formEcho = {}
            this.dialog = true
            this.title = '填写申请信息'
            // this.$refs.dialog.dialogVisible = true
        },
        // 审核
        check(row) {
            this.type = ''
            this.formEcho = row
            this.checkStatus = true
            this.dialog = true
            this.title = '审核申请信息'
            this.showB = true
        },
        // 修改
        update(row) {
            this.type = ''
            this.formEcho = row
            this.checkStatus = false
            this.dialog = true
            this.title = '修改申请信息'
            this.showB = false
        },
        // 删除
        async del(row) {
            confirm('确认删除吗?','警告',{
                ok: async () => {
                    showLoading('删除中...')
                    const data = await this._del({
                        id: row.id
                    })
                    hideLoading()
                    if(data.success) {
                        this.search()
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                    }
                }
            })
        },
        // 查询
        async search() {
            showLoading('正在查询中...')
            const data = await this.list({
                ...this.form,
                page: this.page,
                limit: this.limit
            })
            hideLoading()
            this.tableData = data.data
            this.total = data.count
        },
        // 批量通过
        onSubmit() {
            if(this.ids.length < 1) {
                this.$message({
                    type: 'error',
                    message: '至少勾选一个来进行批量通过'
                })
                return false
            }
            this.batch = true
        },
        handleSelectionChange(v) {
            this.ids = []
            v.forEach( item => {
                this.ids.push(item.id)
            })
        },
        // 时间格式化
        dateFormat(date) {
            var time = new Date(date)
            var m = time.getMonth()+1
            var d = time.getDate()
            return `${time.getFullYear()}.${m >9 ? m : '0' + m}.${d > 9 ? d : '0' + d}`
        },
        // 查看详情
        details(row) {
            this.checkStatus = true
            this.type = 'details'
            this.formEcho = row
            this.dialog = true
            this.title = '查看申请信息'
            this.showB = false
        },
        handleSizeChange(v) {
            this.limit = v
            this.search()
        },
        handleCurrentChange(v) {
            this.page = v
            this.search()
        },

        _gowater() {
            this.$router.push({ name: "watermark" });
        },
    },
}
</script>

<style lang="scss" scoped>
.people {
    cursor: pointer;
}
.pagination {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 16px;
    box-sizing: border-box;
}
</style>
