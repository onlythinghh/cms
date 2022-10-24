<template>
    <Modal :visible="modalVisible" :title="title" @close="closeModel">
        <el-row>
            <el-form
                ref="HotWordForm"
                :model="editForm"
                :rules="editFormRules"
                label-width="100px"
            >
                <el-form-item label="热词名称" prop="word">
                    <el-col :span="18">
                        <el-input v-model="editForm.word" placeholder="热词名称" />
                    </el-col>
                </el-form-item>
                <el-form-item label="热词分类" prop="category">
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
                <el-form-item label="来源链接" prop="url">
                    <el-col :span="18">
                        <el-input v-model="editForm.url" placeholder="来源链接" maxlength="200" show-word-limit />
                    </el-col>
                </el-form-item>
                <el-form-item label="替换次数" prop="times" >
                    <el-col :span="18">
                        <el-radio v-model="editForm.times" :label="1">首次</el-radio>
                        <el-radio v-model="editForm.times" :label="0">全部</el-radio>
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
import { showLoading, showError, showMessage} from '../../../../utils'
// ,confirm,showMessage
import { mapGetters, mapActions} from 'vuex'
import { matchName,matchRemoteUrl} from '@/utils/RegExpUtil'
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
        isShowTimes:{
            type: Boolean,
            default: false
        },
        hotWordCategoriesChild:{
            type: Array,
            default: ()=>{}
        }
    },
    data() {
        const editFormRules = {
            word: [
                { required: true, message: '热词名称不能为空' },
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
            url: [
                { required: true, message: '热词url不能为空' },
                {
                    validator (rule, value, callback) {
                        !matchRemoteUrl(value) ? callback('连接输入不合法') : callback()
                    }
                }
            ]
        }
        return {
            childrencateory:[],
            editForm: {
                appid: '',
                id: null,
                category: '',
                word:'',
                url : '',
                times: 1
            },
            editFormRules,
            modalVisible:false,

        }
    },
    computed: {
        ...mapGetters('cms/site', {
            'sites': 'normalizeSites'
        }),

        title() {
            return (this.editForm.id ? '修改' : '新增') + '热词'
        }
    },
    watch: {
        visible(nextVisible) {
            this.modalVisible = nextVisible
        },
        info(nextInfo){

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
        ...mapActions('cms/settings/hotword', [
            'saveHotWord',
        ]),
        ...mapActions('cms/settings/category', ['getCategoriesByType']),
        _cancel(){
            this.$emit('close', this.needReload)
        },
        closeModel(){
            this.$refs.HotWordForm.resetFields()
            this.$emit('close')
        },
        _save(){
            this.$refs.HotWordForm.validate(valid => {
                if (!valid) {
                    return false
                }
                const editForm = {...this.editForm}
                showLoading(true, '正在保存热词...')
                this.saveHotWord(editForm).then(res => {
                    if(res.success){
                        showMessage('保存成功！')
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

    },


}
</script>
