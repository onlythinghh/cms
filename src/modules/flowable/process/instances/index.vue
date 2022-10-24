<template>
    <div>
        <TableRow has-form has-header has-pagination>
            <template v-slot:form>
                <el-row :gutter="10">
                    <el-form ref="searchForm" label-width="80px">
                        <el-col :span="6">
                            <el-form-item label="干系人">
                                <el-input
                                    v-model="searchForm.involvedUser"
                                    placeholder="干系人"
                                    clearable
                                    maxlength="150"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="定义ID">
                                <el-input
                                    v-model="_processDefinitionId"
                                    placeholder="流程定义ID"
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
            <el-table stripe :data="_instances">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="businessKey" label="BusinessKey"></el-table-column>
                <el-table-column prop="processDefinitionName" label="流程定义"></el-table-column>
                <el-table-column prop="startTime" label="开始时间">
                    <template v-slot="{row}">{{row.startTime | dateFormat}}</template>
                </el-table-column>
                <el-table-column>
                    <template v-slot="{row}">
                        <el-button size="mini" type="primary" @click="onProcessTrack(row)">流程跟踪</el-button>
                    </template>
                </el-table-column>
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
        <Modal
            :visible="visible"
            title="流程跟踪"
            fullscreen
            class="diagram-modal"
            @close="onViewerClose"
        >
            <viewer v-bind="viewerJson" />
        </Modal>
    </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { showLoading, showError } from '@/utils'
import { Viewer } from '../../modeler'
export default {
    components: {
        viewer: Viewer
    },
    data() {
        const searchForm = {
            page: 1,
            size: 10,
            involvedUser: null,
        }
        return {
            searchForm,
            visible: false,
            viewerJson: null
        }
    },
    computed: {
        ...mapState('flowable/process/instances', ['instances', 'processDefinitionId']),
        _processDefinitionId: {
            get() {
                return this.processDefinitionId
            },
            set(value) {
                this.setProcessDefinitionId(value)
            }
        },
        _instances() {
            return this.instances.data || []
        },
        total() {
            return this.instances.total || 0
        }
    },
    watch: {
        viewerJson() {

        }
    },
    created() {
        this.reloadData()
    },
    methods: {
        ...mapMutations('flowable/process/instances', ['setProcessDefinitionId']),
        ...mapActions('flowable/process/instances', ['getProcessInstances', 'getInstanceModelJson']),
        reloadData() {
            const params = this.searchForm
            params.processDefinitionId = this._processDefinitionId
            showLoading(true, '正在加载数据...')
            this.getProcessInstances(params).then(() => {
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        onPaginationChange(page) {
            this.searchForm.page = page
            this.reloadData()
        },
        onSearch() {
            this.reloadData()
        },
        onProcessTrack(instance) {
            showLoading('正在加载数据...')
            this.getInstanceModelJson(instance.id).then(data => {
                showLoading(false);
                if (data) {
                    this.viewerJson = data
                    this.visible = true
                } else {
                    showError('数据获取失败.')
                }

            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        onViewerClose() {
            this.visible = false
            this.viewerJson = null
        }
    },
}
</script>
