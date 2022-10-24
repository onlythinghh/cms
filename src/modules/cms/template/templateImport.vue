<template>
    <el-row>
        <el-col >
            <el-form ref="templateForm" :rules="templateFormRules" :model="templateForm" label-width="100px">
                <el-form-item>
                    <div class="body-header">导入模板</div>
                </el-form-item>
                <el-form-item>
                    <el-radio-group v-model="radio" >
                        <el-radio label="one" @change="one">单个模板</el-radio>
                        <el-radio label="multiple" @change="multiple">多个模板</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-col v-if="more" :span="18">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="templateForm.name" placeholder="模板名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col v-if="more" :span="18">
                    <el-form-item label="类型" prop="type">
                        <el-select v-model="templateForm.type" class="w100" placeholder="模板类型">
                            <el-option v-for="(text, key) in templateType" :key="key" :label="text"
                                       :value="Number(key)"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col v-if="more" :span="18">
                    <el-form-item label="描述" prop="desc">
                        <el-input v-model="templateForm.desc" type="textarea" placeholder="描述"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="18">
                    <el-form-item prop="file">

                        <el-upload
                            ref="upload"
                            action
                            :multiple="false"
                            :show-file-list="true"
                            :file-list="templateFiles"
                            :on-change="fileChange"
                            :auto-upload="false"
                            accept=".zip"
                        >
                            <el-button type="primary">选择模板</el-button>
                            <template v-slot:tip>
                                <div class="el-upload__tip">只能选择zip文件
                                    <el-tooltip placement="top">
                                        <div slot="content">
                                            模板文件仅支持zip文件。<br/>
                                            导出的模板仅支持多个模板导入。<br/>
                                            <br/>
                                            单个模板：<br/>
                                            zip文件中只有一个index.html文件即可。<br/>
                                            <br/>
                                            多个模板:<br/>
                                            类型作为第一层目录，名称作为第二次目录，文件名是最后保存的文件名。<br/>
                                            如：概览/产品中心/prod.html。
                                        </div>
                                        <i class="el-icon-warning"></i>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-upload>
                    </el-form-item>
                </el-col>
                <el-col >
                    <el-form-item>
                        <el-button type="success" @click="submitUpload">保存</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-col>
    </el-row>
</template>
<script>
import { showLoading, showError, showMessage } from '../../../utils'
import {  mapGetters,mapActions } from 'vuex'
export default {
    data() {
        const templateForm = {
            name: '',
            type: '',
            desc: '',
            file: null,
            mode: 1
        }
        const templateFormRules={
            name: [
                { required: true, message: '请选择模板名称' },
            ],
            type: [
                { required: true, message: '请选择站点类型' },
            ],
            file:[
                { required: true, message: '请上传模板' },
                {
                    validator: (rule, value, callback)=>{
                        const { file = null } =this.templateForm
                        if(!file || file.size === 0){
                            callback('请上传模板')
                        }else{
                            const {limit = 0 } = this.getAttachModule('fileTemplate')
                            const isLimit = file.size / 1024 / 1024 < limit
                            if (!isLimit) {
                                callback(`文件大小不能超过 ${limit} MB`)
                            }else{
                                callback()
                            }
                        }
                    }
                }
            ]
        }
        return {
            templateFiles:[],
            templateForm,
            templateFormRules,
            more: true,
            radio: 'one',
            content:''
        }
    },
    computed: {
        ...mapGetters('authen', ['getDictionary','getAttachModule']),
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
        }
    },
    created() {
        this.content = `模板文件仅支持zip文件。
        单模板：
            zip文件中只有一个index.html文件即可。
        多模板:
            类型作为第一层目录，名称作为第二次目录，文件名是最后保存的文件名。
            如：概览/产品中心/prod.html
        导出模板：导出的模板仅支持多模板导入。
        `
        // this.content = `<div>模板文件仅支持zip文件。</div>
        // <div>单模板：</div>
        //     <div>zip文件中只有一个index.html文件即可。</div>
        // <div>多模板:</div>
        //     <div>类型作为第一层目录，名称作为第二次目录，文件名是最后保存的文件名。</div>
        //     <div>如：概览/产品中心/prod.html</div>`

    },
    methods: {
        ...mapActions('cms/template', [
            'importTemplate',
        ]),
        submitUpload(){
            this.$refs.templateForm.validate(valid=>{
                if(!valid){
                    return false
                }
                showLoading(true, `正在导入模板`)
                const uploadData = this.templateForm
                this.importTemplate(uploadData)
                    .then(() => {
                        showMessage('导入模板成功')
                        this.$router.push({ name: 'templateList'})
                        showLoading(false)
                    })
                    .catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
            })
        },
        fileChange(file, fileList){
            this.templateFiles = fileList.slice(-1);
            // this.templateFiles = [file]
            this.templateForm.file = file.raw
        },
        // 超出限制后文件的钩子
        // handleExceed(files, fileList) {
        //    this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        // },
        cancel(){
            this.$router.push({ name: 'templateList'})
        },
        one(){
            this.templateForm.mode = 1;
            this.more = true
        },
        multiple(){
            this.templateForm.mode = 2;
            this.more = false
        },

    },
}
</script>
<style lang="scss" scoped>
    /deep/.el-tooltip__popper{
       width:20% !important;
    }
</style>

