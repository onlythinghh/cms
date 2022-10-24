<template>
    <Modal :visible="modalVisible" :title="title" @close="closeModel">
        <el-row>
            <el-form
                ref="SensitiveWordForm"
                :model="editForm"
                :rules="editFormRules"
                label-width="100px"
            >
                <el-form-item label="敏感词名称" prop="word">
                    <el-col :span="18">
                        <el-input v-model="editForm.word" placeholder="敏感词名称" />
                    </el-col>
                </el-form-item>
                <el-form-item label="敏感词分类" prop="category">
                    <el-col :span="18">
                        <el-select v-model="editForm.category" class="w100" placeholder="选择分类">
                            <el-option v-for="(category, index) in childrencateory" :key="index" :label="category.name"
                                       :value="category.id"
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
                <el-form-item label="替换词" prop="swap">
                    <el-col :span="18">
                        <el-input v-model="editForm.swap" placeholder="替换词" />
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="_save">保存</el-button>
                    <el-button @click="_cancel">取消</el-button>
                </el-form-item>
            </el-form>
        </el-row>
    </Modal>
</template>
<script>
import { showLoading, showError} from '../../../../utils'
// ,confirm,showMessage
import {  mapActions,mapGetters} from 'vuex'
import { matchName} from '@/utils/RegExpUtil'
// , matchRemoteUrl
import {} from '../../../../utils';
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        info: {
            type: Object,
            default: ()=>{}
        },
        hotWordCategoriesChild:{
            type: Array,
            default: ()=>{}
        }
    },
    data() {
        const editFormRules = {
            word: [
                { required: true, message: '敏感词名称不能为空' },
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
            category: [
                { required: true, message: '类型不能为空' },
            ],
            swap: [
                { required: true, message: '替换词名称不能为空' },
            ]
        }
        const editForm={
            appid: '',
            id: null,
            category: '',
            word:'',
            swap:''

        }
        return {
            childrencateory:[],
            editForm,
            editFormRules,
            modalVisible:false,
        }
    },
    computed: {
        ...mapGetters('cms/site', {
            'sites': 'normalizeSites'
        }),
        title() {
            return (this.editForm.id ? '修改' : '新增') + '敏感词'
        }
    },
    watch: {
        visible(nextVisible) {
            this.modalVisible = nextVisible
        },
        info(nextInfo ){
            Object.keys(this.editForm).map(item => {
                this.editForm[item] = nextInfo[item]
            })
        },
        hotWordCategoriesChild(nextHotWordCategoriesChild){
            this.childrencateory={...nextHotWordCategoriesChild}
        }
    },
    created() {

    },
    methods: {
        ...mapActions('cms/settings/sensitive', [
            'getSensitiveWordList',
            'saveSensitiveWord'
        ]),
        ...mapActions('cms/settings/category', ['getCategoriesByType']),
        _cancel(){
            this.$emit('close', this.needReload)
        },
        closeModel(){
            this.$refs.SensitiveWordForm.resetFields()
            this.$emit('close')
        },

        _save(){
            this.$refs.SensitiveWordForm.validate(valid => {
                if (!valid) {
                    return false
                }
                const editForm = this.editForm
                showLoading(true, '正在保存敏感词...')
                this.saveSensitiveWord(editForm).then(() => {
                    showLoading(false)
                    this.needReload = true
                    this._cancel()
                }).catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
            })
        }

    },


}
</script>
