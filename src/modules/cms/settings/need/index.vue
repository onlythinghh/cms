<!--需求评估--> 
<template>
    <div>
        <div class="header">
            <el-form ref="search" :model="searchForm" @submit.native.prevent>
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="名称" label-width="100px" prop="themeId">
                            <el-input v-model="searchForm.name" placeholder="请输入问卷名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                       <el-form-item class="btn" label-width="100px">
                            <el-button type="primary" size="medium" @click="searchList">查询</el-button>
                            <el-button size="medium" @click="resetForm">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div>
            <el-dialog title="新增需求评估" :visible.sync="addVisible" width="35%" center @close="closeDialog">
                <el-row>
                    <el-form ref="ruledatch" :model="addForm" :rules="addFormRules" label-width="80px" @submit.native.prevent>
                        <el-form-item label="名称" prop="name" label-width="100px">
                            <el-input v-model="addForm.name" placeholder="请输入名称" maxlength="10" style="width:87%" clearable/>
                        </el-form-item>
                    </el-form>
                </el-row>
                <div slot="footer">
                    <el-button type="primary" @click="batchAdoptclick">保存</el-button>
                    <el-button @click="closeDialog">取消</el-button>
                </div>
            </el-dialog>
        </div>
        <div>
            <el-button type="primary" @click="add(null)">新增</el-button>
            <el-button @click="_publish">发布</el-button>
            <el-table
                ref="Tabledata"
                tooltip-effect="dark"
                style="width: 100%"
                max-height="595"
                row-key="id"
                :data="list"
                :row-style="{ height: '54px' }"
                :cell-style="{ padding: '0' }"
                :header-cell-style="{ 'text-align': 'center' }"
                @selection-change="_handleSelectionChange" 
            >
                <el-table-column type="selection" width="55" />
                <el-table-column label="序号" width="60" type="index" align="center" />
                <el-table-column prop="name" label="名称" align="center" />
                <el-table-column label="创建时间" align="center" width="170px">
                    <template v-slot="{row}">
                        <span>{{row.createTime|dateFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createBy" label="创建人" align="center" />
                <el-table-column prop="code" label="发布状态" align="center">
                    <template v-slot="{row}">
                        <span :class="row.status!=='on'?'err':'ok'">{{row.statusLabel}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200" fixed="right">
                    <template v-slot="{row}">
                        <el-button type="text" size="mini" @click="add(row.id)">编辑</el-button>
                        <el-button type="text" size="mini" style="color:#f56c6c" @click="forward(row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { showLoading,showError, showMessage,hideLoading, confirm } from "@/utils";
import { mapActions } from "vuex";
export default {
    name:'Need',
    data() {
        return {
            addVisible: false,
            addForm:{
                name:null,
            },
            multipleSelected:[],
            addFormRules:{
                name:[{required: true,message: "名称不能为空",trigger: "blur"}],
            },
            searchForm: {
                name:'',
            },
            list:[],
        };
    },
    created() {
        this.searchList();
    },

    methods: {
        ...mapActions("cms/settings/need", ["schedulerList", "thsave","colldel","publish"]),

        async searchList() {
            showLoading(true);
            if(this.searchFormTime==null){
                this.searchFormTime = []
            }
            let res = await this.schedulerList({
                ...this.searchForm,
            });
            this.list = res.data;
            showLoading()
        },

        resetForm(){
            this.searchForm.name = ''
            this.searchList()
        },

        add(id){
            if(!id){
                this.addVisible = true
            }else{
                this.$router.push({ name: "NeedEdit" ,query:{id}});
            }
        },
        closeDialog(){
            this.addForm.name = ''
            this.addVisible = false
        },
        batchAdoptclick() {
            // 新增保存
            this.$refs.ruledatch.validate(async valid => {
                if (!valid) {
                    return false;
                }
                showLoading(true,'正在保存')
                let res = await this.thsave({
                    ...this.addForm,
                });
                if (res.success) {
                    this.$message({
                        type: "success",
                        message: res.errMsg
                    });
                    this.addVisible = false;
                    this.searchList();
                } else {
                    this.$message.error(res.errMsg);
                }
                showLoading()
            });
        },
        async forward(id) {
            confirm("您确认删除吗？", "警告", {
                ok: async () => {
                    showLoading("正在删除...");
                    let res = await this.colldel({ id,key:'assess' });
                    if (res.success) {
                        showMessage(res.errMsg || '删除成功')
                        this.searchList();
                    } else {
                        this.$message.error(res.errMsg||"删除失败");
                    }
                    hideLoading();
                }
            });
        },
        _handleSelectionChange(val) {
            this.multipleSelected = []
            val.forEach(el => {
                this.multipleSelected.push(el.id)
            });
        },
        async _publish(){
            if(this.multipleSelected.length!=1){
                return showMessage({ type: 'warning', message: '请选择一条需要发布的数据！' })
            }
            let {success,errMsg} = await this.publish({
                app:6182,
                assess:this.multipleSelected[0]
            })
            success?showMessage('发布成功'):showError(errMsg||'发布失败')
            this.searchList();
        }
    }
};
</script>
<style lang="scss" scoped>
.ok::before,
.err::before{
    content: '';
    width:5px;
    height: 5px;
    margin-right: 5px;
    display: inline-block;
    vertical-align: middle;
    border-radius: 50%;
    background-color:#67c23a;
}
.err::before{
    background-color: #ff4949;
}
/deep/ .sperr{
    color: #ff4949;
}
/deep/ .spok{
    color:#67c23a;
}
.flex{
    display: flex;
    cursor: default;
    justify-content: space-between;
    align-items: center;
    i:hover::before{
        cursor: pointer;
        color: #ff4949;
    }
}
</style>
