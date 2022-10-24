<template>
    <Modal :visible="modalVisible" :title="'发布'" @close="closeModal">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- <el-tab-pane label="发布设置" name="1"> -->
                <el-row>
                    <el-form label-width="130px">
                        <el-form-item label="发布范围：" prop="range">
                            <el-radio-group v-model="publishForm.range">
                                <el-radio :label="1">全量</el-radio>
                                <el-radio :label="2">增量</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="发布类型：" prop="type">
                            <el-radio-group v-model="publishForm.type">
                                <el-radio :label="1">即时</el-radio>
                                <el-radio :label="2">计划</el-radio>
                            </el-radio-group>
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
                    </el-form>
                    <el-col :span="12">
                        <el-button type="primary" style="display:block;margin:0 auto" @click="_ok">确定</el-button>
                    </el-col>
                    <el-col :span="12">
                        <el-button type="primary" style="display:block;margin:0 auto" @click="close">取消</el-button>
                    </el-col>
                </el-row>
            <!-- </el-tab-pane> -->
            <!-- <el-tab-pane label="发布监控" name="2">
                <el-row>
                    <el-form label-width="200px">
                        <el-form-item label="发布文章总数量：">
                            1
                        </el-form-item>
                        <el-form-item label="已发布数量：">
                            1
                        </el-form-item>
                        <el-form-item label="未发布数量：">
                            1
                        </el-form-item>
                    </el-form> -->
                    <!-- <el-col :span="12">
                        <el-button type="primary" style="display:block;margin:0 auto" @click="_start">{{start}}</el-button>
                    </el-col> -->
                    <!-- <el-col>
                        <el-button type="primary" style="display:block;margin:0 auto" @click="close">关闭</el-button>
                    </el-col>
                </el-row>
            </el-tab-pane> -->
        </el-tabs>
        
    </Modal>
</template>
<script>
import { mapActions } from 'vuex'
// import { matchName } from '../../../../utils/RegExpUtil'
import { showLoading, showError, showMessage } from '../../../../utils'
export default {
    name: 'SitePublish',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        info: {
            type: Object,
            default: () => { }
        },
        closeCopyModal: {
            type: Function,
            default: () => { }
        },
        siteId: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            publishForm:{
                range:1,
                type: 1,
                plan: '',
                id: this.siteId
            },
            modalVisible: false,
            needReload: false,
            activeName: '1',
            // start: '启动'
        }
    },
    watch: {
        visible(visible) {
            this.modalVisible = !!visible
            this.needReload = false
        },
        siteId(v) {
            if(v)   this.publishForm.id = v
            
        }
    },
    mounted() {
        
        // this.$nextTick(()=>{
        //     const title = document.getElementsByClassName('el-dialog__headerbtn')
        //     title[2].innerHTML = '关闭'
        // })
        
    },
    methods: {
        ...mapActions('cms/site',['publishSite']),
        closeModal() {
            this.$emit('closePublishModal', this.needReload)
            this.modalVisible = false
        },
        _ok() {
            this._publishSite()
        },
        //启动
        // _start() {
        //     this.start === '启动' ? this.start = '暂定' : this.start = '启动'
        // },
        //发布
        _publishSite() {
            showLoading('正在发布')
            this.publishSite({...this.publishForm}).then((data)=>{
                showLoading(false)
                showMessage(data)
                this.close()
            }) .catch(error=>{
                showLoading(false)
                showError(error.message)
            })
        },
        //点击tabs页发生的事件
        handleClick(tab) {
        },
        close() {
            this.closeModal()
            this.publishForm={
                range:1,
                type: 1,
                plan: '',
                id: this.siteId
            }
            this.activeName = '1',
            this.start = '启动'
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
    /deep/ .el-dialog__headerbtn .el-dialog__close {
        color: #FFF
    }
</style>
