<template>
    <Modal :visible="modalVisible" :title="title" @close="_close">
        <el-row>
            <el-form
                ref="categoryForm"
                :model="editForm"
                :rules="editFormRules"
                label-width="100px"
            >
                <el-form-item label="分类名称" prop="name">
                    <el-col :span="18">
                        <el-input v-model="editForm.name" placeholder="分类名称" maxlength="50"/>
                    </el-col>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-col :span="18">
                        <el-select v-model="editForm.type" class="w100" placeholder="选择类型">
                            <el-option
                                v-for="(type, key) in wordCategory"
                                :key="key"
                                :value="Number(key)"
                                :label="type"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="选择站点" prop="appid">
                    <el-col :span="18">
                        <el-select
                            v-model="editForm.appid"
                            class="w100"
                            placeholder="选择站点"
                            clearable
                        >
                            <el-option
                                v-for="(site, index) in sites"
                                :key="index"
                                :value="Number(site.id)"
                                :label="site.name"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-col :span="18">
                        <el-input v-model="editForm.sort" placeholder="排序" maxlength="3"/>
                    </el-col>
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-col :span="18">
                        <el-input
                            v-model="editForm.desc"
                            type="textarea"
                            placeholder="描述"
                            maxlength="200"
                            :rows="3"
                        />
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="_save">保存</el-button>
                    <el-button @click="cancel">取消</el-button>
                </el-form-item>
            </el-form>
        </el-row>
    </Modal>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { matchName } from '@/utils/RegExpUtil'
import { showLoading, showError ,showMessage} from '../../../../utils';
export default {
    name: 'EditCategoryModal',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        info: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        const editForm = {
            id: null,
            name: '',
            type: '',
            appid: '',
            sort: 0,
            desc: ''
        }
        const editFormRules = {
            name: [
                { required: true, message: '分类名称不能为空' },
                {
                    validator: function (rule, value, callback) {
                        if (!matchName(value)) {
                            callback('名称只能输入中文、数字、字母、下划线、横线、空格；两边不能有空格和横线')
                        } else {
                            callback()
                        }
                    }
                }
            ],
            type: [
                { required: true, message: '类型不能为空' },
            ],
            sort: [
                { required: true, message: '排序不能为空' },
                {
                    validator: function (rule, value, callback) {
                        if (!/^\d+$/.test(value)) {
                            callback('排序只能输入数字')
                        } else {
                            callback()
                        }
                    }
                }
            ]
        }
        return {
            modalVisible: false,
            editForm,
            editFormRules,
            needReload: false,
        }
    },
    computed: {
        ...mapGetters('authen', ['getDictionary']),
        ...mapGetters('cms/site', {
            'sites': 'normalizeSites'
        }),
        wordCategory() {
            return this.getDictionary('wordCategory')
        },
        title() {
            return (this.editForm.id ? '修改' : '新增') + '分类'
        }
    },
    watch: {
        visible(nextVisible) {
            this.needReload = false
            this.modalVisible = nextVisible
        },
        info({ appid, ...nextInfo }) {
            this.editForm = { ...{ type: 1, sort: 0, appid: appid ? appid : '' }, ...nextInfo }

        }
    },
    created() {
        const { appid, ...info } = this.$props.info || {}
        this.editForm = { ...{ type: 1, sort: 0, appid: appid ? appid : '' }, ...info }
        this.modalVisible = this.$props.visible
    },
    methods: {
        ...mapActions('cms/settings/category', ['saveCategory']),
        cancel() {
            this.$emit('close', this.needReload)
        },
        _save() {
            this.$refs.categoryForm.validate(valid => {
                if (!valid) {
                    return false
                }
                const editForm = {...this.editForm}
                showLoading(true, '正在保存分类...')
                this.saveCategory(editForm).then(res => {
                    if(res.success){
                        showMessage(res.errMsg)
                        this.needReload = true
                        this._close()
                    }else{
                        showError('保存失败')
                    }
                }).catch(error => {
                    showError(error.message)
                })
                showLoading(false)
            })
        },
        _close() {
            this.$refs.categoryForm.resetFields()
            this.$emit('close')
        }
    }
}
</script>

