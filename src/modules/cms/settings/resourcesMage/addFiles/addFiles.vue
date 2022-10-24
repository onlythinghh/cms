<template>
    <div class="upload_file">
        <el-upload
            class="upload-demo"
            action="#"
            :accept="ruleAccept"
            :http-request="uploadFile"
            :before-remove="beforeRemove"
            :file-list="fileList"
            :limit="1"
            :on-exceed="handleExceed"
        >
            <el-button size="small" type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip">只能上传图片、pdf、word、excel文件</span>
        </el-upload>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { showError } from '@/utils'
export default {
    data() {
        return {
            fileList: [],
            ruleAccept: '.xlsx, .xls, .pdf, .doc, .docx, .jpg, .jpeg, .JPEG, .JPG .png, .PNG'
        }
    },
    computed: {
        ...mapGetters('cms/settings/resourcesMage', ['resChangeinfo'])
    },
    mounted(){
        console.log('修改其他文件数据:', this.resChangeinfo)
        if(JSON.stringify(this.resChangeinfo) != '{}') {
            // this.videoForm.showVideoPath = this.resChangeinfo.pcResourcesUrl
            this.fileList = [
                {
                    name: `${this.resChangeinfo.fileName}.${this.resChangeinfo.format}`,
                    uid: this.resChangeinfo.id
                }
            ]
        }
    },
    methods:{
        ...mapActions('cms/settings/resourcesMage', ['getAttaLoadResources']),
        // 文件超出个数限制时的钩子
        handleExceed(files){
            console.log('files.length',files.length)
            if(files.length>=1) {
                showError(`一次只能新增一个文件`)
            }
        },
        // 上传文件
        uploadFile({file}){
            // /api/cms/image/upload/image
            console.log('file',file)
            if(this.fileList.length == 1){
                return false
            }
            let formData = new FormData();//通过formdata上传
            formData.append('file', file);
            this.getAttaLoadResources(formData).then(res => {
                console.log('上传文件',res)
                if(res.success){
                    let item = [{name: file.name, uid:file.uid}]
                    this.fileList = item
                } else {
                    this.$message({
                        type: 'error',
                        message: res.errMsg || '服务器异常,请稍后再试!'
                    });
                }
                this.$emit('fileUpload', res.data.attaUrl) // 返回上传成功后返回的地址
            })
        },
        
        // 删除文件之前的钩子
        beforeRemove(file, fileList) {
            console.log('fileList', this.fileList)
            // showError(`不能删除`)
            this.fileList = []
            return true
        }
    }
}
</script>
<style lang="scss" scoped>
.upload_file{
    .el-upload__tip{
        margin-left: 10px;
    }
    /deep/ .el-upload-list__item{
        width: 60%;
        background: #f1f8ff;
    }
}

</style>