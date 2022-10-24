<template>
    <div class="message">
        <div class="header">
            <el-form :model="formInline" class="demo-form-inline" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="姓名">
                            <el-input v-model="formInline.name" placeholder="请输入关键字" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态">
                            <el-select v-model="formInline.state" clearable placeholder="请选择">
                                <el-option label="已处理" value="1"></el-option>
                                <el-option label="未处理" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="事项">
                            <el-input v-model="formInline.matter" placeholder="请输入事项" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="手机">
                            <el-input v-model="formInline.phone" placeholder="请输入手机号" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="提交日期">
                            <el-date-picker
                            v-model="formInline.submitDate"
                            type="date"
                            :picker-options="options"
                            placeholder="选择日期"
                            value-format="timestamp"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item>
                            <el-button type="primary" @click="search">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="table">
                <el-table
                :data="tableData"
                border
                style="width: 100%"
                >
                    <el-table-column
                    type="index"
                    label="序号"
                    width="80"
                    align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        label="事项"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <div style="cursor: pointer;color: #1890ff;" @click="goDetails(scope.row)">
                                {{scope.row.matter}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="title"
                        label="标题"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>{{scope.row.title.slice(0,10)+'...'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="姓名"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        label="手机"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        label="提交日期"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.createTime ? dateFormat(scope.row.createTime) : ''}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="处理日期"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.replyTime ? dateFormat(scope.row.replyTime) : ''}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="状态"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        v-if="formInline.state == '0'"
                        label="操作"
                        align="center"
                    >
                    <template slot-scope="scope">
                        <div>
                            <el-button type="text" @click="update(scope.row)">操作</el-button>
                        </div>
                    </template>
                    </el-table-column>
                </el-table>
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
                <message-dialog v-if="details" :id="id" :form-data="form" :type="type" @close="close" @search="search"></message-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import { showLoading, hideLoading } from "@/utils";
import messageDialog from "./details.vue";
export default {
    components: {
        messageDialog
    },
    data() {
        return {
            options:{
                disabledDate(date){
                    return date.getTime() > Date.now()
                }
            },
            formInline: {
                matter: '',
                name: '',
                state: '0',
                phone: '',
                submitDate: ''
            },
            total: 0,
            page: 1,
            limit: 10,
            tableData: [],
            details: false,
            type: false
        }
    },
    created() {
        this.search()
    },
    methods: {
        ...mapActions('cms/settings/message',['list']),
        // 查询
        async search() {
            showLoading('查询中...')
            const data = await this.list({
                ...this.formInline
            })
            if(data.success) {
                this.total  = data.count
                this.tableData = data.data
            }
            hideLoading()
        },
        goDetails(item) {
            this.form = item
            this.type = false
            this.id = item.id
            this.details = true
        },
        // 关闭
        close() {
            this.details = false
        },
        // 看详情
        update(row) {
            this.form = row
            this.type = true
            this.details = true
        },
        handleSizeChange(v) {
            this.limit = v
            this.search()
        },
        handleCurrentChange(v) {
            this.page = v
            this.search()
        },
        // 时间格式化
        dateFormat(date) {
            var time = new Date(date)
            var m = time.getMonth()+1
            var d = time.getDate()
            return `${time.getFullYear()}.${m >9 ? m : '0' + m}.${d > 9 ? d : '0' + d}`
        },
    },
}
</script>

<style lang="scss" scoped>
.message {
    width: 100%;
    .header {
        width: 100%;
        /deep/ .el-input {
            width: 320px;
        }
    }
    .pagination {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding: 16px;
        box-sizing: border-box;
        /deep/ .el-input {
            width: 100px;
        }
    }
}
</style>
