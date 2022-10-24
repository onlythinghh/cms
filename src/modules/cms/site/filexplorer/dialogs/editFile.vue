<template>
    <Modal
        class="el-custome-dialog no-padding"
        :visible="editModal.visible"
        width="70%"
        :title="'编辑 '+file.filename"
        @close="closeModal"
    >
        <el-row>
            <el-col :span="8">
                <dl>
                    <dt>文件名:</dt>
                    <dd>{{file.filename}}</dd>
                </dl>
            </el-col>
            <el-col :span="8">
                <dl>
                    <dt>文件大小:</dt>
                    <dd>{{ file.size | fileFormatUnit }}</dd>
                </dl>
            </el-col>
            <el-col :span="8">
                <dl>
                    <dt>最后修改时间:</dt>
                    <dd>{{ file.lastModified | dateFormat }}</dd>
                </dl>
            </el-col>
            <el-col :span="24">
                <el-form
                    ref="fileForm"
                    label-width="100px"
                    :model="fileForm"
                    :rules="fileFormRules"
                >
                    <el-form-item label="内容:" prop="content">
                        <el-col :span="22">
                            <el-input v-model="fileForm.content" type="textarea" rows="15"/>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="save">保存</el-button>
                        <el-button @click="closeModal">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </Modal>
</template>


<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { showLoading, showError } from '@/utils'
export default {
    name: 'FilexplorerEditModal',
    props:{
        updatetype: {
            type: String,
            default: 'image'
        }
    },
    data() {
        return {
            fileForm: {
                content: ''
            },
            fileFormRules: {
                content: [
                    { required: true, message: '文件内容不能为空' }
                ]
            }
        }
    },
    computed: {
        ...mapState('cms/site/filexplorer', ['file', 'editModal', 'appid'])
    },
    watch: {
        file(newFile) {
            this.fileForm.content = newFile.content
        },
    },
    created() {
        const file = this.file
        this.fileForm.content = file.content
    },
    methods: {
        ...mapMutations('cms/site/filexplorer', ['setEditModalVisible']),
        ...mapActions('cms/site/filexplorer', ['writeFile']),
        closeModal() {
            this.setEditModalVisible({ visible: false })
        },
        save() {
            // 保存
            this.$refs.fileForm.validate(valid => {
                if (!valid) {
                    return false
                }
                const file = { ...this.file, ...this.fileForm }
                const appid = this.appid                
                const type = this.updatetype
                if (!appid) {
                    showError('站点信息获取失败,请重试')
                    return false
                }
                showLoading(true, '正在保存文件')
                this.writeFile({ appid, file, content: file.content, type}).then(() => {
                    showLoading(false)
                    this.closeModal()
                }).catch(error => {
                    showLoading(false)
                    showError(error.message)
                })

            })
        },
    }
}
</script>

