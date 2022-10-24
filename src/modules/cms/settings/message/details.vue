<template>
    <div class="details">
        <el-dialog
        title="留言信息"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose"
        >
        <el-form :model="formData" class="demo-form-inline" label-width="80px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="姓名">
                        <el-input v-model="formData.name" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机">
                        <el-input v-model="formData.phone" readonly></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="问题">
                        <el-input v-model="formData.title" type="textarea" :rows="3" readonly></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- <el-form-item label="描述">
                <el-input 
                v-model="formInline.user" 
                placeholder="请输入" 
                type="textarea"
                :rows="6"
                readonly
                ></el-input>
            </el-form-item> -->
        </el-form>
        <p class="title">处理相关</p>
        <el-form :model="form" class="demo-form-inline" label-width="80px">
             <el-form-item label="答复方式">
                <el-select v-model="form.type" placeholder="请选择" :disabled="!type">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="答复内容">
                <el-input 
                v-model="form.reply" 
                placeholder="请输入" 
                type="textarea"
                :rows="6"
                :disabled="!type"
                ></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button v-if="type" type="primary" @click="save">保 存</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import { showLoading, hideLoading } from "@/utils";
export default {
    name: 'MessageDetails',
    props: {
        formData: {
            type: Object,
            default: () => {}
        },
        type: {
            type: Boolean,
            default: false
        },
        id: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            dialogVisible: true,
            formInline: {},
            form: {
                type: '1',
                reply: ''
            },
            options: [
                {
                    label: '电话',
                    value: '1'
                },
                {
                    label: '邮件',
                    value: '2'
                },
                {
                    label: '传真',
                    value: '3'
                }
            ]
        }
    },
    async created() {
        if(this.id) {
            showLoading('加载中...')
            const { data }= await this.detail({
                id: this.id
            })
            hideLoading()
            this.form.type = data.linkType 
            this.form.reply = data.reply
        }
    },
    methods: {
        ...mapActions('cms/settings/message',['messageSave','detail']),
        cancel() {
            this.$emit('close')
        },
        async save() {
            showLoading('保存中')
            const data = await this.messageSave({
                ...this.form,
                id: this.formData.id
            })
            if(data.success) {
                this.$message({
                    type: 'success',
                    message: '保存成功'
                })
                this.$emit('close')
            }
            hideLoading()
            this.$emit('search')
        },
        handleClose() {
            this.$emit('close')
        }
    },
}
</script>

<style>
.title {
    line-height: 24px;
    font-size: 18px;
    color: #303133;
    font-weight: 400;
}
</style>