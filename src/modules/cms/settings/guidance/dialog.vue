<template>
    <div class="dialog">
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="60%"
            :before-close="handleClose"
        >
            <div class="content">
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-row>
                        <!-- <el-col :span="12">
                            <el-form-item label="分类">
                                <el-select v-model="form.region" placeholder="请选择" style="width: 100%;" >
                                    <el-option label="区域一" value="shanghai"></el-option>
                                    <el-option label="区域二" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12">
                            <el-form-item label="事项" prop="type">
                                <el-select v-model="form.type" placeholder="请选择" :disabled="check" style="width: 100%;"
                                           clearable
>
                                    <el-option v-for="(item, index) in matter" :key="index" :label="item.label"
                                               :value="item.value"
></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="申请人" prop="applyMan">
                                <el-input v-model="form.applyMan" :readonly="check" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="申请日期" prop="applyDate">
                                <el-date-picker
                                    v-model="form.applyDate"
                                    type="date"
                                    :picker-options="options"
                                    placeholder="选择日期"
                                    style="width: 100%;"
                                    value-format="timestamp"
                                    :readonly="check"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="单据" required>
                        <el-col :span="6">
                            <el-popover
                                placement="right"
                                width="525"
                                trigger="click"
                            >
                                <img :src="imageUrl1" style="width: 500px;">
                                <el-upload
                                    slot="reference"
                                    class="avatar-uploader"
                                    action
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload"
                                    :on-change="_selectFile"
                                    :http-request="_uploadImage1"
                                    :disabled="check"
                                >
                                    <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-popover>
                        </el-col>
                        <el-col :span="6">
                            <el-popover
                                placement="right"
                                width="525"
                                trigger="click"
                            >
                                <img :src="imageUrl2" style="width: 500px;">
                                <el-upload
                                    slot="reference"
                                    class="avatar-uploader"
                                    action
                                    :show-file-list="false"
                                    :on-success="AvatarSuccess"
                                    :before-upload="beforeAvatarUpload"
                                    :on-change="_selectFile"
                                    :http-request="_uploadImage2"
                                    :disabled="check"
                                >
                                    <img v-if="imageUrl2" :src="imageUrl2" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-popover>
                        </el-col>
                    </el-form-item>
                    <el-row>
                        <!-- <el-col :span="12">
                            <el-form-item label="分类">
                                <el-select v-model="form.region" placeholder="请选择" style="width: 100%;" >
                                    <el-option label="区域一" value="shanghai"></el-option>
                                    <el-option label="区域二" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12">
                            <el-form-item label="审核人员" prop="reviewer">
                                <el-select v-model="form.reviewer" placeholder="请选择" :disabled="ifdistribute" style="width: 100%;"
                                           clearable
>
                                    <el-option v-for="(item, index) in userList" :key="index" :label="item.value"
                                               :value="item.key"
></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="showB">
                        <el-col :span="12">
                            <el-form-item label="水印" prop="watermark">
                                <el-select v-model="form.watermark" placeholder="请选择" style="width: 100%;" clearable>
                                    <el-option v-for="(item, index) in watermarkArr" :key="index" :label="item.name"
                                               :value="item.id"
></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="签名" prop="sign">
                                <el-select v-model="form.sign" placeholder="请选择" style="width: 100%;" clearable>
                                    <el-option v-for="(item, index) in signArr" :key="index" :label="item.name"
                                               :value="item.id"
></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- eslint-disable -->
                    <el-form-item v-if="type" label="处理后">
                        <el-popover
                            placement="right"
                            width="525"
                            trigger="click"
                            :disabled="form.billSign ? false : true"
                        >
                            <img :src="form.billSign ? form.billSign.url : ''" style="width: 500px;">
                            <img
                                class="echoImg"
                                slot="reference"
                                :src="form.billSign ? form.billSign.url : ''"
                                style="cursor: pointer;"
                            >
                        </el-popover>
                    </el-form-item>
                    <el-row v-if="type">
                        <el-col :span="12">
                            <el-form-item label="处理人">
                                <span>{{ form.handler }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="处理日期">
                                <span>{{ form.handleDate ? dateFormat(form.handleDate) : '' }}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item v-if="type" label="处理理由">
                        <span>{{ form.reason }}</span>
                    </el-form-item>
                    <el-form-item v-if="check && !type" label="处理理由">
                        <el-input
                            v-model="form.reason"
                            type="textarea"
                            :rows="6"
                            placeholder="请输入理由"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button v-if="!check" type="primary" @click="submit">保 存</el-button>
            <el-button v-if="check && !type" type="primary" @click="dialogForm = true">分 发</el-button>
            <el-button v-if="check && !type" type="primary" @click="pass">通 过</el-button>
            <el-button v-if="check && !type" type="primary" @click="reject">驳 回</el-button>
            <el-button @click="close">关 闭</el-button>
        </span>
        </el-dialog>
        <el-dialog title="修改审核人" :visible.sync="dialogForm">
            <el-form :model="form">
                <el-form-item label="审核人">
                    <el-select v-model="form.reviewer" placeholder="请选择" style="width: 80%;" clearable>
                        <el-option v-for="(item, index) in userList" :key="index" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogForm = false">取 消</el-button>
                <el-button type="primary" @click="submitDis">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {mapActions} from "vuex";
import {showLoading, hideLoading} from "@/utils";
import {showError} from '../../../../utils';

export default {
    name: 'Dia',
    props: {
        formEcho: {
            type: Object,
            default: () => {
            }
        },
        check: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: '申请信息'
        },
        showB: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            options: {
                disabledDate(date) {
                    return date.getTime() > Date.now()
                }
            },
            dialogVisible: true,
            form: {
                type: '',
                applyMan: '',
                applyDate: '',
                bill1: '',
                bill2: '',
                reason: '',
                watermark: '',
                sign: '',
                reviewer:''
            },
            imageUrl1: '',
            imageUrl2: '',
            file: '',
            echo: false,
            textarea: '',
            dialogForm:false,
            matter: [
                {
                    label: '车辆出入',
                    value: 11
                },
                {
                    label: '车辆恢复',
                    value: 12
                },
                {
                    label: '门禁',
                    value: 13
                },
                // {
                //     label: '就餐',
                //     value: 14
                // },
                // {
                //     label: '脸部识别',
                //     value: 15
                // }
            ],
            rules: {
                applyMan: [
                    {required: true, message: '请输入申请人', trigger: 'blur'},
                ],
                type: [
                    {required: true, message: '请选择事项', trigger: 'blur'}
                ],
                watermark: [
                    {required: true, message: '请选择', trigger: 'blur'}
                ],
                sign: [
                    {required: true, message: '请选择', trigger: 'blur'}
                ],
                reviewer: [
                    {required: true, message: '请选择', trigger: 'blur'}
                ],
                applyDate: [
                    {type: 'date', required: true, message: '请选择日期', trigger: 'blur'}
                ],
            },
            watermarkArr: [],
            signArr: [],
            userList:[],
            ifdistribute:false
        }
    },
    created() {
        if (JSON.stringify(this.formEcho) != '{}') {
            this.form = this.formEcho
            if (this.check) {
                this.echo = false
            } else {
                this.echo = true
            }
            if (this.form.bill1) {
                this.imageUrl1 = this.form.bill1.url
            }
            if (this.form.bill2) {
                this.imageUrl2 = this.form.bill2.url
            }
        }
        this.init()
        if(this.title !== '填写申请信息'){
            this.ifdistribute = true
        }
    },
    methods: {
        ...mapActions('cms/settings/guidance', ['uploadFile', 'save', 'audit', 'warterlist','getusr_list']),
        async init() {
            const data = await this.warterlist({
                type: 1
            })
            const data2 = await this.warterlist({
                type: 2
            })
            const data3 = await this.getusr_list({})
            this.watermarkArr = data.data
            this.signArr = data2.data
            this.userList =data3.data
        },
        handleClose(done) {
            this.$confirm('确认关闭？').then(_ => {
                this.$emit('closeDialog')
            }).catch(_ => {
            });
        },
        // 时间格式化
        dateFormat(date) {
            var time = new Date(date)
            var m = time.getMonth() + 1
            var d = time.getDate()
            return `${time.getFullYear()}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}`
        },
        // 审核
        async auditOne(oper) {
            showLoading('正在处理中...')
            const data = await this.audit({
                ...this.form,
                id: this.form.id,
                oper
            })
            if (data.success) {
                this.$message({
                    type: 'success',
                    message: '已处理'
                })
                this.$emit('closeDialog')
            } else {
                showError(data.errMsg)
            }
            hideLoading()
        },
        // 通过
        pass() {
            this.auditOne(1)
        },
        // 驳回
        reject() {
            this.auditOne(2)
        },
        // 保存
        submit() {
            this.$refs.form.validate(async (validate) => {
                if (!validate) {
                    return false
                }
                if (!this.form.bill1) {
                    this.$message({
                        type: 'error',
                        message: '在第一个位置请上传单据'
                    })
                    return false
                }
                showLoading('保存中...')
                const data = await this.save({
                    ...this.form,
                    bill1: this.form.bill1 ? this.form.bill1 : {},
                    bill2: this.form.bill2 ? this.form.bill2 : {}
                })
                hideLoading()
                if (data.success) {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    this.$emit('closeDialog')
                } else {
                    showError(data.errMsg)
                }
            })
        },
        async submitDis(){
            showLoading('保存中...')

            const data = await this.save({
                ...this.form,
                bill1: this.form.bill1 ? this.form.bill1 : {},
                bill2: this.form.bill2 ? this.form.bill2 : {}
            })
            hideLoading()
            if (data.success) {
                this.$message({
                    type: 'success',
                    message: '保存成功'
                })
                this.dialogVisible = false
                this.$emit('closeDialog')
            } else {
                showError(data.errMsg)
            }
        },
        // 关闭
        close() {
            this.$emit('closeDialog')
        },
        handleAvatarSuccess(res, file) {
            // this.imageUrl1 = URL.createObjectURL(file.raw);
            if(res.data.success){
                this.form.bill1 =res.data.data
                this.imageUrl1 = URL.createObjectURL(file.raw);
            }else{
                this.$message({
                    type: "error",
                    message: "上传失败",
                })
            }
            hideLoading()
        },
        AvatarSuccess(res, file) {
            // this.imageUrl2 = URL.createObjectURL(file.raw);
            if(res.data.success){
                this.form.bill2 =res.data.data
                this.imageUrl2 = URL.createObjectURL(file.raw);
            }else{
                this.$message({
                    type: "error",
                    message: "上传失败",
                })
            }
            hideLoading()
        },
        beforeAvatarUpload(file) {
            const type = file.type
            // if (type !== 'image/png') {
            //     this.$message.error('只能上传png格式的图片');
            // }
            const isLt2M = file.size / 1024 / 1024 < 20;
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isLt2M && type;
        },
        // 图片上传
        async _uploadImage1(uploadData) {
            showLoading("图片上传中")
            const file = uploadData.file
            return await this.uploadFile({
                file: file,
            })
            // hideLoading()
            // if (data.success) {
            //     this.form.bill1 = data.data
            // } else {
            //     this.$message({
            //         type: "error",
            //         message: "上传失败",
            //     })
            // }
        },
        async _uploadImage2(uploadData) {
            showLoading("图片上传中")
            const file = uploadData.file
            return await this.uploadFile({
                file: file,
            })
            // hideLoading()
            // if (data.success) {
            //     this.form.bill2 = data.data
            // } else {
            //     this.$message({
            //         type: "error",
            //         message: "上传失败",
            //     })
            // }
        },
        _selectFile(file) {
            this.file = file
        },
        distribute(){

        }
    }
}
</script>

<style lang="scss" scoped>
.dialog {
    width: 100%;

    .content {
        width: 100%;
    }

    .dialog-footer {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .echoImg {
        width: 178px;
        height: 178px;
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
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
}
</style>
