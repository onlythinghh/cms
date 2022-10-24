<template>
    <div>
        <TableRow has-form has-header has-pagination>
            <template v-slot:form>
                <el-form ref="searchForm" :inline="true">
                    <el-form-item label="名称">
                        <el-input v-model="searchForm.nameLike" placeholder="名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="租户标识符">
                        <el-input v-model="searchForm.tenantIdLike" placeholder="租户标识符" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSearch">查询</el-button>
                        <el-button
                            type="primary"
                            icon="el-icon-upload2"
                            @click="onCreateForm"
                        >创建Form</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <el-table stripe :data="_forms">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="deploymentTime" label="部署时间" width="200" align="center">
                    <template v-slot="{row}">{{row.deploymentTime | dateFormat}}</template>
                </el-table-column>
                <el-table-column prop="category" label="分类" width="150"></el-table-column>
                <el-table-column prop="tenantId" label="租户" width="150"></el-table-column>
                <el-table-column prop="opts" label="操作" align="center">
                    <template v-slot="{row}">
                        <el-button size="mini" type="danger" @click="onDeleteForm(row)">删除</el-button>
                        <el-button size="mini" type="primary" @click="onExportForm(row)">导出</el-button>
                    </template>
                </el-table-column>
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
        <Modal
            title="上传流程或者包"
            :visible="uploadVisible"
            :destroy-on-close="true"
            width="450px"
            class="process-upload-modal"
            @close="closeModal"
        >
            <div class="el-upload__tip upload-top-tip">
                <i class="el-icon-info" />
                选择一个.form 表单文件开始部署。
            </div>
            <el-row>
                <el-form label-width="80px" :rules="uploadRules">
                    <el-form-item label="租户ID">
                        <el-col :span="20">
                            <el-input v-model="tenantId" placeholder="租户ID" clearable></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="选择文件" prop="file">
                        <el-col :span="20">
                            <el-upload
                                drag
                                action
                                :limit="1"
                                :multiple="false"
                                :file-list="fileList"
                                :before-upload="onBeforeUpload"
                                :http-request="onImportForm"
                            >
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">
                                    将文件拖到此处，或
                                    <em>点击上传</em>
                                </div>
                            </el-upload>
                        </el-col>
                    </el-form-item>
                </el-form>
            </el-row>

            <div v-show="fileUploadErrMessage" style="margin-top:10px">
                <el-alert
                    title="错误"
                    type="error"
                    :description="fileUploadErrMessage"
                    :closable="false"
                ></el-alert>
            </div>
        </Modal>
    </div>
</template>
<script>

import { mapActions, mapState } from 'vuex'
import { showLoading, showError, showMessage } from '@/utils'
export default {
    data() {
        const searchForm = {
            page: 1,
            nameLike: '',
            tenantIdLike: ''
        }
        const uploadRules = {
            file: [
                { required: true, message: "请选择文件" },/*
                {
                    validator: function (value) {

                    }
                } */
            ]
        }
        return {
            searchForm,
            uploadVisible: false,
            fileList: [],
            fileUploadErrMessage: '',
            tenantId: '',
            uploadRules
        }
    },
    computed: {
        ...mapState('flowable/forms/deployment', ['forms']),
        _forms() {
            return this.forms.data
        },
        total() {
            return this.forms.total
        },
        size() {
            return this.forms.size
        }
    },
    created() {
        this.reloadForms()
    },
    methods: {
        ...mapActions('flowable/forms/deployment', [
            'getFormDeployments',
            'createFormDeployments',
            'exportFormDeployments',
            'deleteFormDeployments'

        ]),
        reloadForms(params = this.searchForm) {
            showLoading(true, '正在加载数据...')
            this.getFormDeployments(params).then(() => {
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        closeModal() {
            this.uploadVisible = false
        },
        onSearch() {
            this.searchForm.page = 1
            this.reloadForms()
        },
        onPaginationChange(page) {
            this.searchForm.page = page
            this.reloadForms()
        },
        onCreateForm() {
            this.uploadVisible = true
        },
        onBeforeUpload(file) {
            if (!/(\.form)$/.test(file.name)) {
                this.fileUploadErrMessage = file.name + '文件格式不正确,请选择 .form 类型的文件。'
                return false
            }
            this.fileList = [file]
            return true
        },
        onImportForm({ file, onError, onProgress, onSuccess }) {
            this.fileUploadErrMessage = ''
            showLoading(true, '正在创建Form...')
            this.createFormDeployments({ file, tenantId: this.tenantId }).then(response => {
                showLoading(false)
                showMessage('创建成功...')
                this.searchForm.page = 1
                this.reloadForms()
                this.closeModal()
                onSuccess(response)
            }).catch(error => {
                showLoading(false)
                this.fileUploadErrMessage = error.message
                onError(error)
            })
        },
        onExportForm(item) {
            showLoading(true, '正在导出...')
            this.exportFormDeployments({ deploymentId: item.id, resourceName: item.name }).then(() => {
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        onDeleteForm(item) {
            this.$confirm('确认删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                showLoading(true, '正在删除...')
                this.deleteFormDeployments(item.id).then(() => {
                    showLoading(false)
                    this.searchForm.page = 1
                    this.reloadForms()
                }).catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
            }).catch(() => { })

        }
    }
}
</script>
