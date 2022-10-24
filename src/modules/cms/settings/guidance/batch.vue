<template>
    <div class="batch">
        <el-dialog
        title="批量处理"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose"
        >
        <div class="content">
            <el-form ref="form" :model="form" label-width="80px">
                 <el-form-item label="处理理由">
                    <el-input
                        v-model="form.reason"
                        type="textarea"
                        :rows="6"
                        placeholder="请输入理由"
                    >
                    </el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                         <el-form-item label="水印" prop="watermark">
                            <el-select v-model="form.watermark" placeholder="请选择" style="width: 100%;" clearable>
                                <el-option v-for="(item, index) in watermarkArr" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                         <el-form-item label="签名" prop="sign">
                            <el-select v-model="form.sign" placeholder="请选择" style="width: 100%;" clearable>
                                <el-option v-for="(item, index) in signArr" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="pass">通 过</el-button>
            <el-button type="primary" @click="reject">驳 回</el-button>
            <el-button @click="close">关 闭</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import { showLoading, hideLoading } from "@/utils";
export default {
    name: 'Batch',
    props: {
        ids: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            dialogVisible: true,
            form: {
                reason: '',
                watermark:'',
                sign:''
            },
            watermarkArr:[],
            signArr:[]
        }
    },
    mounted(){
        this.init()
    },
    methods: {
        ...mapActions('cms/settings/guidance',['auditMulti','warterlist']),
        handleClose(done) {
            this.$confirm('确认关闭？').then(_ => {
                this.$emit('closeDialog')
            }).catch(_ => {});
        },
        async init(){
            const data = await this.warterlist({
                type:1
            })
            const data2 = await this.warterlist({
                type:2
            })
            this.watermarkArr = data.data
            this.signArr = data2.data
        },
        // 通过
        pass() {
            this.audit(1)
        },
        async audit(oper) {
            showLoading('正在处理中...')
            const data = await this.auditMulti({
                ...this.form,
                idList: this.ids,
                oper
            })
            if(data.success) {
                this.$message({
                    type: 'success',
                    message: '已处理'
                })
                this.$emit('closeDialog')
            }
            hideLoading()
        },
        // 驳回
        reject() {
            this.audit(2)
        },
        // 关闭
        close() {
            this.$emit('closeDialog')
        },
    },
}
</script>

<style lang="scss" scoped>
.batch {
    width: 100%;
    .content {
        width: 100%;
    }
    .dialog-footer {
        width: 100%;
        display: flex;
        justify-content: center;
    }
}
/deep/ .el-textarea__inner{
    resize: none;
}
</style>
