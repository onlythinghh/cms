<template>
    <Modal :visible="modalVisible" :title="title" @close="closeModal">
        <el-row>
            <!-- 编辑 -->
            <div v-if="showEdit">
                <el-form label-width="130px">
                    <el-form-item label="发布范围：">
                        <span>{{name}}</span>
                    </el-form-item>
                    
                    <el-form-item label="开始时间：" prop="plan">
                        <el-date-picker
                            v-model="editForm.plan"
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
            </div>
            
            
            <!-- 监控 -->
            <div v-else>
                <el-form label-width="200px">
                    <el-form-item label="已发布文章总数量：">
                        <span>{{info.total}}</span>
                    </el-form-item>
                    <el-form-item label="已发布数量：">
                        <span>{{info.published}}</span>
                    </el-form-item>
                    <el-form-item label="未发布数量：">
                        <span>{{info.unpublished}}</span>
                    </el-form-item>
                </el-form>
                <el-col :span="12">
                    <el-button 
                        v-if="start" 
                        :disabled="disabled" 
                        type="primary" 
                        style="display:block;margin:0 auto" 
                        @click="_start"
                    >{{start}}</el-button>
                </el-col>
                <el-col :span="12">
                    <el-button type="primary" style="display:block;margin:0 auto" @click="close">取消</el-button>
                </el-col>
            </div>
            
        </el-row>
        
    </Modal>
</template>
<script>
import { mapActions } from 'vuex'
// import { matchName } from '../../../../utils/RegExpUtil'
import { showLoading, showError, showMessage } from '../../../utils'
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
            editForm:{
                taskId: null,
                plan: '',
            },
            modalVisible: false,
            needReload: false,
            activeName: '1',
            name: '',
            showEdit: false,
            title: '',
            start: '启动',
            disabled: true
        }
    },
    watch: {
        visible(visible) {
            this.modalVisible = !!visible
            this.needReload = false
        },
        info(v) {
            if(v.status === 5) {
                this.start = '启动'
                this.disabled = false
            } else if(v.status === 2) {
                this.start = '暂停'
                this.disabled = false
            } else {
                this.disabled = true
            }
            this.name = v.name
            this.editForm.plan = v.startTime
            this.editForm.taskId = v.id
            if(v.both === '编辑') {
                this.showEdit = true
                this.title = '编辑任务'
            } else {
                this.showEdit = false
                this.title = '发布监控'
            }
        }
    },
    created() {
        // this.schedulerProgress({taskId: this.editForm.taskId})
    },
    mounted() {
        
    },
    methods: {
        ...mapActions('cms/task',['schedulerEdit','startScheduler','endScheduler']),
        closeModal() {
            this.$emit('closePublishModal', this.needReload)
            this.modalVisible = false
        },
        _ok() {
            const editForm = {...this.editForm}
            showLoading(true, '正在保存任务...')
            this.schedulerEdit(editForm).then(() => {
                showLoading(false)
                this.needReload = true
                this.close()
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        //启动
        _start() {
            if(this.start === '启动') {
                this.startScheduler({taskId: this.editForm.taskId}).then(data=>{
                    this.start = '暂定'
                    showMessage(data.data)
                    this.needReload = true
                }).catch(error => {
                    showError(error.message)
                })
            } else {
                this.endScheduler({taskId: this.editForm.taskId}).then(data=>{
                    this.start = '启动'
                    showMessage(data.data)
                    this.needReload = true
                }).catch(error => {
                    showError(error.message)
                })
            }
        },


        close() {
            this.closeModal()
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
