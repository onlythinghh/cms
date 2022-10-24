<template>
    <Modal :visible="modalVisible" :title="title" append-to-body @close="_closeModal">
        <el-form ref="sourceForm" :model="source" :rules="sourceRules" label-width="100px">
            <el-row>
                <el-form-item label="名称" prop="name">
                    <el-col :span="18">
                        <el-input v-model="source.name" placeholder="名称" maxlength="50"/>
                    </el-col>
                </el-form-item>
                <el-form-item label="选择站点" prop="appid">
                    <el-col :span="18">
                        <el-select v-model="source.appid" class="w100" placeholder="选择站点" clearable>
                            <el-option
                                v-for="(site, index) in sites"
                                :key="index"
                                :label="site.name"
                                :value="site.id"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="地址" prop="url">
                    <el-col :span="18">
                        <el-input v-model="source.url" placeholder="地址" maxlength="250"/>
                    </el-col>
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-col :span="18">
                        <el-input
                            v-model="source.desc"
                            type="textarea"
                            rows="3"
                            placeholder="描述"
                            maxlength="250"
                        />
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="_save">保存</el-button>
                    <el-button @click="_cancel">取消</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </Modal>
</template>
<script>
import { matchName, matchRemoteUrl } from '../../../../../utils/RegExpUtil';
import { mapActions, mapGetters } from 'vuex';
import { showLoading, showError,showMessage} from '../../../../../utils';
export default {
    // name: 'ArticleSourceEditModal',s
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        info: {
            type: Object,
            default: () => { }
        },
        close: {
            type: Function,
            default: () => { }
        }
    },
    data() {
        const source = {
            id: null,
            name: '',
            url: '',
            desc: '',
            appid: ''
        }
        const sourceRules = {
            name: [
                { required: true, message: '名称不能为空' },
                {
                    validator: function (rule, value, callback) {
                        if (!matchName(value)) {
                            callback('名称只允许输入中文、数字、字母、下划线、横线、空格；两边不能有空格和横线')
                        } else {
                            callback()
                        }
                    }
                }
            ],
            url: [
                {
                    validator: function (rule, value, callback) {
                        if (value && !matchRemoteUrl(value)) {
                            callback('地址不合法,请重新输入')
                        } else {
                            callback()
                        }
                    }
                }
            ]
        }
        return {
            modalVisible: false,
            needReload: false,
            source,
            sourceRules
        }
    },
    computed: {
        ...mapGetters('cms/site', {
            'sites': 'normalizeSites'
        }),
        title() {
            return (this.source.id ? '编辑' : '新增') + '文章来源'
        }
    },
    watch: {
        visible(nextVisible) {
            this.modalVisible = nextVisible
            this.needReload = false
        },
        info(nextInfo) {

            this.source = { ...nextInfo }
        }
    },
    created() {
        this.modalVisible = this.$props.visible
        this.source = { ...this.$props.info }
    },
    methods: {
        ...mapActions('cms/settings/article/source', ['saveSource']),
        _closeModal() {
            this.source = this.info
            this.$refs.sourceForm.resetFields()
            this.$emit('close', this.needReload)
        },
        _cancel() {
            this.modalVisible = false
            this.source = this.info
        },
        _save() {
            this.$refs.sourceForm.validate(valid => {
                if (!valid) {
                    return false
                }
                const source = { id: null, name: '', url: '', desc: '', ...this.source }
                showLoading(true, '正在保存')
                this.saveSource(source).then(res => {
                     if(res.success){
                        showMessage(res.errMsg)
                        this.needReload = true
                        this._cancel()
                    }else{
                        showError('保存失败')
                    }
                }).catch(error => {
                    showError(error.message)
                })
                showLoading(false)
            })
        }
    }
}
</script>
