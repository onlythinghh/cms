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
                            <el-form-item label="租户标识">
                                <el-input
                                    v-model="searchForm.tenantId"
                                    placeholder="租户标识"
                                    clearable
                                    maxlength="150"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                                <el-button
                                    type="primary"
                                    icon="el-icon-upload2"
                                    @click="onUploadProcess"
                                >上传流程或者包</el-button>
                                <el-button
                                    type="primary"
                                    icon="el-icon-picture-outline"
                                    @click="diagramVisible = true"
                                >创建流程</el-button>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </template>
            <el-table stripe :data="_deployments">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="deploymentTime" label="部署时间">
                    <template v-slot="{row}">{{row.deploymentTime | dateFormat}}</template>
                </el-table-column>
                <el-table-column prop="category" label="分类"></el-table-column>
                <el-table-column prop="tenantId" label="租户"></el-table-column>
                <el-table-column label="操作">
                    <template v-slot="{row}">
                        <el-button
                            size="mini"
                            type="danger"
                            icon="el-icon-delete"
                            @click="onDeleteDeployment(row)"
                        >删除</el-button>
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
            title="上传流程或者包"
            :visible="uploadVisible"
            width="450px"
            class="process-upload-modal"
            @close="closeModal"
        >
            <div class="el-upload__tip upload-top-tip">
                <i class="el-icon-info" />
                选择一个.bpmn, .bpmn20.xml流程文件 去部署或者上传一个包含资产的应用程序的 .zip或者.bar文件。
            </div>
            <el-upload
                drag
                action
                :limit="1"
                :multiple="false"
                :file-list="fileList"
                :before-upload="onBeforeUpload"
                :http-request="onImportBpmn"
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
            </el-upload>
            <div v-show="fileUploadErrMessage" style="margin-top:10px">
                <el-alert
                    title="错误"
                    type="error"
                    :description="fileUploadErrMessage"
                    :closable="false"
                ></el-alert>
            </div>
        </Modal>

        <!-- 画图 -->
        <CreateDiagramModal :visible.sync="diagramVisible" @save="onSaveDiagram" />
    </div>
</template>
<script>
import { showLoading, showError } from '@/utils'
import { mapActions, mapState, mapMutations } from 'vuex'
import CreateDiagramModal from '../../components/create-diagram'
export default {
    components: {
        CreateDiagramModal
    },
    data() {
        const searchForm = {
            page: 1,
            size: 10,
            name: null,
            tenantId: null
        }
        return {
            searchForm,
            fileUploadErrMessage: '',
            fileList: [],
            uploadVisible: false,
            diagramVisible: false
        }
    },
    computed: {
        ...mapState('flowable/process/deployment', ['deployments']),
        total() {
            return this.deployments.total || 0
        },
        _deployments() {
            return this.deployments.data || []
        }
    },
    created() {
        this.reloadData()
    },
    methods: {
        ...mapMutations('flowable/process/definitions', ['setDeploymentId']),
        ...mapActions('flowable/process/deployment', [
            'getProcessDeployments',
            'createRepositoryDeployments',
            'deleteRepositoryDeployment',
            'deploymentXMLModel'
        ]),
        reloadData() {
            showLoading(true, '正在加载数据...')
            this.getProcessDeployments(this.searchForm).then(() => {
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        onSearch() {
            this.reloadData()
        },
        closeModal() {
            this.fileList = []
            this.uploadVisible = false
        },
        onUploadProcess() {
            this.uploadVisible = true
        },
        onDeleteDeployment(deployment) {
            this.$confirm('确认删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                showLoading(true, '正在删除...')
                this.deleteRepositoryDeployment(deployment.id).then(() => {
                    showLoading(false)
                    this.searchForm.page = 1
                    this.reloadData()
                }).catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
            }).catch(() => { })
        },
        onPaginationChange(currentPage) {
            this.searchForm.page = currentPage
            this.reloadData()
        },
        onBeforeUpload(file) {
            if (!/(\.bpmn|\.bpmn20\.xml|\.zip|\.bar)$/.test(file.name)) {
                this.fileUploadErrMessage = file.name + '文件格式不正确'
                return false
            }
            this.fileList = [file]
            return true
        },
        onImportBpmn({ file, onError, onProgress, onSuccess }) {
            this.fileUploadErrMessage = ''
            onProgress('正在上传...')
            this.createRepositoryDeployments({ file }).then(response => {
                onSuccess(response)
                this.closeModal()
                this.reloadData()
            }).catch(error => {
                this.fileUploadErrMessage = error.message
                onError(error)
            })
        },
        onSaveDiagram(diagram) {
            // 保存流程图
            showLoading('正在保存数据...')
            this.deploymentXMLModel(diagram).then(() => {
                showLoading(false)
                this.diagramVisible = false
                this.reloadData()
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        }
    }
}
</script>
