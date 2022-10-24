<template>
    <Modal :visible="modalVisible" :title="'复制站点'" @close="closeModal">
        <el-row>
            <el-form ref="copySiteForm" :model="site" :rules="copySiteRules" label-width="100px">
                <el-form-item label="原站点名称">
                    <el-col :span="24">
                        <el-input v-model="site.name" type="textarea" readonly></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="新站点名称" style="margin-bottom:20px" prop="newName">
                    <el-col :span="24">
                        <el-input v-model="site.newName" placeholder="新站点名称" maxlength="50" show-word-limit/>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="copy">复制</el-button>
                    <el-button @click="_cancel">取消</el-button>
                </el-form-item>
            </el-form>
        </el-row>
    </Modal>
</template>
<script>
import { mapActions } from 'vuex'
import { matchName } from '../../../../utils/RegExpUtil'
import { showLoading, showError, showMessage } from '../../../../utils'
export default {
    name: 'SiteCopy',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        info: {
            type: Object,
            default: () => { }
        },
        closeCopyModal: {
            type: Function,
            default: () => { }
        }
    },
    data() {
        const copySiteRules = {
            newName: [
                { required: true, message: '站点名称不能为空' },
                {
                    validator: (rule, value, callback) => {
                        if (!matchName(value)) {
                            callback('站点名称只能是中文、数字、字母、下划线、横线；两边不能有空格和横线')
                        } else if(value === this.site.name){
                            callback('新站点名称不能和原站点名称相同')
                        } else {
                            callback()
                        }
                    }
                }
            ]
        }
        return {
            modalVisible: false,
            copySiteRules,
            site: {},
            needReload: false
        }
    },
    watch: {
        visible(visible) {
            this.modalVisible = !!visible
            this.needReload = false
        },
        info({ id, name }) {
            this.site = { id, name, newName: '' }
        }
    },
    methods: {
        ...mapActions('cms/site', ['copySite']),
        _cancel() {
            this.modalVisible = false
            this.site = { id: null, name: '', newName: '' }
            this.needReload = false
        },
        closeModal() {
            this.$refs.copySiteForm.resetFields()
            this.$emit('closeCopyModal', this.needReload)
            // this.closeCopyModal(this.needReload)
        },
        copy() {
            this.$refs.copySiteForm.validate(valid => {
                if (!valid) {
                    return false
                }
                const site = { id: this.site.id, name: this.site.newName }
                showLoading(true, '正在复制站点')
                this.copySite(site).then(() => {
                    showLoading(false)
                    showMessage('站点复制成功')
                    this.needReload = true
                    this.modalVisible = false
                    this.$router.go(0)
                }).catch(error => {
                    showLoading(false)
                    this.modalVisible = false
                    showError(error.message)
                    // this.$router.go(0)
                })
            })
        }
    }

}
</script>
<style lang="scss" scoped>
    /deep/ .el-form-item__error {
        position: absolute !important;
    }
    /deep/ .el-input__inner {
        padding-right: 50px !important
    }
</style>
