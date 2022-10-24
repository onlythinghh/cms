<template>
    <div class="guidance">
        <div class="header">
            <el-form ref="form" :inline="true" label-width="50px">
                <el-form-item label="名称">
                        <el-input v-model="name"></el-input>
                </el-form-item>
                <el-form-item style="margin-left: 50px;">
                    <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="btngroup" style="margin:24px 0;">
            <el-button type="primary" @click="edit">新增</el-button>
            <el-button type="primary" @click="_return">返回</el-button>
        </div>
        <div class="table">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="index" label="序号" width="80" align="center">
                </el-table-column>
                <el-table-column label="名称" align="center" prop="name">
                </el-table-column>
                <el-table-column label="类型" align="center" prop="type">
                    <template slot-scope="scope">
                        <div v-if="scope.row.type==1">水印</div>
                        <div v-else>签名</div>
                    </template>
                </el-table-column>
                <el-table-column prop="pic" label="图片" align="center">
                    <template slot-scope="scope">
                        <div>
                            <img :src="scope.row.pic.url" style="height: 100px;width: 100px;object-fit: cover;"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                 <template slot-scope="scope">
                     <div>
                         <el-button type="text" @click="update(scope.row)">修改</el-button>
                         <el-button type="text" @click="del(scope.row)">删除</el-button>
                     </div>
                 </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination
            :page-sizes="[10, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            >
            </el-pagination>
        </div>
        <el-dialog title="新增" :visible.sync="dialog" :before-close="closeDialog">
            <el-form ref="dialogForm" :model="form" :rules="rules">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-col :span="12">
                        <el-input v-model="form.name" autocomplete="off" style="width:100%" clearable></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-col :span="12">
                        <el-radio v-model="form.type" :label="1">水印</el-radio>
                        <el-radio v-model="form.type" :label="2">签名</el-radio>
                    </el-col>
                </el-form-item>
                <el-form-item label="图片" :label-width="formLabelWidth" prop="imageUrl1">
                    <el-col :span="12">
                        <el-popover
                        placement="right"
                        width="525"
                        trigger="click"
                        >
                            <img :src="form.imageUrl1" style="width: 500px;">
                            <el-upload
                            slot="reference"
                            class="avatar-uploader"
                            action
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-change="_selectFile"
                            :http-request="_uploadImage1"
                            >
                            <img v-if="form.imageUrl1" :src="form.imageUrl1" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-popover>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="_save">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapActions} from "vuex";
import { showLoading, hideLoading, confirm  } from "@/utils";
import { showError, showMessage } from '../../../../utils';
export default {
    data() {
        return {
            form: {
                id:null,
                name: '',
                type: 1,
                pic:{},
                imageUrl1: '',

            },
            name:'',
            formLabelWidth: '120px',
            file:'',
            matter: [
                {
                    label: '车辆出入',
                    value: 11
                },
                {
                    label: '车辆恢复',
                    value: 12
                },
                {
                    label: '门禁',
                    value: 13
                }
            ],
            ids: [],
            dialog: false,
            tableData: [],
            page: 1,
            limit: 10,
            total: 0,
            type: '',
            rules:{
                name:[{ required: true, message: '请输入名称', trigger: 'blur' },],
                imageUrl1:[{ required: true, message: '请选择图片', trigger: 'blur' },],
            }
        }
    },
    created() {
        this.search()
    },
    methods: {
        ...mapActions('cms/settings/guidance',['saveWatermark','getWatermark','deletWatermark','uploadFile']),
        // 关掉dialog
        closeDialog() {
            this.dialog = false
            this.form.id = null
            this.form.name = ''
            this.form.pic = {}
            this.form.type = 1
            this.form.typeName = ''
            this.form.imageUrl1 = ''
        },
        _save(){
            this.$refs.dialogForm.validate(async(valid) => {
                if (!valid) {
                    return false
                } 
                showLoading('正在保存中...')
                const data = await this.saveWatermark({
                    ...this.form
                })
                if(data.success){
                    showMessage(data.errMsg)
                    // this.dialog = false
                    this.search()
                    this.closeDialog()
                }else{
                    showError(data.errMsg)
                }
                hideLoading()
            })
        },
        // 修改
        update(row) {
            this.form = {...row}
            this.form.imageUrl1 = row.pic.url
            this.dialog = true
        },
        // 删除
        async del(row) {
            confirm('确认删除吗?','警告',{
                ok: async () => {
                    showLoading('删除中...')
                    const data = await this.deletWatermark({
                        id: row.id
                    })
                    hideLoading()
                    if(data.success) {
                        this.search()
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                    }
                }
            })
        },
        // 查询
        async search() {
            showLoading('正在查询中...')
            const data = await this.getWatermark({
                page: this.page,
                limit: this.limit,
                name:this.name
            })
            hideLoading()
            this.tableData = data.data
            this.total = data.count
        },
        edit(){
            this.dialog = true
        },
        beforeAvatarUpload(file) {
            const type = file.type
            // if(type !== 'image/png') {
            //     this.$message.error('只能上传png格式的图片');
            // }
            const isLt2M = file.size / 1024 / 1024 < 20;
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isLt2M && type;
        },
        handleAvatarSuccess(res, file) {
            if(res.data.success){
                this.form.imageUrl1= ""
                this.form.imageUrl1 = res.data.data.url;
                this.form.pic.id = res.data.data.id
                this.$forceUpdate()
            }else{
                this.$message({
                    type: "error",
                    message: "上传失败",
                })
            }
            hideLoading()
        },
        _selectFile(file) {
            this.file = file
        },
        async _uploadImage1(uploadData) {
            showLoading("图片上传中")
            const file = uploadData.file
            return await this.uploadFile({
                file: file,
            })
        },
        _return(){
            this.$router.push({ name: "guidance" });
        },
        handleSizeChange(v) {
            this.limit = v
            this.search()
        },
        handleCurrentChange(v) {
            this.page = v
            this.search()
        },
    },
}
</script>

<style lang="scss" scoped>
.people {
    cursor: pointer;
}
.pagination {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 16px;
    box-sizing: border-box;
}
 /deep/ .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    /deep/ .avatar-uploader {
        width: 178px;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
