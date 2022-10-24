<template>
    <div>
        <TableRow has-form has-header has-pagination>
            <template v-slot:form>
                <el-form ref="searchForm" :inline="true">
                    <el-form-item label="名称">
                        <el-input v-model="searchForm.nameLike" placeholder="名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="应用程序部署ID">
                        <el-input
                            v-model="searchForm.deploymentId"
                            placeholder="应用程序部署ID"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSearch">查询</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <el-table stripe :data="_definitions">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="deploymentId" label="部署ID" align="center"></el-table-column>
                <el-table-column prop="tenantId" label="租户" width="150"></el-table-column>
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
            deploymentId: '',
        }
        return {
            searchForm
        }
    },
    computed: {
        ...mapState('flowable/forms/definitions', ['definitions']),
        total() {
            return this.definitions.total || 0
        },
        size() {
            return this.definitions.size || 0
        },
        _definitions() {
            return this.definitions.data || []
        }
    },
    created() {
        this.reloadDefinitions()
    },
    methods: {
        ...mapActions('flowable/forms/definitions', ['getFormDefinitions']),
        reloadDefinitions(params = this.searchForm) {
            showLoading(true, '正在加载数据...')
            this.getFormDefinitions(params).then(() => {
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        onPaginationChange(page) {
            this.searchForm.page = page
            this.reloadDefinitions()
        },
        onSearch() {
            this.reloadDefinitions()
        }
    }
}
</script>
