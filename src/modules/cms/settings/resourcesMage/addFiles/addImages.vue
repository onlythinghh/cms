<template>
    <div class="load_images">
        <div class="update_img">
            <div class="title">手机端图片<span class="jy">（建议尺寸750*500）</span></div>
            <ImgCutter ref="imgCutterModal"
                :cross-origin="true"
                :tool="false"
                :tool-bgc="'none'"
                :is-modal="true"
                :show-choose-btn="true"
                :lock-scroll="true"
                :box-width="780"
                :box-height="1000"
                :cut-width="750"
                :cut-height="334"
                :size-change="true"
                :move-able="true"
                :img-move="false"
                @cutDown="xztpCutDown"
            >
                <el-button slot="open" type="primary" @click="getBtnIdx('phoneResourcesUrl')">选择图片</el-button>
            </ImgCutter>
            <div class="img_cont"><img :src="baseImgUrl.phoneResourcesUrl" width="200" alt="" sizes="" srcset=""></div>
        </div>
        <div class="update_img">
            <div class="title">pad端图片<span class="jy">（建议尺寸768*500）</span></div>
            <ImgCutter ref="imgCutterModal"
                :cross-origin="true"
                :tool="false"
                :tool-bgc="'none'"
                :is-modal="true"
                :show-choose-btn="true"
                :lock-scroll="true"
                :box-width="1100"
                :box-height="780"
                :cut-width="1024"
                :cut-height="768"
                :size-change="true"
                :move-able="true"
                :img-move="false"
                @cutDown="xztpCutDown"
            >
                <el-button slot="open" type="primary" @click="getBtnIdx('flatResourcesUrl')">选择图片</el-button>
            </ImgCutter>
            <div class="img_cont"><img :src="baseImgUrl.flatResourcesUrl" width="200" alt="" sizes="" srcset=""></div>
        </div>

        <div class="update_img">
            <div class="title">pc端图片<span class="jy">（建议尺寸1024*768）</span></div>
            <ImgCutter ref="imgCutterModal"
                :cross-origin="true"
                :tool="false"
                :tool-bgc="'none'"
                :is-modal="true"
                :show-choose-btn="true"
                :lock-scroll="true"
                :box-width="1100"
                :box-height="780"
                :cut-width="1024"
                :cut-height="768"
                :size-change="true"
                :move-able="true"
                :img-move="false"
                @cutDown="xztpCutDown"
            >
                <el-button slot="open" type="primary" @click="getBtnIdx('pcResourcesUrl')">选择图片</el-button>
            </ImgCutter>
            <div class="img_cont"><img :src="baseImgUrl.pcResourcesUrl" width="200" alt="" sizes="" srcset=""></div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import ImgCutter from 'vue-img-cutter' // https://gitee.com/GLUESTICK/vue-img-cutter/
import { showError } from '@/utils'
export default {
    components:{
        ImgCutter
    },
    props:{
        imgData: {
            type: Object,
            default:() => {}
        }
    },
    data() {
        return {
            btnValue: 'phoneResourcesUrl',
            baseImgUrl:{
                pcResourcesUrl: '',
                phoneResourcesUrl: '',
                flatResourcesUrl: '',
            },
        }
    },
    computed: {
        ...mapGetters('cms/settings/resourcesMage', ['resChangeinfo'])
    },
    watch:{
        
        imgData: {
            deep:true,
            handler(newVal,oldVal){
                console.log('修改的图片：', newVal)
                this.baseImgUrl = newVal
            }
            
        },
    },
    mounted(){
        console.log('修改图片数据:', this.resChangeinfo)
        if(JSON.stringify(this.resChangeinfo) != '{}') {
            let { flatResourcesUrl, pcResourcesUrl, phoneResourcesUrl } = this.resChangeinfo
            this.baseImgUrl = {flatResourcesUrl, pcResourcesUrl, phoneResourcesUrl}
        }
    },
    methods:{
        ...mapActions('cms/settings/resourcesMage', ['getImgLoadResources']),

        selectTimer(){
            this.formInfo.timeradio = ''
        },
        selradio(){
            // console.log('val单选',val) // 长期有效时清空时间戳
            this.formInfo.time = ''
        },
        getBtnIdx(val) {
            this.btnValue = val
        },

        // 裁切图片
        xztpCutDown(fileName) {
            // let that = this
            console.log(fileName, '确定裁剪后的base64')
            // var imgGs = fileName.dataURL.split(';')[0].split('/')[1]
            this.baseImgUrl[this.btnValue] = fileName.dataURL
            var file = this.dataURLtoBlob(fileName.dataURL, fileName.fileName)
            console.log(file, 'file')//裁剪后file文件
            var formData = new FormData()
            formData.append('file', file)
            this.getImgLoadResources(formData).then(res => {
                // console.log('上传服务器res', res)
                let { success, data } = res
                if(success) {
                    this.$emit('uploadsucces', this.btnValue, data.imgUrl) // 把上传返回的数据发送给父组件
                } else {
                    this.$message({
                        type: 'error',
                        message: res.errMsg || '服务器异常,请稍后再试!'
                    });
                }
                
            }).catch(error => {
                showError(error.message)
            })
            
        },
        //将base64转换为file
        dataURLtoBlob: function(dataurl, name) {
            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new File([u8arr], name, { type: mime })
        },
    }
}
</script>
<style lang="scss" scoped>
.load_images{
    .el-upload__tip{
        margin-left: 10px;
    }
    /deep/ .el-upload-list__item{
        width: 60%;
        background: #f1f8ff;
    }
    .date_pic{
        margin-right: 20px;
    }
    .update_img{
        .title{
            height: 35px;
            width: 100%;
            padding: 0 15px;
            margin: 15px 0;
            background: #e6e6e6;
            .jy{
                color: #ff0000;
            }
        }
        .img_cont{
            img{
                border: 1px solid #ccc;
                margin: 5px 0;
            }
        }
    }
}
</style>