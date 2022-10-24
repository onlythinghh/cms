<template>
    <div>
        <TableRow has-form has-header has-pagination>
            <template v-slot:form>
                <el-row :gutter="10">
                    <el-form ref="searchForm" label-width="80px">
                        <el-col :span="6">
                            <el-form-item label="Key">
                                <el-input
                                    v-model="searchForm.key"
                                    placeholder="Key (大小写敏感)"
                                    clearable
                                    maxlength="150"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="部署ID">
                                <el-col :span="18">
                                    <el-input
                                        v-model="_deploymentId"
                                        placeholder="部署ID"
                                        clearable
                                        maxlength="150"
                                    />
                                </el-col>
                                <el-col :span="6">
                                    <el-checkbox
                                        v-model="searchForm.latest"
                                        title="只显示最新版本"
                                        @change="onLatestChange"
                                    >只显示最新版本</el-checkbox>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                                <el-button
                                    type="primary"
                                    icon="el-icon-picture-outline"
                                    @click="onNewProcessDiagram"
                                >创建流程</el-button>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </template>
            <el-table stripe :data="_definstions">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="version" label="版本" width="100px">
                    <template v-slot="{row}">
                        <el-tag size="mini">v{{row.version}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="key" label="Key"></el-table-column>
                <el-table-column prop="suspended" label="状态" width="100px">
                    <template v-slot="{row}">
                        <el-tag v-if="row.suspended" type="danger" size="mini">暂停</el-tag>
                        <el-tag v-else type="success" size="mini">正常</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="tenantId" label="租户" width="150px"></el-table-column>
                <el-table-column label="操作">
                    <template v-slot="{row}">
                        <el-tooltip content="下载流程图" placement="left-start">
                            <el-button
                                size="mini"
                                type="primary"
                                icon="el-icon-download"
                                @click="onDownloadDefinitionResource(row)"
                            />
                        </el-tooltip>
                        <el-tooltip content="更新流程图" placement="right-end">
                            <el-button
                                size="mini"
                                type="primary"
                                icon="el-icon-picture"
                                @click="onUpgradeProcessDiagram(row)"
                            />
                        </el-tooltip>
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
        <!-- 画图 -->
        <CreateDiagramModal
            :visible.sync="diagramVisible"
            :diagram="diagram"
            :resource-name="resourceName"
            @save="onSaveDiagram"
        />
    </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import CreateDiagramModal from '../../components/create-diagram'
import { showLoading, showError } from '@/utils'
export default {
    components: {
        CreateDiagramModal
    },
    data() {
        const searchForm = {
            page: 1,
            size: 10,
            key: '',
            latest: false,
        }
        return {
            searchForm,
            diagram: null,
            diagramVisible: false,
            resourceName: '',
        }
    },
    computed: {
        ...mapState('flowable/process/definitions', ['definstions', 'deploymentId']),
        _deploymentId: {
            get() {
                return this.deploymentId || null
            },
            set(value) {
                this.setDeploymentId(value)
            }
        },
        _definstions() {
            return this.definstions.data || []
        },
        total() {
            return this.definstions.total || 0
        }
    },
    created() {
        this.reloadData()
    },
    methods: {
        ...mapMutations('flowable/process/definitions', ['setDeploymentId']),
        ...mapActions('flowable/process/definitions', [
            'getRepositoryProcessDefinitions',
            'getProcessDefinitionResourceData',
            'getProcessDefinitionXMLResource'

        ]),
        ...mapActions('flowable/process/deployment', [
            'deploymentXMLModel'
        ]),
        reloadData() {
            const params = this.searchForm
            params.deploymentId = this._deploymentId
            showLoading(true, '正在加载数据...')
            this.getRepositoryProcessDefinitions(params).then(() => {
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        getResourceName(resource) {
            if (resource) {
                return resource.substr(resource.lastIndexOf('/') + 1)
            }
            return ''
        },
        onPaginationChange(page) {
            this.searchForm.page = page
            this.reloadData()
        },
        onSearch() {
            this.reloadData()
        },
        onLatestChange() {
            this.reloadData()
        },
        onDownloadDefinitionResource(definition) {
            const processDefinitionId = definition.id
            let resourceName = definition.resource
            if (!processDefinitionId || !resourceName) {
                showError('下载失败,参数获取失败')
            }
            resourceName = this.getResourceName(resourceName)
            showLoading('正在下载文件...')
            this.getProcessDefinitionResourceData({ processDefinitionId, resourceName }).then(() => {
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        onNewProcessDiagram() {
            this.diagram = undefined
            this.diagramVisible = true
            this.resourceName = ''
        },
        onUpgradeProcessDiagram(processDefinition) {
            showLoading('正在获取资源...')
            this.getProcessDefinitionXMLResource(processDefinition.id).then(xml => {
                this.diagram = xml
                this.diagramVisible = true
                const resourceName = this.getResourceName(processDefinition.resource)
                if (resourceName) {
                    this.resourceName = resourceName.split('.')[0]
                }
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        onSaveDiagram(diagram) {

            // 保存流程图
            showLoading('正在保存数据...')
            this.deploymentXMLModel(diagram).then(() => {
                showLoading(false)
                this.diagram = null
                this.diagramVisible = false
                this.resourceName = ''
                this.reloadData()
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        }
    },
}
</script>
