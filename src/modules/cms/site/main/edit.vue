<template>
    <Modal
        :visible="siteModalVisible"
        width="800"
        :title="title"
        class="site-edit-modal"
        @close="closeModal"
    >
        <el-form ref="siteForm" :model="siteForm" :rules="siteFormRules" label-width="100px">
            <el-card>
                <template #header>基本信息</template>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="站点名称" prop="name">
                            <el-input
                                v-model="siteForm.name"
                                :disabled="isReadOnly"
                                placeholder="站点名称"
                                maxlength="50"
                            />
                        </el-form-item>
                        <el-form-item label="显示名称" prop="showName">
                            <el-input
                                v-model="siteForm.showName"
                                :disabled="isReadOnly"
                                placeholder="显示名称"
                                maxlength="50"
                            />
                        </el-form-item>
                        <el-form-item label="站点类型" prop="type">
                            <el-select
                                v-model="siteForm.type"
                                :disabled="isReadOnly"
                                placeholder="请选择站点类型"
                                class="w100"
                            >
                                <el-option
                                    v-for="(text, key) in siteType"
                                    :key="key"
                                    :label="text"
                                    :value="Number(key)"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="站点关键字" prop="keywords">
                            <el-input
                                v-model="siteForm.keywords"
                                :disabled="isReadOnly"
                                type="textarea"
                                rows="3"
                                resize="none"
                                placeholder="站点关键字"
                                maxlength="200"
                            />
                        </el-form-item>
                        <el-form-item label="描述" prop="descript">
                            <el-input
                                v-model="siteForm.descript"
                                :disabled="isReadOnly"
                                type="textarea"
                                rows="3"
                                resize="none"
                                placeholder="描述"
                                maxlength="200"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="父级站点" prop="pid">
                            <TreeSelect
                                v-model="siteForm.pid"
                                value-prop="value"
                                text-prop="label"
                                :options="siteOptions"
                            ></TreeSelect>
                            <!-- <el-cascader
                                v-model="siteForm.pids"
                                :options="siteOptions"
                                :disabled="isReadOnly"
                                :clearable="true"
                                @clear="pidClear"
                                :show-all-levels="false"
                                :change-on-select="true"
                                class="w100"
                            ></el-cascader>-->
                        </el-form-item>
                        <el-form-item label="站点根" prop="path">
                            <el-input
                                v-model="siteForm.path"
                                :disabled="isReadOnly"
                                placeholder="站点根"
                                maxlength="50"
                            />
                        </el-form-item>
                        <el-form-item label="版权信息" prop="copyright">
                            <el-input
                                v-model="siteForm.copyright"
                                :disabled="isReadOnly"
                                placeholder="版权信息"
                                maxlength="200"
                            />
                        </el-form-item>
                        <el-form-item label="网站LOGO" prop="logo">
                            <el-upload
                                v-if="!isReadOnly"
                                v-loading="uploadLoading"
                                class="site-logo-uploader"
                                action
                                :http-request="_uploadLogo"
                                :show-file-list="false"
                            >
                                <img v-if="siteForm.logo" :src="siteForm.logo" class="site-logo" />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <div v-else class="site-logo-uploader show-only-logo">
                                <img v-if="siteForm.logo" :src="siteForm.logo" class="site-logo" />
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <el-card >
                <template v-if="isShowMessage" #header>发布信息</template>
                <el-row>
                    <el-col v-if="isShowMessage" :span="12">
                        <el-form-item label="时间表达式" prop="cron">
                            <el-input
                                v-model="siteForm.cron"
                                :disabled="isReadOnly"
                                placeholder="时间表达式"
                                maxlength="100"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col v-if="!isReadOnly">
                        <el-form-item>
                            <el-button type="primary" @click="save">保存</el-button>
                            <el-button @click="close">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
        </el-form>
    </Modal>
</template>
<style lang="scss">
.site-edit-modal {
    .el-dialog__body {
        padding: 0;
        .el-card {
            box-shadow: inherit;
            border-radius: 0;
            border: 0;
        }
    }
}
.site-logo-uploader {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    color: #d9d9d9;
    &.show-only-logo {
        border: none;
        cursor: inherit;
    }
    &:hover {
        border-color: #409eff;
        color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .site-logo {
        width: 178px;
        height: 178px;
        display: block;
        background-color: rgba(0, 0, 0, 0.1);
    }
}
</style>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { deepCopy } from '@/utils/BaseUtil'
import { matchName, matchCode, matchImage } from '@/utils/RegExpUtil'
import { showLoading, showError, showMessage } from '@/utils'
export default {
    name: 'SiteEdit',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        optType: {
            type: Number,
            default: 3
        },
        info: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        const siteForm = {
            id: null,
            name: '',
            showName: '',
            type: 1,
            keywords: '',
            pid: '',
            path: '',
            logo: '',
            logoId: '',
            descript: '',
            copyright: '',
            cron: ''

        }
        const siteFormRules = {
            name: [
                { required: true, message: '站点名称不能为空' },
                {
                    validator: function (rule, value, callback) {
                        if (!matchName(value)) {
                            callback('站点名称只能是中文、数字、字母、下划线、横线、空格；两边不能有空格和横线')
                        } else {
                            callback()
                        }
                    }
                }
            ],
            showName: [
                {
                    validator: function (rule, value, callback) {
                        if (value && !matchName(value)) {
                            callback('站点显示名称只能是中文、数字、字母、下划线、横线、空格；两边不能有空格和横线')
                        } else {
                            callback()
                        }
                    }
                }
            ],
            path: [
                {
                    validator: function (rule, value, callback) {
                        if (value && !matchCode(value)) {
                            callback('站点根只能输入数字、字母、下划线')
                        } else {
                            callback()
                        }
                    }
                }
            ],
            type: [
                { required: true, message: '请选择站点类型' },
            ],
        }
        return {
            defaultSiteForm: { ...siteForm },
            siteModalVisible: true,
            uploadLoading: false,
            siteForm,
            siteFormRules,
            needReload: false
        }
    },
    computed: {
        ...mapState('cms/site', ['sites']),
        ...mapGetters('authen', ['getDictionary']),
        ...mapGetters('authen', ['getAttachModule']),
        siteType() {
            return this.getDictionary('siteType')
        },
        title() {
            const optType = this.$props.optType
            return (optType === 1 ? '新增' : (optType === 2 ? '编辑' : '查看')) + '站点'
        },
        isReadOnly() {
            return this.$props.optType !== 1 && this.$props.optType !== 2
        },
        isShowMessage(){
            return this.$props.optType !== 1 && this.$props.optType !== 2
        },
        siteOptions() {
            let sites = deepCopy(this.sites || [])
            const id = this.siteForm.id
            const filter = (_sites = []) => {
                return _sites.filter(site => {
                    if (site.id === id) {
                        return false
                    }
                    if (site.children && site.children.length) {
                        site.children = filter(site.children)
                    }
                    return true
                })
            }
            const simpleSite = (_sites) => {
                return _sites.map(site => {
                    const _site = { value: site.id, label: site.name }
                    if (site.children && site.children.length) {
                        _site.children = simpleSite(site.children)
                    }
                    return _site
                })
            }
            if (id) {
                // 排除掉自己和自己的子级
                sites = filter(sites)
            }

            return simpleSite(sites)

        }
    },
    watch: {
        visible(visible) {
            this.siteModalVisible = visible
            this.needReload = false
        },
        info(info) {
            const siteForm = { ...this.defaultSiteForm, ...this.$props.info }
            // siteForm.pids = siteForm.pid ? [siteForm.pid] : []
            this.siteForm = siteForm
        }
    },
    created() {
        this.siteModalVisible = this.$props.visible
        const siteForm = { ...this.defaultSiteForm, ...this.$props.info }
        // siteForm.pids = siteForm.pid ? [siteForm.pid] : []
        this.siteForm = siteForm
    },
    methods: {
        ...mapActions('cms/site', ['saveSite', 'uploadLogo']),
        _uploadLogo({ file, onError, onSuccess }) {
            const { type, limit = 0 } = this.getAttachModule('imageAppLogo')
            // https://jsonplaceholder.typicode.com/posts/
            this.uploadLoading = true
            if (!matchImage(file.type)) {
                showError('只允许上传图片')
                this.uploadLoading = false
                onError(new Error('只允许上传图片'), file, [file])
                return
            }
            const isLimit1M = file.size / 1024 / 1024 < limit
            if (!isLimit1M) {
                showError(`LOGO图片大小不能超过 ${limit} MB`)
                this.uploadLoading = false
                onError(new Error(`LOGO图片大小不能超过 ${limit} MB`), file, [file])
                return
            }
            this.uploadLogo({ file, type }).then(response => {
                this.uploadLoading = false
                const { id, path } = response.data.data
                this.siteForm.logo = path
                this.siteForm.logoId = id || '';
                onSuccess(response, file, [file])
            }).catch(error => {
                this.siteForm.logo = ''
                onError(error, file, [file])
                this.uploadLoading = false
                showError(error.message)
            })
        },
        close() {
            this.$refs.siteForm.resetFields()
            this.siteModalVisible = false
        },
        closeModal() {
            this.$emit('closeEditModal', this.needReload)
        },
        save() {
            // debugger
            this.$refs.siteForm.validate(valid => {
                if (!valid) {
                    return false
                }
                const site = this.siteForm
                showLoading(true, '正在保存')
                this.saveSite(site).then(() => {
                    showLoading(false)
                    showMessage('保存成功')
                    this.needReload = true
                    this.close()
                }).catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
            })
        }
    }
}
</script>

