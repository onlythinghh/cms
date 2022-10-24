<template>
    <el-form ref="templateForm" :model="templateForm" label-width="100px"
             :rules="templateFormRules"
    >
        <el-form-item>
            <div class="body-header">{{title}}</div>
        </el-form-item>
        <el-row>
            <el-col :span="6">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="templateForm.name" placeholder="模板名称" :disabled="disabled" maxlength="20" clearable></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="类型" prop="type">
                    <el-select v-model="templateForm.type" class="w100" placeholder="模板类型" :disabled="disabled" clearable>
                        <el-option v-for="(text, key) in templateType" :key="key" :label="text"
                                   :value="Number(key)"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="文件名" prop="fileName">
                    <el-input v-model="templateForm.fileName" placeholder="文件名" :disabled="disabled" maxlength="20" clearable>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item v-if="isShowPath" label="路径" prop="path" :disabled="disabled">
                    <el-input v-model="templateForm.path" readonly="readonly" placeholder="路径"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="正文内容" prop="content">
            <el-input
                v-model="templateForm.content"
                :readonly="disabled"
                placeholder="默认模板内容为空..."
                type="textarea"
                rows="20"
                clearable
            ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
            <el-input v-model="templateForm.desc" type="textarea" placeholder="描述" :disabled="disabled" ></el-input>
        </el-form-item>
        <el-form-item>
            <el-button :disabled="disabled" type="primary" @click="save" >保存</el-button>
            <el-button @click="calcel">取消</el-button>
        </el-form-item>

    </el-form>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { showLoading, showError, showMessage } from '../../../utils'
// import CKEditor from '@/components/CKEditor/'
import { matchName } from '../../../utils/RegExpUtil'
export default {
    props:{
        type:{
            type: String,
            required: true,
            default: 'add'
        },
        close:{
            type: Function,
            required: false,
            default:() => {}
        }
    },
    data() {
        const templateForm = {
            appid:'',
            id:null,
            name: '',
            type: '',
            desc: '',
            content: '',
            path:'',
            fileName:'',
        }
        const templateFormRules = {
            name: [
                { required: true, message: '模板名称不能为空' },
                {
                    validator: function (rule, value, callback) {
                        if (!matchName(value)) {
                            callback('模板名称只能是中文、数字、字母、下划线、横线、两边不能有横线')
                        } else {
                            callback()
                        }
                    }
                }
            ],
            type: [
                { required: true, message: '请选择模板类型' },
            ],
            content: [
                { required: true, message: '模板内容不能为空' },
            ],
            fileName: [
                { required: true, message: '文件名不能为空' },
                {
                    validator: function (rule, value, callback) {
                        if (!matchName(value)) {
                            callback('文件名不能输入特殊字符')
                        } else {
                            callback()
                        }
                    }
                }
            ],

        }
        return {
            activeName:0,
            templateForm,
            templateFormRules,
            isShow:false,
            title:'',
            isShowPath:false,
            disabled:false
        };
    },
    computed: {
        ...mapState('cms/template', ['editProps', 'templateTagsData']),
        ...mapGetters('authen', ['getDictionary']),
        ...mapGetters('authen', ['getDictionary']),
        ...mapGetters('cms/site', ['site']),
        templateType() {
            return this.getDictionary('templateType')
        },
    },
    watch: {
        site(v,o) {
            if(v.id !== o.id) {
                this.$router.go(-1)
            }
        },
        editProps(nextValue){
            if(nextValue.id){
                this.loadTemplateData()
            }
        }
    },
    created() {
        this.loadTemplateData()
    },
    methods: {
        ...mapActions('cms/template', [
            'saveTemplate',
            'getTemplatetags',
            'TemplateDetail'
        ]),

        // 标签页的渲染
        // loadTemplatetags() {
        //     showLoading(true, '正在加载模板标签')
        //     this.getTemplatetags()
        //         .then(() => {
        //             showLoading(false)
        //         })
        //         .catch(error => {
        //             showLoading(false)
        //             showError(error.message)
        //         })
        // },
        loadTemplateData(){
            if (this.$props.type === 'edit') {
                let detailId=this.editProps.id
                this.title ="修改模板"
                this.isShowPath=true
                this.TemplateDetail({id:detailId})
                    .then(({ detailData }) => {
                        Object.keys(this.templateForm).map(item=>{
                            this.templateForm[item]=detailData[item]
                        })
                        showLoading(false)
                    })
                    .catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })

            }else if(this.$props.type === 'add'){
                this.title  ="新增模板"
                this.isShowPath=false
                if (!sessionStorage.getItem('content')) {
                    this.TemplateDetail({id:null})
                        .then(({ detailData }) => {
                            sessionStorage.setItem('content',detailData.content)
                            Object.keys(this.templateForm).map(item=>{
                                this.templateForm[item]=detailData[item]
                            })
                            showLoading(false)
                        })
                        .catch(error => {
                            showLoading(false)
                            showError(error.message)
                        })
                }
            }else{
                this.title ="查看模板"
                this.isShowPath=true
                this.disabled=true
                this.TemplateDetail({id:this.editProps.id})
                    .then(({ detailData }) => {
                        Object.keys(this.templateForm).map(item=>{
                            this.templateForm[item]=detailData[item]
                        })
                        showLoading(false)
                    })
                    .catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
            }
        },
        save() {
            this.$refs.templateForm.validate(valid => {
                if (!valid) {
                    return false
                }
                const template = {...this.templateForm}
                delete template.path
                showLoading(true, '正在保存')
                // debugger
                this.saveTemplate(template)
                    .then(() => {
                        showLoading(false)
                        showMessage('保存成功')
                        // this.$router.push({ name: 'templateList' });
                        this.resetForm()
                        this.$emit('close', true)
                    })
                    .catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
            })
        },
        calcel(){
            // this.$router.push({ name: 'templateList' });
            this.resetForm()
            // templateForm
            this.$emit('close')
        },
        resetForm(){
            const templateForm = this.templateForm
            Object.keys(templateForm).forEach(key=>{
                templateForm[key] = ''
            })
            this.$refs.templateForm.resetFields()
            // this.templateForm = templateForm
        }
    }
}
</script>

<style lang="scss" scoped>
    .el-row.tag {
        height: 50px;
        border: 1px solid #ccc;
        border-top: none;
    }

    .first-tag {
        height: 150px;
        border: 1px solid #ccc;
    }
    ul{
        list-style: none;

    }
    .li{
        padding-left:20px;
    }
    .codeStyle{
        padding-left:20px;
    }
    .template-notify-message .el-notification__group{
        margin-left:0!important;
    }
    /deep/ .el-textarea__inner{
        resize:none;
    }
</style>
