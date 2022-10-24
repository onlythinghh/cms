<template>
    <Modal :visible="modalVisible" :title="type" @close="close">
        <el-row>
            <el-form ref="channelfrom" label-width="130px" :rules="Rules" :model="publishForm">
                <el-form-item v-if="type!='直接发布'" label="发布类型：" prop="type">
                    <el-radio-group v-model="publishForm.type">
                        <el-radio :label="1">即时</el-radio>
                        <el-radio :label="2">计划</el-radio>
                        <el-radio :label="3">紧急</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- <el-form-item v-show="people" label="审核人：" prop="type">
                    <el-select
                        v-model="publishForm.reviewer"
                        placeholder="请选择"
                        style="width:50%"
                        clearable
                    >
                        <el-option
                            v-for="item in reviewerArr"
                            :key="item.id"
                            :label="item.value"
                            :value="item.key"
                        >
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item v-if="type!='直接发布'" label="发布流程：" prop="flowId">
                    <el-select
                        v-model="publishForm.flowId"
                        placeholder="请选择"
                        style="width:80%"
                        clearable
                    >
                        <el-option
                            v-for="item in flowchannel"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上线通知：" prop="noticeList">
                    <el-select v-model="publishForm.noticeList" placeholder="请选择" filterable multiple style="width:80%" clearable>
                        <el-option
                            v-for="item in noticeListOpt"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="publishForm.type === 2" label="计划发布时间：" prop="plan">
                    <el-date-picker
                        v-model="publishForm.plan"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="发布原因：" prop="reason">
                    <el-input v-model="publishForm.reason" type="textarea" :rows="6" maxlength="100" show-word-limit ></el-input>
                </el-form-item>
                <el-form-item label="附件：">
                    <el-upload
                        class="upload-demo"
                        action="#"
                        :http-request="uploadFile"
                        :before-remove="beforeRemove"
                        :file-list="fileList"
                        multiple
                    >
                        <el-button type="primary" plain><i class="el-icon-upload el-icon--right"></i>点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <el-col :span="12">
                <el-button type="primary" style="display:block;margin:0 auto" @click="_ok">确定</el-button>
            </el-col>
            <el-col :span="12">
                <el-button type="primary" style="display:block;margin:0 auto" @click="close">取消</el-button>
            </el-col>
        </el-row>
        
    </Modal>
</template>
<script>
import { mapActions } from 'vuex'
// import { matchName } from '../../../../utils/RegExpUtil'
import { hideLoading, showLoading, showMessage } from '../../../../utils'
export default {
    name: 'SitePublish',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        people: {
            type: Boolean,
            default: false
        },
        info: {
            type: Object,
            default: () => { }
        },
        // eslint-disable-next-line
        active_Name: {
            type: String,
            default: ''
        },
        searchTwo: {
            type: Function,
            default: () => { }
        },
        closeCopyModal: {
            type: Function,
            default: () => { }
        },
        articleId: {
            type: String,
            default: ''
        },
        curChannelId: {
            type: Number,
            default: null
        },
        customFormId:{
            type: Number,
            default: null
        },
        custom:{
            type: Boolean,
            default: false
        },
        type:{
            type: String,
            default: ''
        },
    },
    data() {
        return {
            publishForm:{
                dataId: this.articleId,
                channelId: this.curChannelId,
                formId:null,
                reviewer:'',
                type:1,
                flowId: '',
                noticeList: [], // 上线通知
            },
            Rules:{
                flowId: [
                    { required: true, message: "该项为必选", trigger: "change" }
                ]
            },
            modalVisible: false,
            activeName: '1',
            start: '启动',
            reviewerArr:[],
            flowchannel:[],
            noticeListOpt: [], // 上线通知人列表
            fileList: [],
            appid: ''
        }
    },
    watch: {
        visible(v) {
            v && this.init()
            this.modalVisible = v
        },
        // modalVisible(v){
        //     // v && (this.publishForm.reason = '')
        // }
    },
    created(){
        let _site = JSON.parse(sessionStorage.getItem("SITE"));
        this.appid = _site.id
    },
    mounted() {
        // this.$nextTick(() => {
        //     const title = document.getElementsByClassName('el-dialog__headerbtn')
        //     title[2].innerHTML = '关闭'
        // })
    },
    methods: {
        ...mapActions(
            'cms/article/articleList',['releaseArticle','customArticle',
                'getReviewer','auditPublish','directPublish', 'getChanneldata', 'uploaderSave'
            ]),
        ...mapActions('authen', ['getReviewerList']),
        async init(){
            const data = await this.getReviewer({})
            this.reviewerArr = data.data
            this.publishForm.dataId = this.articleId
            this.publishForm.formId = this.customFormId
            this.publishForm.channelId = this.curChannelId
            if(this.type != '直接发布') {
                this.getinitChannel()
            }
            this.getReviewerdata()
        },
        async getinitChannel(){
            // 获取发布流程的数据
            let param = {
                channel: this.curChannelId,
                type: 'PUBLISH'
            }
            const result = await this.getChanneldata(param)
            if(result.success){
                this.flowchannel = result.data || []
            } else {
                this.$message.error(result.errMsg||'服务器繁忙，请稍后再试！'); 
            }
        },
        //获取审核人列表
        getReviewerdata(){
            this.getReviewerList().then(res => {
                // console.log('审核人列表',res)
                this.noticeListOpt = res
            })
        },
        // 上传附件
        uploadFile({file}){
            console.log('file',file)
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
            console.log('文件类型：',testmsg)
            let modules = ''
            let fil = ['xlsx', 'xls', 'pdf', 'doc', 'docx', 'zip','ZIP', 'arr', 'ARR']
            let img = ['jpg', 'jpeg', 'JPEG', 'JPG', 'png', 'PNG', 'svg', 'gif']
            if(fil.includes(testmsg)){
                modules = '21'
            } else if(img.includes(testmsg)) {
                modules = '13'
            } else {
                modules = '23'
            }
            let formData = new FormData();//通过formdata上传
            formData.append('file', file);
            formData.append('name', file.name);
            formData.append('appid', this.appid);
            formData.append('module', modules);
            formData.append('type', 'link');
            this.uploaderSave(formData).then(res => {
                if(res.success){
                    res.data.name = res.data.origin
                    this.fileList.push(res.data) //[...this.fileList, ...res.data]
                    console.log('this.fileList',this.fileList)
                } else {
                    this.$message({
                        type: 'error',
                        message: res.errMsg || '服务器异常,请稍后再试!'
                    });
                }
            })
        },
        
        // 删除文件之前的钩子
        beforeRemove(file) {
            // console.log('删除附件fileList',file, this.fileList)
            let index = this.fileList.findIndex(item => {
                if(item.id == file.id) {
                    return true
                }
            })
            this.fileList.splice(index, 1)
            return true
        },
        closeModal() {
            this.$emit('searchTwo')
            this.$emit('closePublishModal', false)
        },
        _ok() {
            this.$refs.channelfrom.validate(valid => {
                if (!valid) {
                    return false;
                }
                if(this.active_Name=='basic'){
                    this.publishForm.formId = null
                }
                if( this.type != '直接发布' && this.publishForm.flowId == '') {
                    return this.$message.warning('请选择发布流程！');
                }
                this._publishSite()
            
            })
        },
        //发布
        async _publishSite() {
            showLoading('正在发布')
            if(this.type =='直接发布'){
                await this.directPublish({
                    ...this.publishForm
                }) .then(data =>{
                    hideLoading()
                    if(data.success) {
                        showMessage(data.errMsg)
                        this.closeModal()
                    } else {
                        this.$message({
                            message: `${data.errMsg}`,
                            type: 'warning'
                        });
                    }
                })
            }else{
                let attachIds = this.fileList.map(ele => ele.id)
                let params = {
                    ...this.publishForm,
                    attachList: attachIds.join(',')
                }
                if(this.publishForm.noticeList.length>0){
                    params.noticeList = this.publishForm.noticeList.join(',')
                } else {
                    params.noticeList = ''
                }
                await this.auditPublish(params) .then(data =>{
                    hideLoading()
                    if(data.success) {
                    // if(index==1){
                    //     this.getArticleList({
                    //         channelId: this.currentChannel.id,
                    //         limit:this.limit
                    //     })
                    // }else{
                    //     this.custom_search();
                    // }
                        showMessage(data.errMsg)
                        this.closeModal()
                    } else {
                        this.$message({
                            message: `${data.errMsg}`,
                            type: 'warning'
                        });
                    }
                })
            }
        },
        close() {
            this.closeModal()
            this.publishForm={
                dataId: this.articleId,
                channelId: this.curChannelId,
                formId:null,
                reviewer:'',
                type:1,
                flowId: '',
                noticeList: []
            }
            this.activeName = '1',
            this.start = '启动'
            this.fileList = []
        },
    }

}
</script>
<style lang="scss" scoped>
    // /deep/ .el-dialog {
    //     width: 500px !important
    // }
    /deep/ .el-dialog__header {
        background: rgba(34, 153, 238, 1);
        height: 35px;
        line-height: 35px;
        padding: 0;
        
        .el-dialog__title {
            color: #FFF;
            font-size: 14px;
            font-weight: 700;
            padding-left: 10px
        }

        .el-dialog__headerbtn {
            color: #FFF;
            font-size: 14px;
            font-weight: 700;
            top: 10px
        }
    }
    /deep/ .el-tabs__item {
        width: 280px;
        text-align: center;
        font-size: 16px;
        font-weight: 400;
    }
    /deep/ .el-icon-time {
        display: none
    }
    /deep/ .el-dialog__headerbtn .el-dialog__close {
        color: #FFF
    }
</style>
