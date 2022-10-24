<template>
    <div>
        <TableRow has-form has-header has-pagination>
            <template v-slot:form>
                <el-row :gutter="10">
                    <el-form ref="searchForm" label-width="80px">
                        <el-col :span="6">
                            <el-form-item label="名称">
                                <el-input
                                    v-model="searchForm.name"
                                    placeholder="名称"
                                    clearable
                                    maxlength="150"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="分配人">
                                <el-input
                                    v-model="searchForm.assignee"
                                    placeholder="分配人"
                                    clearable
                                    maxlength="150"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="Owner">
                                <el-input
                                    v-model="searchForm.owner"
                                    placeholder="Owner"
                                    clearable
                                    maxlength="150"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </template>
            <el-table stripe :data="_tasks">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="assignee" label="分配人"></el-table-column>
                <el-table-column prop="owner" label="Owner"></el-table-column>
                <el-table-column prop="createTime" label="创建时间">
                    <template v-slot="{row}">{{row.createTime | dateFormat}}</template>
                </el-table-column>
                <el-table-column prop="priority" label="优先级" width="80px"></el-table-column>
            </el-table>
            <template v-slot:pagination>
                <Pagination
                    :current-page="searchForm.page"
                    :page-size="searchForm.size"
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
            size: 10,
            name: '',
            assignee: '',
            owner: ''
        }
        return {
            searchForm
        }
    },
    computed: {
        ...mapState('flowable/process/tasks', ['tasks']),
        _tasks() {
            return this.tasks.data || []
        },
        total() {
            return this.tasks.total || 0
        }
    },
    created() {
        this.reloadData()
    },
    methods: {
        ...mapActions('flowable/process/tasks', ['getTasks']),
        reloadData() {
            const params = this.searchForm
            showLoading(true, '正在加载数据...')
            this.getTasks(params).then(() => {
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        onSearch() {
            this.reloadData()
        },
        onPaginationChange(page) {
            this.searchForm.page = page
            this.reloadData()
        }

    },
}
</script>
