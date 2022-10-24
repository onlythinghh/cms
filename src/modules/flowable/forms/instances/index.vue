<template>
    <div>
        <TableRow has-form has-header has-pagination>
            <template v-slot:form>
                <el-form ref="searchForm" :inline="true">
                    <el-form-item label="名称">
                        <el-input v-model="searchForm.nameLike" placeholder="名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="租户标识">
                        <el-input v-model="searchForm.tenantId" placeholder="租户标识" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSearch">查询</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <el-table stripe :data="_instances">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="taskId" label="任务ID" align="center"></el-table-column>
                <el-table-column prop="processInstanceId" label="流程实例ID" align="center"></el-table-column>
                <el-table-column prop="submittedDate" label="提交日期" width="150">
                    <template v-slot="{row}">{{row.submittedDate | dateFormat}}</template>
                </el-table-column>
                <el-table-column prop="submittedBy" label="提交用户" width="150"></el-table-column>
                <el-table-column prop="tenantId" label="租户ID" width="100"></el-table-column>
            </el-table>
            <template v-slot:pagination>
                <Pagination
                    :current-page="searchForm.page"
                    :page-size="size"
                    :total="total"
                    @current-change="onPaginationChange"
                ></Pagination>
            </template>
        </TableRow>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { showLoading, showError } from '@/utils'
export default {
    data() {
        const searchForm = {
            page: 1,
            nameLike: '',
            tenantId: '',
        }

        return {
            searchForm
        }
    },
    computed: {
        ...mapState('flowable/forms/instances', ['instances']),
        _instances() {
            return this.instances.data || []
        },
        size() {
            return this.instances.size || 0
        },
        total() {
            return this.instances.total || 0
        }
    },
    created() {
        this.reloadInstances()
    },
    methods: {
        ...mapActions('flowable/forms/instances', ['getFormInstances']),
        reloadInstances(params = this.searchForm) {
            showLoading(true, '正在加载数据...')
            this.getFormInstances(params).then(() => {
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        onPaginationChange(page) {
            this.searchForm.page = 1
            this.reloadInstances()
        },
        onSearch() {
            this.searchForm.page = 1
            this.reloadInstances()
        }
    }
}
</script>
