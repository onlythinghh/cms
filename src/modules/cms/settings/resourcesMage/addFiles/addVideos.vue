<template>
    <div class="add_videos">
        <div class="update_img">
            <div class="title">上传视频</div>
            <div class="load_box">
                <div class="left">
                    <div>
                        <el-upload
                            v-loading="uploadLoading"
                            action="#"
                            :http-request="loadVideos"
                            :show-file-list="false"
                        >
                            <div class="upload_box">
                                <div v-if="videoForm.showVideoPath ==''">
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">点击此处上传视频</div>
                                    <!-- <div class="el-upload__tip" slot="tip">只能上传视频文件，且不超过100MB</div> -->
                                </div>
                                <!-- controls="controls" -->
                                <video 
                                    v-if="videoForm.showVideoPath !=''"
                                    :src="videoForm.showVideoPath"
                                    class="avatar video-avatar"
                                >您的浏览器不支持视频播放</video>
                            </div>
                        </el-upload>
                        
                    </div>
                    
                </div>
                <div class="right">
                    <el-upload
                        v-loading="uploadLoading"
                        class="avatar_uploader"
                        :show-file-list="false"
                        action="#"
                        accept=".jpg, .jpeg, .JPEG, .JPG .png, .PNG"
                        :http-request="uploadTimg"
                    >   
                        <div class="upload_box">
                            <img v-if="imgUrl" :src="imgUrl" class="avatar">
                            <i v-else class="el-icon-plus"></i>
                            <div class="el-upload__text">点击此处上传封面</div>
                        </div>
                    </el-upload>
                </div>
            </div>
        </div>
        <!-- <div class="update_img">
            <div class="title">平板</div>
        </div>
        <div class="update_img">
            <div class="title">PC</div>
        </div> -->
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { showError } from '@/utils'
import {  matchImage } from '@/utils/RegExpUtil'
export default {
    props:{
        fileData:{
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            //显示上传按钮
            videoForm: {
                showVideoPath: ''
            },
            imgUrl: '',
            uploadLoading: false
        }
    },
    computed: {
        ...mapGetters('cms/settings/resourcesMage', ['resChangeinfo'])
    },
    mounted(){
        console.log('修改视频数据:', this.resChangeinfo)
        if(JSON.stringify(this.resChangeinfo) != '{}') {
            this.videoForm.showVideoPath = this.resChangeinfo.pcResourcesUrl
            this.imgUrl = this.resChangeinfo.imgUrl
        }
    },
    methods:{
        ...mapActions('cms/settings/resourcesMage', ['getVideoLoadResources', 'getImgLoadResources']),
        
        // 上传视频
        loadVideos({file}){
            this.uploadLoading = true
            console.log('视频file',file)
            let fileSize = file.size / 1024 / 1024 < 100;
            if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) == -1) {
                showError('请上传正确的视频格式')
                this.uploadLoading = false
                return
            }
            if (!fileSize) {
                this.uploadLoading = false
                showError(`视频大小不能超过 100 MB`)
                return false;
            }
            let formData = new FormData();
            formData.append('file', file);
            this.getVideoLoadResources(formData).then(res => {
                // console.log('视频：', res)
                this.uploadLoading = false
                let { success, data, errMsg } = res
                if( success){
                    this.videoForm.showVideoPath = data.videoUrl
                    this.$emit('videoUpload', 'video', data.videoUrl)
                } else {
                    this.$message({
                        type: 'error',
                        message: errMsg || '服务器异常,请稍后再试!'
                    });
                }
            })
        },

        // 上传封面图
        uploadTimg({file}) {
            this.imgUrl = URL.createObjectURL(file);
            // const { type, limit = 5 } = this.getAttachModule('newMediaImageLimit')
            this.uploadLoading = true
            if (!matchImage(file.type)) {
                showError('只允许上传图片')
                this.uploadLoading = false
                return
            }
            let formData = new FormData();//通过formdata上传
            formData.append('file', file);
            this.getImgLoadResources(formData).then(res => {
                // console.log('上传封面res', res)
                let { success, data } = res
                this.uploadLoading = false
                if(success) {
                    this.$emit('videoUpload', 'imgUrl', data.imgUrl) // 把上传返回的数据发送给父组件
                } else {
                    this.$message({
                        type: 'error',
                        message: res.errMsg || '服务器异常,请稍后再试!'
                    });
                }
                
            }).catch(error => {
                this.uploadLoading = false
                showError(error.message)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.add_videos{
    .update_img{
        .title{
            height: 35px;
            width: 100%;
            padding: 0 15px;
            margin: 15px 0;
            background: #e6e6e6;
        }
        .load_box{
            display: flex;
            .right{
                margin-left: 20px;
            }
        }
        .upload_box{
            box-sizing: border-box;
            width: 360px;
            height: 180px;
            text-align: center;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            border-radius: 5px;
            border: 1px solid #C0C4CC;
            .avatar{
                width: 100%;
                height: 100%;
            }
            .el-icon-upload, .el-icon-plus{
                font-size: 67px;
                color: #C0C4CC;
                margin: 40px 0 16px;
                line-height: 50px;
            }
            .el-icon-plus{
                font-size: 32px;
            }
            
            .el-upload__text{
                color: #606266;
                font-size: 14px;
                text-align: center;
                color: #66b1ff;
            }
        }
    }
}
</style>