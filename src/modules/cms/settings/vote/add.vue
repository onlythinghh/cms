<template>
    <div class="update">
        <div class="container">
            <div class="content">
                <p class="title">{{title}}问卷</p>
                <div class="form">
                    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="标题" prop="title">
                                    <el-input
                                        v-model="form.title"
                                        :disabled="status ? true : false"
                                        placeholder="请输入标题"
                                        style="width: 400px;"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="日期选择" required>
                                    <el-row>
                                        <el-col :span="8">
                                            <el-form-item prop="startTime" >
                                                <el-date-picker
                                                v-model="form.startTime"
                                                type="datetime"
                                                value-format="timestamp"
                                                placeholder="选择开始时间"
                                                :disabled="status ? true : false"
                                                >
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="1">
                                            <span>-</span>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item prop="deadline">
                                                <el-date-picker
                                                v-model="form.deadline"
                                                value-format="timestamp"
                                                type="datetime"
                                                placeholder="选择截止时间"
                                                :picker-options="pickerOptions"
                                                :disabled="status ? true : false"
                                                >
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="图片" prop="img">
                            <el-upload
                            class="avatar-uploader"
                            action
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-change="_selectFile"
                            :http-request="_uploadImage1"
                            required
                            :disabled="status ? true : false"
                            >
                            <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="说明" prop="content">
                            <el-input
                                v-model="form.content"
                                type="textarea"
                                rows="8"
                                maxlength="500"
                                show-word-limit
                                placeholder="请输入说明"
                                :disabled="status ? true : false"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="add">
                    <el-button v-if="!status" style="color: #fff;background: #0078D4;" @click="_add">添加问题</el-button>
                </div>
                <div class="btn">
                    <el-button @click="goBack">取消</el-button>
                    <el-button v-if="!status" style="color: #fff;background: #0078D4;" @click="save">保存</el-button>
                </div>
                <el-dialog v-if="addStatus" title="新增问卷" :visible.sync="addStatus" width="60%">
                    <el-form ref="addForm" :model="addForm" :rules="formRules" label-width="80px">
                        <el-form-item
                            class="titleBefore"
                            label="标题"
                            prop="problem"
                        >
                            <!-- <el-input v-model="addForm.problem" maxlength="30" style="width: 100%;"></el-input> -->
                            <CK-editor
                                ref="ckeditor"
                                v-model="addForm.problem"
                                :need-bottom-tools="false"
                                :config="editorConfig"
                                :upload-image-config="editorImageConfig"
                                :easy="true"
                                @on-uploaded="_getContent"
                            >
                            </CK-editor>
                        </el-form-item>
                        <!-- <el-form-item label="日期选择" required>
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item prop="startTime">
                                        <el-date-picker
                                        v-model="addForm.startTime"
                                        type="datetime"
                                        value-format="timestamp"
                                        placeholder="选择开始时间"
                                        >
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1">
                                    <span>-</span>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item prop="deadLine">
                                        <el-date-picker
                                        v-model="addForm.deadLine"
                                        value-format="timestamp"
                                        type="datetime"
                                        placeholder="选择截止时间"
                                        >
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form-item> -->
                        <el-form-item
                            label="类型"
                            prop="type"
                            :rules="{
                                required: true, message: '类型不能为空', trigger: 'blur'
                            }"
                        >
                            <el-row>
                                <el-col :span="16">
                                    <el-select v-model="addForm.type" style="width:100%;" @change="typeChange">
                                        <el-option label="单选" value="1"></el-option>
                                        <el-option label="多选" value="2"></el-option>
                                        <el-option label="填空" value="3"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="8">
                                    <el-button
                                        style="background: #0078D4; color: #fff; margin-left:10px;"
                                        :disabled="addDisabled"
                                        @click="addList"
                                    >新增</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item
                            v-for="(domain, index) in addForm.items"
                            :key="index"
                            :label="'选项' + (index + 1)"
                            :prop="'items.' + index + '.item'"
                        >
                            <el-row>
                                <el-col :span="16">
                                    <!-- <el-input v-model="domain.item" style="width: 100%;"></el-input> -->
                                    <CK-editor
                                        :ref="'ckeditor' + (index + 1)"
                                        v-model="domain.item"
                                        :class="'ckeditor' + (index + 1)"
                                        :need-bottom-tools="false"
                                        :config="editorConfig"
                                        :upload-image-config="editorImageConfig"
                                        :easy="true"
                                        @on-uploaded="_getContent"
                                    >
                                    </CK-editor>
                                </el-col>
                                <el-col :span="8" >
                                    <el-button style="margin-left:10px;" @click.prevent="removeDomain(domain)">删除</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item>
                            <div style="width: 100%;">
                                <el-button @click="_cancel">取消</el-button>
                                <el-button style="background: #0078D4; color: #fff;" @click="sureAdd">确定</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-dialog>
                <div class="answerBox">
                    <div v-for="(item, index) in updateTable" :key="index" class="answer">
                        <div v-if="item.type == 3" class="tk">
                            <!-- eslint-disable-next-line -->
                            <div v-html="item.problem"></div>
                            <div v-if="!status" class="rightBtn">
                                <el-button type="text" @click="upload(item,index)">修改</el-button>
                                <el-button type="text" style="marginLeft: 24px;" @click.native.prevent="_del(index)">删除</el-button>
                            </div>
                        </div>
                        <div v-else class="title">
                            <!-- eslint-disable-next-line -->
                            <span v-html="item.problem"></span>
                            <div v-if="!status" class="rightBtn">
                                <el-button type="text" @click="upload(item,index)">修改</el-button>
                                <el-button type="text" style="marginLeft: 24px;" @click.native.prevent="_del(index)">删除</el-button>
                            </div>
                        </div>
                        <div v-if="item.type == 1" class="showAnswer">
                            <el-radio
                            v-for="(rad,ind) in item.items"
                            :key="ind"
                            v-model="item.answer"
                            disabled
                            :label="rad.item"
                            >
                            <!-- eslint-disable-next-line -->
                                <span style="display: inline-block;margin-right: 20px;" v-html="rad.item"></span>
                                <span>(得票数: {{rad.count ? rad.count : 0}})</span>
                            </el-radio>
                        </div>
                        <div v-if="item.type == 2" class="showAnswer">
                            <el-checkbox v-for="(radi,inde) in item.items" :key="inde" v-model="radi.isPick" disabled>
                            <!-- eslint-disable-next-line -->
                                <span style="display: inline-block;margin-right: 20px;" v-html="radi.item"></span>
                                <span>(得票数: {{radi.count ? radi.count : 0}})</span>
                            </el-checkbox>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions,mapState } from "vuex";
import { confirm } from "@/utils";
import { showLoading, hideLoading } from "@/utils";
import { matchEmoji } from '@/utils/RegExpUtil'
import { BASE64Helper } from '@/utils/CryptUtil'
import { showMessage } from '../../../../utils';

export default {
    data() {
        return {
            addDisabled: false,
            editorConfig: {
                removeButtons: ["Paste", "PasteText", "PasteFromWord", "Maximize"],
                height: "450px"
            },
            //上传图片
            editorImageConfig: {
                url: `${process.env.VUE_APP_REQUEST_BASE_API}/cms/attach/upload/file`,
                data: {
                    module: '13'
                }
            },
            form: {
                title: '',
                content: '',
                startTime: '',
                deadline: '',
                img: ''
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
            },
            rules: {
                title: [
                    { required: true, message: '请输入标题名称', trigger: 'blur' },
                ],
                content: [
                    { required: true, message: '请输入内容', trigger: 'blur' },
                ],
                startTime: [
                    { required: true, message: '请选择开始日期', trigger: 'blur' },
                ],
                deadline: [
                    { required: true, message: '请选择截止日期', trigger: 'blur' },
                ],
                img:[
                    { required: true},
                ]
            },
            formRules: {
                problem: [
                    {
                        validator: (rule, value, cb) => {
                            value = this.getEditorData()
                            if (value) {
                                this.addForm.problem = value
                                return matchEmoji(value) ? cb('不能输入非法字符') : cb()
                            } else {
                                return cb('请输入文章正文')
                            }
                        },
                        trigger: 'blur'
                    }
                ],
            },
            updateTable: [],
            isUpdate: true,
            update: true,
            orgId: 1,
            id: '',
            title: '新增',
            status: false,
            file:'',
            itemVos: [],
            addStatus: false,
            addForm: {
                problem: '',
                type: '1',
                items: [
                    {
                        item: ''
                    }
                ]
            },
            xg: false,
            problemVos: [],
            upIndex: '',
            imageUrl1: '',
            type:''
        }
    },
    computed: {
        ...mapState('cms/article/articleList', ['appid'])
    },
    created() {
        this.id = this.$route.query.id
        if(this.$route.query.type){
            this.type = '查看'
            this.status = true
        }
        if(this.id) {
            this.init()
            this.title = '修改'
        }
    },
    methods: {
        ...mapActions('cms/settings/vote',['voteSave','voteDetail']),
        ...mapActions('cms', ['imageUpload']),
        handleAvatarSuccess(res, file) {
            this.imageUrl1 = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const type = file.type
            var res = true
            if(type !== 'image/png' && type !== 'image/gif' && type !== 'image/jpg' && type !== 'image/jpeg') {
                this.$message.error('只能上传png、gif、jpg、jpeg格式的图片');
                res = false
            }
            const isLt2M = file.size / 1024 / 1024 < 20;
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
                res = false
            }
            return res
        },
        // 图片上传
        async _uploadImage1(uploadData) {
            showLoading("图片上传中")
            BASE64Helper.imgMd5(uploadData.file).then(async _file=>{
                let { data } = await this.imageUpload({
                    file: _file,
                    type: '12',
                    appid:this.appid
                })
                hideLoading()
                if (data.success) {
                    this.form.img = data.data.url
                } else {
                    this.$message({
                        type: "error",
                        message: "上传失败",
                    })
                }
            })
        },
        // 类型变化
        typeChange(v) {
            if(v == 3) {
                this.addDisabled = true
                this.addForm.items = []
            }else {
                this.addDisabled = false
            }
        },
        // 单独获取某个editor内容
        getEditorData() {
            return this.$refs.ckeditor.getData()
        },
        // 遍历获取
        getCk(index) {
            var name = 'ckeditor' + index
            return this.$refs[name].getData()
        },
        // 获取文章正文的图片id
        _getContent(data) {
            this.contentIds = [...new Set([...this.contentIds, data.id])]
        },
        // 初始化
        async init() {
            showLoading('加载中')
            const { data } = await this.voteDetail({id: this.id})
            data.problemVos && data.problemVos.forEach( item => {
                this.updateTable.push({
                    type: item.type + '',
                    problem: item.problem,
                    items: item.items,
                    id: item.id
                })
            })
            this.form.content = data.content
            this.form.title = data.title
            this.form.deadline = data.deadline
            this.form.startTime = data.startTime
            this.form.img = data.img
            this.imageUrl1 = data.img
            hideLoading()
        },
        goBack() {
            this.$router.go(-1)
        },
        // table设置背景色
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if(rowIndex == 0){
                return "background: rgba(0,0,0,0.02)";
            }
        },
        // 新增表单
        _add() {
            this.addStatus = true
        },
        // 删除表
        _del(index) {
            confirm('确认删除吗?','警告',{
                ok: () => {
                    this.updateTable.splice(index,1)
                }
            })
        },
        noBlur(scope) {
            scope.row.show = true
        },
        txBlur(scope) {
            scope.row.tx = true
        },
        //新增list
        addList() {
            this.addForm.items.push({
                item: ''
            })
        },
        //删除list
        removeDomain(item) {
            var index = this.addForm.items.indexOf(item)
            if (index !== -1) {
                this.addForm.items.splice(index, 1)
            }
        },
        // 时间格式化
        dateFormat(date) {
            var time = new Date(date)
            var m = time.getMonth()+1
            var d = time.getDate()
            return `${time.getFullYear()}.${m >9 ? m : '0' + m}.${d > 9 ? d : '0' + d}`
        },
        // 保存
        save() {
            this.$refs.form.validate( async validate => {
                if(!validate) {
                    return false
                }
                if(this.form.startTime>=this.form.deadline){
                    this.$message({
                        type: 'error',
                        message: "结束时间不能小于或等于开始时间"
                    })
                    return false
                }
                if(!this.imageUrl1) {
                    this.$message({
                        type: 'error',
                        message: "图片必须上传"
                    })
                    return false
                }
                if(this.updateTable.length < 1) {
                    this.$message({
                        type: 'error',
                        message: "至少添加一个问题"
                    })
                    return false
                }
                
                this.updateTable.forEach( item => {
                    item.type !== '3' && item.items.forEach( item => {
                        item.id = item.id ? item.id : ''
                    })
                    this.problemVos.push({
                        id: item.id ? item.id : '',
                        type: item.type,
                        problem: item.problem,
                        items: item.items,
                    })
                })
                showLoading('保存中')
                await this.voteSave({
                    ...this.form,
                    problemVos: this.problemVos,
                    id: this.id,
                    type:'1'
                })
                showMessage('修改成功')
                hideLoading()
                this.$router.go(-1)
            })
        },
        _selectFile(file) {
            this.file = file
        },
        upload(scope, index) {
            this.scope = scope
            this.addStatus = true
            this.addForm =JSON.parse(JSON.stringify(scope))
            this.xg = true
            //暂时接受数据
            this.upIndex = index
        },
        // 取消新增
        _cancel() {
            this.addDisabled = false
            this.addForm = {
                problem: '',
                type: '1',
                items: [
                    {
                        item: ''
                    }
                ]
            }
            this.addStatus = false
        },
        // 提交新增
        sureAdd() {
            this.$refs.addForm.validate( validate => {
                if(!validate){
                    return false
                }
                this.addDisabled = false
                const length = this.addForm.items ? this.addForm.items.length : 0
                if(length > 0) {
                    for(var i = 0; i < length; i++) {
                        this.addForm.items[i].item = this.$refs['ckeditor' + (i + 1)][0].getData()
                    }
                }
                if(this.xg) {
                    this.updateTable.splice(this.upIndex,1,this.addForm)
                }else {
                    this.updateTable.push(this.addForm)
                }
                this.addForm = {
                    problem: '',
                    type: '1',
                    items: [
                        {
                            item: ''
                        }
                    ]
                }
                this.addStatus = false
                this.xg = false
            })

        }
    },
}
</script>

<style lang="scss" scoped>
/deep/ .el-date-picker {
    width: 330px !important;
}
/deep/ .el-date-editor {
    width: 100%;
}
/deep/ .el-col-1 {
    display: flex;
    justify-content: center;
}
/deep/ .el-input__inner {
    border-radius: 0;
    width: 100%;
}
/deep/ .el-button {
    border-radius: 0;
}
/deep/ .cke_contents {
    height: 120px !important;
}
.titleBefore {
    /deep/ .el-form-item__label::before{
        content: '*';
        color: red;
    }
}
.btn-group {
    display: flex;
    align-items: center;
    justify-content: center;
}
.update {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header {
        width: 100%;
        height: 80px;
        padding: 0 24px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        background: #fff;
        .el-icon-back {
            cursor: pointer;
        }
        .title {
            font-size: 20px;
            font-weight: 500;
            margin: 0 12px;
        }
        .meta {
            font-size: 14px;
            color: rgba(0,0,0,0.45);
        }
    }
    .container {
        flex: 1;
        width: 100%;
        padding: 24px;
        box-sizing: border-box;
        .content {
            width: 100%;
            height: 100%;
            background: #fff;
            .title {
                width: 100%;
                height: 54px;
                line-height: 54px;
                padding: 0 24px;
                box-sizing: border-box;
                margin: 0;
                border-bottom: 1px solid #f0f0f0;
            }
            .form {
                width: 100%;
                padding: 24px;
                box-sizing: border-box;
            }
            .table {
                width: 100%;
                padding: 0 24px;
                box-sizing: border-box;
                /deep/ .el-table th.is-leaf {
                    text-align: center;
                }
                /deep/ .el-table__row td {
                    text-align: center;
                }
            }
            .add {
                width: 100%;
                height: 44px;
                padding: 0 24px;
                box-sizing: border-box;
            }
            .box-card {
                width: 100%;
                height: 312px !important;
                border-radius: 0;
                border-bottom: 16px solid #f4f4f4;
                border-top: 16px solid #f4f4f4;
                /deep/ .el-card__header {
                    padding: 0 24px;
                }
                /deep/ .el-card__body {
                    padding: 0;
                }
                .table {
                    padding: 0 24px;
                    box-sizing: border-box;
                }
                .clearfix {
                    height: 52px;
                    padding: 0 !important;
                    .noticeTitle {
                        display: inline-block;
                        height: 52px;
                        border-bottom: 2px solid #004578;
                        line-height: 54px;
                    }
                    }
                    .noticeList {
                        width: 100%;
                        height: 38px;
                        border-bottom: 1px solid rgba(0,0,0,0.06);
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0 24px;
                        box-sizing: border-box;
                        font-size: 14px;
                        cursor: pointer;
                    }
            }
            .btn {
                width: 100%;
                padding: 24px;
                box-sizing: border-box;
                /deep/ .el-button {
                    border-radius: 0;
                }
            }
        }
    }
    .answerBox {
        width: 100%;
        /deep/ .el-radio__label {
            display: inline-block;
        }
        .answer {
            width: 100%;
            .tk {
                width: 100%;
                height: auto;
                padding: 0 16px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .rightBtn {
                    width: 86px !important;
                    display: flex;
                    justify-content: space-between;
                }
            }
            .title {
                width: 100%;
                height: auto;
                padding: 0 16px;
                box-sizing: border-box;
                margin: 0;
                background: #f0f0f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .showAnswer {
                width: 100%;
                padding: 10px 24px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                /deep/ .el-radio {
                    margin-bottom: 10px;
                }
                /deep/ .el-checkbox{
                    margin-bottom: 10px;
                }
            }
        }
    }
    /deep/ .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        height: 180px;
    }
    /deep/ .avatar-uploader {
        width: 178px;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
        padding: 0;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
}
</style>
