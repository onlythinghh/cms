<template>
    <div class="update">
        <div class="container">
            <div class="content">
                <p class="title">{{title}}投票</p>
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
                                            <el-form-item prop="startTime">
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
                        <el-form-item label="说明" prop="explain">
                            <el-input
                                v-model="form.explain"
                                type="textarea"
                                rows="8"
                                maxlength="500"
                                show-word-limit
                                placeholder="请输入说明"
                                :disabled="status ? true : false"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="每人几票">
                            <el-input
                                v-model="form.ticket"
                                style="width: 200px;"
                                :disabled="status ? true : false"
                                @input="input"
                            ></el-input>
                            <span style="margin-left: 20px;color: red;">票数最少为1票,最大票数为选项数量</span>
                        </el-form-item>
                        <el-form-item label="重复投票">
                            <el-checkbox v-model="form.repeat" :disabled="status ? true : false"></el-checkbox>
                        </el-form-item>
                        <el-form-item label="每日重置票数">
                            <el-checkbox v-model="form.remake" :disabled="status ? true : false"></el-checkbox>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="add">
                    <el-button v-if="!status" style="color: #fff;background: #0078D4;" @click="_add">添加选项</el-button>
                </div>
                <div class="btn">
                    <el-button @click="goBack">取消</el-button>
                    <el-button v-if="title!=='查看'" style="color: #fff;background: #0078D4;" @click="save">保存</el-button>
                </div>
                <el-dialog v-if="addStatus" title="新增投票" :visible.sync="addStatus" width="60%">
                    <el-form ref="addForm" :model="addForm" :rules="formRules" label-width="80px">
                        <el-form-item
                            class="titleBefore"
                            label="选项"
                            prop="problem"
                        >
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
                        <el-form-item>
                            <div style="width: 100%;">
                                <el-button v-if="!status" @click="_cancel">取消</el-button>
                                <el-button v-if="!status" style="background: #0078D4; color: #fff;" @click="sureAdd">确定</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-dialog>
                <div class="answerBox">
                    <div v-for="(item, index) in updateTable" :key="index" class="answer">
                        <div class="tk">
                            <div class="left">
                                <span style="margin-right: 20px;">{{(index + 1) + '.'}}</span>
                                <!-- eslint-disable-next-line -->
                                <div v-html="item.problem"></div>
                            </div>
                            <div class="rightBtn">
                                <div class="process">
                                    <el-progress :percentage="rate(item.count)"></el-progress>
                                </div>
                                <span>{{item.count ? item.count : 0}}票</span>
                                <el-button v-if="!status" type="text" @click="upload(item,index)">修改</el-button>
                                <el-button v-if="!status" type="text" style="marginLeft: 24px;" @click.native.prevent="_del(index)">删除</el-button>
                            </div>
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
                explain: '',
                startTime: '',
                deadline: '',
                ticket: '',
                repeat: false,
                remake: false,
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
                explain: [
                    { required: true, message: '请输入内容', trigger: 'blur' },
                ],
                startTime: [
                    { required: true, message: '请选择开始日期', trigger: 'blur' },
                ],
                deadline: [
                    { required: true, message: '请选择截止日期', trigger: 'blur' },
                ],
                img: [
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
            imageUrl1: ''
        }
    },
    computed: {
        ...mapState('cms/article/articleList', ['appid'])
    },
    created() {
        this.id = this.$route.query.id
        if(this.id) {
            this.init()
            this.title = '修改'
        }
        if(this.$route.query.type){
            this.type = '查看'
            this.status = true
            this.title = '查看'
        }
    },
    methods: {
        ...mapActions('cms', ['imageUpload']),
        ...mapActions('cms/settings/poll',['voteSave','voteDetail']),
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
            //
            // const file = uploadData.file
            // const {data} = await this.uploadFile({
            //     file: file,
            // })
            // hideLoading()
            // if (data.success) {
            //     this.form.img = data.data.url
            // } else {
            //     this.$message({
            //         type: "error",
            //         message: "上传失败",
            //     })
            // }
        },
        input(v) {
            this.form.ticket = v.replace(/\D/g,'')
            const length = this.updateTable.length
            if(this.form.ticket > length) {
                this.form.ticket = length
            }
            if(this.form.ticket == 0) {
                this.form.ticket = 1
            }
            return this.form.ticket
        },
        // 计算比例
        rate(data) {
            var sum = 0
            var item = data ? data : 0
            this.updateTable.forEach( item => {
                sum += (item.count ? item.count : 0)
            })
            if(sum == 0) {
                return 0
            }
            return Number((item/sum*100).toFixed(2))
        },
        // 单独获取某个editor内容
        getEditorData() {
            return this.$refs.ckeditor.getData()
        },
        // 获取文章正文的图片id
        _getContent(data) {
            this.contentIds = [...new Set([...this.contentIds, data.id])]
        },
        // 初始化
        async init() {
            showLoading('加载中')
            const { data } = await this.voteDetail({id: this.id})
            data.itemVos && data.itemVos.forEach( item => {
                this.updateTable.push({
                    problem: item.problem,
                    id: item.id,
                    count: item.count
                })
            })
            this.form.explain = data.explain
            this.form.title = data.title
            this.form.deadline = data.deadline
            this.form.startTime = data.startTime
            this.form.ticket = data.ticket
            this.form.repeat = data.repeat
            this.form.remake = data.remake
            this.imageUrl1 = data.img
            this.form.img = data.img
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
                if(!this.imageUrl1) {
                    this.$message({
                        type: 'error',
                        message: "图片必须上传"
                    })
                    return false
                }
                if(this.updateTable.length < 2) {
                    this.$message({
                        type: 'error',
                        message: "至少添加两个选项"
                    })
                    return false
                }
                this.updateTable.forEach( item => {
                    this.problemVos.push({
                        problem: item.problem,
                        id: item.id ? item.id : '',
                    })
                })
                showLoading('保存中')
                await this.voteSave({
                    ...this.form,
                    problemVos: this.problemVos,
                    id: this.id,
                })
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
                border-bottom: 1px solid #e5e5e5;
                .left {
                    display: flex;
                    align-items: center;
                    p {
                        max-width: 400px;
                        word-wrap:break-word;
                        overflow: hidden;
                    }
                }
                .rightBtn {
                    width: 500px !important;
                    display: flex;
                    font-size: 14px;
                    align-items: center;
                    span {
                        margin-right: 20px;
                        width: 50px;
                    }
                    .process {
                        width: 410px;
                    }
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

.flip-diagonal-2-br{
    -webkit-animation:flip-diagonal-2-br .4s cubic-bezier(.455,.03,.515,.955) both;
    animation:flip-diagonal-2-br .4s cubic-bezier(.455,.03,.515,.955) both
}
/deep/ .el-textarea__inner{
    resize: none;
}
</style>
