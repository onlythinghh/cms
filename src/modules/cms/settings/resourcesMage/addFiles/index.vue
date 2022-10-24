<template>
    <!-- <Modal :visible="modalVisible" fullscreen :title="'新增资源'" @close="closeModel"> -->
        <el-dialog 
        title="新增资源" 
        :visible="modalVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center
        width="80%"
        append-to-body
        @close="closeModel"
    >
        <el-form ref="addimg" label-width="80px" :rules="imgnameRules" :model="formInfo">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="标题名称" prop="name">
                        <el-input
                            v-model="formInfo.name"
                            placeholder="请输入标题名称"
                            clearable
                            maxlength="100"
                            show-word-limit
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="失效时间">
                        <el-date-picker
                            v-model="formInfo.invalidTime"
                            class="date_pic"
                            type="datetime"
                            placeholder="请选择时间"
                            @change="selectTimer"
                        ></el-date-picker>
                        <el-radio v-model="timeradio" label="1" @change="selradio">永不</el-radio>
                
                    </el-form-item>
                    </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="选择类型" prop="type">
                        <el-select v-model="formInfo.type" style="width: 50%" placeholder="请选择">
                            <el-option
                                v-for="item in themeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="标签" prop="keyword">
                        <el-input
                            v-model="formInfo.keyword"
                            placeholder="请输入标签，如:人物，自然风光"
                            clearable
                            maxlength="10"
                            show-word-limit
                            style="width: 50%"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item v-if="formInfo.type == '1'" label-width="0px">
                <addImages @uploadsucces="uploadsuccesImg"></addImages>
            </el-form-item>
            <el-form-item v-else-if="formInfo.type == '2'" label-width="0px">
                <addVideos @videoUpload="videoUpload"></addVideos>
            </el-form-item>
            <el-form-item v-else-if="formInfo.type == '3'" label-width="0px">
                <add-files @fileUpload="fileUpload"></add-files>
                <!-- 文件 -->
            </el-form-item>
            <div class="dialog-footer">
                <el-button type="primary" @click="getImageSave">确 定</el-button>
                <el-button @click="closeModel">取 消</el-button>
            </div>
        </el-form>
    <!-- </Modal> -->
        </el-dialog>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import addImages from './addImages.vue'
import addVideos from './addVideos.vue'
import addFiles from './addFiles.vue'
import { showMessage } from "@/utils"
import { dateFormat } from '@/utils/BaseUtil'
export default {
    components:{
        addImages,
        addVideos,
        addFiles
    },
    props:{
        visible: {
            type: Boolean,
            default: false
        },
        changeData: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            modalVisible: false,
            formInfo:{
                name: '',
                keyword: '',
                type: '',
                invalidTime: ''
            },
            timeradio: '',
            fromFileInfo: {
                pcResourcesUrl: '',
                phoneResourcesUrl: '',
                flatResourcesUrl: '',
                attaUrl: '', // 附件
                attaType: '', //附件类型
                imgUrl: '', // 首图
            },
            imgnameRules:{
                name: [{ required: true, message: "请输入标题名称", trigger: "blur" }],
                keyword: [{ required: true, message: "请输入标签", trigger: "blur" }],
            },
            themeOptions: [
                {label: '图片', value: 1},
                {label: '视频', value: 2},
                {label: '文件', value: 3},
            ],
        }
    },
    computed: {
        ...mapGetters('cms/settings/resourcesMage', ['resChangeinfo'])
    },
    watch: {
        visible(nextVisible) {
            this.modalVisible = nextVisible
        },
        resChangeinfo(newval){
            // console.log('newval新数据',newval)
            if(JSON.stringify(newval) != '{}') {
                const { name, keyword, type, invalidTime, flatResourcesUrl,
                    pcResourcesUrl, phoneResourcesUrl, imgUrl
                } = newval
                this.formInfo.name = name,
                this.formInfo.keyword = keyword,
                this.formInfo.type = type,
                this.formInfo.invalidTime = invalidTime ? dateFormat(invalidTime) : ''
                this.timeradio = invalidTime ? '' : '1'
                this.fromFileInfo.flatResourcesUrl = flatResourcesUrl
                this.fromFileInfo.pcResourcesUrl = pcResourcesUrl
                this.fromFileInfo.phoneResourcesUrl = phoneResourcesUrl
                this.fromFileInfo.imgUrl = imgUrl
            }
        }
    },
    methods:{
        ...mapActions('cms/settings/resourcesMage', ['getsaveResources']),

        selectTimer(){
            this.timeradio = ''
        },
        selradio(){
            // console.log('val单选',val) // 长期有效时清空时间戳
            this.formInfo.invalidTime = ''
        },
        // 接收上传成功后的图片
        uploadsuccesImg(type, data) {
            // console.log('上传图片成功：', type, data)
            this.fromFileInfo[type] = data
        },
        // 接收上传成功的视频地址和首图地址
        videoUpload(type, data){
            // console.log('type:',type)
            if(type == 'imgUrl'){
                this.fromFileInfo[type] = data
            } else {
                this.fromFileInfo.pcResourcesUrl = data
                this.fromFileInfo.phoneResourcesUrl = data
                this.fromFileInfo.flatResourcesUrl = data
            }
        },
        // 上传文件返回的地址
        fileUpload(data) {
            this.fromFileInfo.pcResourcesUrl = data
            this.fromFileInfo.phoneResourcesUrl = data
            this.fromFileInfo.flatResourcesUrl = data
        },

        // 确定
        getImageSave() {
            this.$refs.addimg.validate(valid => {
                if (!valid) {
                    return false;
                }
                let { pcResourcesUrl, phoneResourcesUrl, flatResourcesUrl,imgUrl} = this.fromFileInfo
                // if(!pcResourcesUrl && !phoneResourcesUrl && !flatResourcesUrl){
                //     let str = ['', '图片', '视频', '文件']
                //     showMessage({
                //         type: "warning",
                //         message: `请上传${str[this.formInfo.type]}资源！`
                //     });
                //     return false
                // }
                if(this.formInfo.type == '2' && !imgUrl) {
                    showMessage({
                        type: "warning",
                        message: `请上传视频首图！`
                    });
                    return false
                }
                if(pcResourcesUrl && phoneResourcesUrl && flatResourcesUrl) {
                    let params = {
                        ...this.formInfo,
                        ...this.fromFileInfo
                    }
                    if(JSON.stringify(this.resChangeinfo) != '{}'){
                        params.id = this.resChangeinfo.id
                    }
                    // console.log('保存资源pams',params)
                    this.getsaveResources(params).then(res => {
                        // console.log('保存新建的资源：', res)
                        if(res.success) {
                            let reselut = {
                                type: this.formInfo.type,
                                ...this.fromFileInfo
                            }
                            this.$emit('loadInitList', reselut)
                            this.closeModel()
                            this.$message.success(res.data)
                        } else {
                            this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                        }
                    }).catch(error => {
                        this.$message.error(error||'服务器繁忙，请稍后再试！')
                    })
                } else {
                    let str = ['', '图片', '视频', '文件']
                    showMessage({
                        type: "warning",
                        message: `请上传${str[this.formInfo.type]}资源！`
                    });
                }
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
    }
}
</style>