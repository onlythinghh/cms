<template>
    <div class="searchReport">
        <TableRow :has-form="true" :has-header="true" :has-pagination="true">
            <template v-slot:form>
                <el-form ref="searchRef" label-width="80px" :model="queryForm">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="时间">
                                <el-date-picker
                                    v-model="queryForm.createTime"
                                    type="datetimerange"
                                    range-separator="-"
                                    start-placeholder="开始日期"
                                    style="width: 100%"
                                    end-placeholder="结束日期"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="关键词">
                                <el-input v-model="queryForm.keyword" placeholder="请输入关键词" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                           <el-button type="primary" @click="queryTableList">查询</el-button>
                            <el-button @click="resetForm">重置</el-button>
                        </el-col>
                        
                    </el-row>
                </el-form>
            </template>
            <template v-slot:header-left>
                <el-button type="primary" @click="downloadExcel">导出</el-button>
            </template>
            <el-table ref="tableList" :data="detailList" class="tableList">
                <el-table-column label="序号" width="80">
                    <template slot-scope="scope"> {{scope.$index+1}} </template>
                </el-table-column>
                <el-table-column label="关键词" prop="keyWord"></el-table-column>
                <el-table-column label="时间区间" prop="time"></el-table-column>
                <el-table-column label="搜索次数" prop="count"></el-table-column>
            </el-table>
            <el-pagination
                v-if="total > 10"
                class="pages"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="limit"
                :total="total"
                layout="total, sizes, prev, pager, next"
                @size-change="sizeChange"
                @current-change="currentChange"
            ></el-pagination>
        </TableRow>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { showLoading } from "@/utils"
export default {
    data() {
        return {
            queryForm: {
                keyword: '',
                createTime: ''
            },
            detailList: [],
            total: 0,
            page: 1,
            limit: 10,
        }
    },
    mounted() {
        this.queryTableList()
    },
    methods:{
        ...mapActions('cms/settings/searchReport', ['getSearchList', 'getExcelexport']),

        // 获取表格数据
        queryTableList() {
            showLoading(true, "数据加载中...");
            console.log('queryForm',this.queryForm)
            let {  keyword, createTime } = this.queryForm
            // let startTime = startTime 
            let params = {
                startTime: createTime&&createTime[0] || '',
                endTime: createTime&&createTime[1] || '',
                keyword: keyword,
                page: this.page,
                limit: this.limit
            }
            this.getSearchList(params).then(res => {
                console.log('res', res)
                if(res.success) {
                    this.detailList = res.data
                    this.total = res.count
                } else {
                    this.$message.error(res.errMsg || '服务器异常，请稍后再试!')
                }
            }).finally(() => {
                showLoading(false);
            })
        },
        
        // 重置
        resetForm() {
            this.$refs.searchRef.resetFields()
            this.queryForm = this.$options.data().queryForm
            let thit = this
            this.$nextTick(() => {
                thit.queryTableList()
            })
        },

        // 导出
        downloadExcel() {
            let {  keyword, createTime } = this.queryForm
            let params = {
                startTime: createTime&&createTime[0] || '',
                endTime: createTime&&createTime[1] || '',
                keyword: keyword,
                page: this.page,
                limit: this.limit
            }
            this.getExcelexport(params).then(res => {
                if(res.success){
                    this.$message.success(res.message)
                } else {
                    this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                }
            }).catch(err => {
                this.$message.error(err||'服务器繁忙，请稍后再试！')
            })
        },

        // 每页数量切换
        sizeChange(v) {
            this.limit = v
            this.queryTableList()
        },
        // 分页
        currentChange(v) {
            this.page = v
            this.queryTableList()
        }
    }
}
</script>