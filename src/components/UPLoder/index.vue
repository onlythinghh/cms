<template>
    <el-dialog 
        title="超大附件" 
        :visible="isShowUP"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center
        width="50%"
        append-to-body
        @close="handelClose"
    >
        <uploader
            ref="uploader"
            :options="options"
            :file-status-text="statusText"
            :auto-start="false"
            class="uploader-example"
            @file-added="onFileAdded"
            @file-success="onFileSuccess"
            @file-error="onFileError"
            @file-removed="fileRemoved"
        >
            <uploader-btn v-show="show_up" single style="background-color: #67C13B">
                <i class="el-icon-upload" style="margin-right: 5px"></i>上传文件</uploader-btn>
                <i style="color:#E6A23C;font-style: inherit;">推荐大小：图片不超过5M，附件不超过500M，视频不超过1G！</i>
            <uploader-list></uploader-list>
            <span style="color:#F56C6C">{{errMsg}}</span>
        </uploader>
        <div slot="footer" class="dialog-footer">
            <el-button v-show="!done" @click="cancelUpload">取消上传</el-button>
            <el-button v-show="done" type="success" @click="handelClose(true)">完成上传</el-button>
            <el-button type="primary" @click="submitUpload">开始上传</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { mapActions } from "vuex";
import { showError,showMessage,showLoading } from '../../utils';

export default {
    name: "UPLoder",
    props:{
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            isShowUP:false,
            show_up: true,
            done: false,
            errMsg:'',
            options: {
                target: "/api/uploader/save",
                maxChunkRetries: 2,
                testChunks: false,
                chunkSize: 10 * 1024 * 1024,
                simultaneousUploads: 3,
                query: {
                    type: "attach",
                    id: ""
                },
                headers: {
                    token: this.$store.state.authen.token
                }
            },
            appId:JSON.parse(sessionStorage.getItem("SITE")).id,
            uploaderData:null,
            statusText: {
                success: "上传成功",
                error: "上传失败",
                uploading: "上传中",
                paused: "暂停中",
                waiting: "等待中"
            },
            uploadType:{
                img:['jpg','jpeg','png','svg','gif'],
                video:['mp4','avi','mpeg','webm','ogg'],
                audio:['wav','mp3','wma']
            },
        };
    },
    watch: {
        visible(v) {
            this.isShowUP = v
        },
    },
    methods: {
        ...mapActions("authen", ["combine"]),
        onFileAdded(file) {
            this.show_up = false
            this.options.query.id = file.uniqueIdentifier + "-" + new Date().getTime();
            let file_type = file.name.substring(file.name.lastIndexOf(".") + 1);
            this.uploadType.img.forEach(tp=>{
                file_type==tp && (this.options.query.type = 'image')
            })
            this.uploadType.video.forEach(tp=>{
                file_type==tp && (this.options.query.type = 'video')
            })
            this.uploadType.audio.forEach(tp=>{
                file_type==tp && (this.options.query.type = 'audio')
            })
        },
        onFileSuccess(rootFile, file, response, chunk) {
            let res = JSON.parse(response);
            if (res.success) {
                showMessage('上传成功！')
                showLoading(true,'正在合并...')
                this.combine({
                    id: this.options.query.id,
                    type: this.options.query.type,
                    filename: file.name,
                    appId:this.appId,
                }).then(res => {
                    if(res.success){
                        this.uploaderData = {type:this.options.query.type,data:res.data}
                        this.done = true;
                        showLoading()
                        showMessage('合并成功！')
                    }else{
                        showLoading()
                        this.errMsg = '服务器异常合并失败！'
                        showError('服务器异常合并失败！')
                    }
                });
            } else {
                showError(res.errMsg)
                showLoading()
            }
        },
        onFileError(rootFile, file, response, chunk) {
            showError('文件上传失败')
        },
        fileRemoved(file) {
            this.$nextTick(() => {
                this.show_up = true;
                this.done = false;
            });
        },
        submitUpload() {
            this.$nextTick(() => {
                for (var i = 0; i < this.$refs["uploader"].files.length; i++) {
                    this.$refs["uploader"].files[i].resume();
                }
            });
        },
       
        handelClose(v=false) {
            this.clearcache()
            this.$emit('closePublishModal', false)
            v && this.$emit('uploaderData',this.uploaderData)
        },
        clearcache() {
            this.show_up = true;
            this.done = false;
            this.errMsg = ''
            this.options.query.id = ''
            this.options.query.type = 'attach'
            this.$refs.uploader.uploader.cancel();
        },
        cancelUpload() {
            this.thirdDialog = false;
            this.clearcache();
        }
    }
};
</script>

<style lang="scss">
.dialog-footer {
    text-align: center;
}
.uploader-example .uploader-btn {
    margin-right: 8px;
    color: #ffffff;
    border: #ffffff;
}
.uploader-file{
    margin-top: 10px;
    border: 1px solid #ccc;
    .uploader-file-icon {
        &:before {
            content: '' !important;
        }
        &[icon=image] {
            background: url(./image/image-icon.png);
        }
        &[icon=video] {
            background: url(./image/video-icon.png);
        }
        &[icon=document] {
            background: url(./image/text-icon.png);
        }
        &[icon=audio]:before {
            content: "\1F3B5" !important;
        }
        &[icon=unknown]:before {
            content: "\1F4C3" !important;
        }    
    }
}

</style>