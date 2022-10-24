<template>
    <Modal :visible="modalVisible" :title="'新增图片'" @close="closeModel">
        <el-form ref="addimg" label-width="80px" :rules="imgnameRules" :model="formInfo">
            <el-form-item label="名称">
                <el-input
                    v-model="formInfo.name"
                    placeholder="请输入图片名称"
                    clearable
                    maxlength="10"
                    show-word-limit
                />
            </el-form-item>
            <el-form-item label="标签" prop="keyword">
                <el-input
                    v-model="formInfo.keyword"
                    placeholder="请输入图片属性，如:人物，自然风光"
                    clearable
                    maxlength="10"
                    show-word-limit
                />
            </el-form-item>
            <el-form-item>
                <div class="avatar_box">
                    <!-- :on-change="handleChange" -->
                    <el-upload
                        v-loading="uploadLoading"
                        class="avatar_uploader"
                        :show-file-list="false"
                        action="#"
                        :http-request="_uploadLogo"
                    >
                        <img v-if="baseImgUrl" :src="baseImgUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <p class="tips">建议大小不超过5M</p>
                </div>
                <!-- <div class="upload_btn">
                    <el-button @click="getImageSave">点击上传</el-button>
                </div> -->
            </el-form-item>
            <div class="dialog-footer">
                <el-button type="primary" @click="getImageSave">确 定</el-button>
                <el-button @click="closeModel">取 消</el-button>
            </div>
        </el-form>
    </Modal>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
// import { BASE64Helper } from '@/utils/CryptUtil'
import { showError } from '@/utils'
import {  matchImage } from '@/utils/RegExpUtil'
export default {
    props:{
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            modalVisible: false,
            formInfo:{
                name: '',
                keyword: '',
            },
            imgnameRules:{
                keyword: [{ required: true, message: "请输入标签", trigger: "blur" }],
            },
            baseImgUrl: '',
            fileSize: '0',
            imgInfo: {
                imgUrl: '',
                newImgName: '',
                oldImgName: ''
            },
            isImgUpload: false,
            tmpFile: null,
            uploadLoading: false
            
        }
    },
    computed:{
        ...mapGetters('authen', ['getAttachModule']),
        
        // ...mapActions('cms/site', ['uploadLogo']),
    },
    watch: {
        visible(nextVisible) {
            this.modalVisible = nextVisible
        },
    },
    methods:{
        ...mapActions('cms/settings/imgHouse', ['uploadImghouse','imageSave']),
        // handleChange(file, fileList){
            // console.log('修改文档流', file)
        // },
        _uploadLogo({ file, onError, onSuccess }){
            // console.log('file1111',file)
            this.tmpFile = file
            this.fileSize = Math.round(file.size/1024)
            this.baseImgUrl = URL.createObjectURL(file);
            const { type, limit = 5 } = this.getAttachModule('newMediaImageLimit')
            // const appid =  '' // this.siteForm.id
            // https://jsonplaceholder.typicode.com/posts/
            this.uploadLoading = true
            if (!matchImage(file.type)) {
                showError('只允许上传图片')
                this.uploadLoading = false
                return
            }
            const isLimit1M = file.size / 1024 / 1024 < limit
            if (!isLimit1M) {
                showError(`图片大小不能超过 ${limit} MB`)
                this.baseImgUrl = ''
                this.uploadLoading = false
                onError(new Error(`图片大小不能超过 ${limit} MB`), file, [file])
                return
            }
            
            let formData = new FormData();//通过formdata上传
            formData.append('file', file);
            this.uploadImghouse(formData).then(res => {
                this.uploadLoading = false
                console.log('上传图片res:', res)
                this.isImgUpload = res.success ? true : false
                if(res.success) {
                    this.imgInfo = res.data
                    // process.env.VUE_APP_PROXY_TARGET
                }
                
            }).catch(error => {
                this.uploadLoading = false
                this.isImgUpload = false
                this.baseImgUrl = ''
                showError(error.message)
            })
        },
        getImageSave(){
            
            this.$refs.addimg.validate(valid => {
                if (!valid) {
                    return false;
                }
                if(!this.isImgUpload){
                    return this.$message.warning("请上传图片");
                }
                let { imgUrl, newImgName, oldImgName } = this.imgInfo
                let param = {
                    size: this.fileSize,
                    pathPart: imgUrl,
                    newFilename: newImgName,
                    oldFilename: oldImgName,
                    ...this.formInfo
                }
                console.log('保存图片param:', param)
                this.imageSave(param).then(res => {
                    console.log('保存图篇：', res)
                    if(res.success) {
                        this.$message.success(res.data)
                        this.$emit('loadImgList')
                        this.closeModel()
                    } else {
                        this.$message.error(res.data||'服务器繁忙，请稍后再试！')
                    }
                })
            })
            
        },
        // 关闭弹框
        closeModel(){
            this.$refs.addimg.resetFields()
            this.$emit('close')
            Object.assign(this.$data, this.$options.data());
        },
    }
}
</script>
<style lang="scss" scoped>
.avatar_box{
    display: flex;
    .avatar_uploader {
        width: 180px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        .el-upload {
            width: 180px;
            height: 180px;
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
            width: 180px;
            height: 180px;
            display: block;
        }
    }
    .tips{
        color: red;
        font-weight: bold;
        margin-left: 10px;
        
    }
}
.upload_btn{
    width: 180px;
    margin-top: 10px;
    text-align: center;
}
  
</style>