<!--数据聚合--> lint-staged
<template>
    <div>
        <div class="header">
            <el-form label-width="80px" class="from">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="规则名称">
                            <el-input v-model="form.name" placeholder="请输入查询规则名称" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item class="btn">
                            <el-button type="primary" icon="el-icon-search" @click="searchList">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="pop">
            <el-dialog :title="title + '数据规则'" :visible.sync="batchAdoptVisible" width="50%" center @close="closeDialog">
                <el-row>
                    <el-form ref="ruledatch" :model="forwardData" :rules="forwarRules" label-width="80px">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="forwardData.name" placeholder="请输入规则名称" maxlength="50" style="width: 725px" clearable/>
                        </el-form-item>
                        <el-form-item label="编码" prop="code">
                            <el-col :span="21">
                                <el-input v-model="forwardData.code" placeholder="请输入编码" maxlength="20" clearable/>
                            </el-col>
                            <el-col :span="1">
                                <el-tooltip content="编码只允许输入数字、大小写字母、特殊字符( - _ )" >
                            <i class="el-icon-question"></i>
                        </el-tooltip>

                            </el-col>
                        </el-form-item>
                        <el-form-item label="权限" required>
                            <el-radio-group v-model="forwardData.jurisdiction">
                                <el-radio label="公共"></el-radio>
                                <el-radio label="私有"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="类型" prop="type">
                            <el-select v-model="forwardData.type" placeholder="请选择类型" style="width:87%" clearable>
                                <el-option label="JSON数据" value="JSON数据"></el-option>
                                <el-option label="动态" value="动态"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="规则" prop="rule">
                            <el-input
                                v-model="forwardData.rule"
                                placeholder="请输入规则"
                                type="textarea"
                                :rows="8"
                                maxlength="1000"
                                style="width:87%"
                                show-word-limit
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </el-row>
                <div slot="footer">
                    <el-button type="primary" @click="batchAdoptclick">保存</el-button>
                    <el-button @click="batchAdoptVisible = false">取消</el-button>
                </div>
            </el-dialog>
        </div>
        <div class="Table">
            <el-button type="primary" @click="batch(0)">新增</el-button>
            <el-table
                ref="Tabledata"
                tooltip-effect="dark"
                style="width: 100%"
                max-height="595"
                row-key="id"
                :data="data"
                :row-style="{ height: '54px' }"
                :cell-style="{ padding: '0' }"
                :header-cell-style="{ 'text-align': 'center' }"
            >
                >
                <el-table-column label="序号" width="60" type="index" align="center" />
                <el-table-column prop="name" label="名称" align="center" />
                <el-table-column prop="code" label="编码" align="center" />
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="batch(scope.row.id)">修改</el-button>
                        <el-button type="danger" size="mini" @click="forward(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="paganition">
            <el-pagination
                :total="total"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="100"
                :pager-count="5"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { showLoading, hideLoading, confirm } from "@/utils";
import { mapActions } from "vuex";
export default {
    data() {
        return {
            form: {
                name: ""
            },
            title: "新增",
            data: [],
            appid: null,
            total: 0,
            limit: 10,
            page: 1,
            currentPage: 1,
            forwarRules: {
                name: [
                    {
                        required: true,
                        message: "请选择处理人",
                        trigger: "blur"
                    }
                ],
                code: [
                    { required: true, message: "资源编码不能为空" },
                    {
                        validator: function(rule, value, callback) {
                            let reg = new RegExp(/^[\w-]*$/)
                            if (!reg.test(value)) {
                                callback("只允许输入数字、字母、特殊字符( - _ )");
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                rule: [
                    {
                        required: true,
                        message: "请输入规则",
                        trigger: "blur"
                    }
                ],
                type: [
                    {
                        required: true,
                        message: "请选择类型",
                        trigger: "blur"
                    }
                ]
            },
            forwardData: {
                name: "",
                code: "",
                rule: "",
                type: "JSON数据",
                jurisdiction: ""
            },
            batchAdoptVisible: false,
            rowdata: {}
        };
    },
    watch: {
        batchAdoptVisible(v) {
            if (!v) {
                this.forwardData.name = "";
                this.forwardData.code = "";
                this.forwardData.rule = "";
                this.forwardData.type = "JSON数据";
                this.forwardData.jurisdiction = "";
                this.rowdata = {};
            }
        }
    },
    created() {
        this.appid = JSON.parse(sessionStorage.getItem("SITE")).id;
        this.searchList();
    },

    methods: {
        ...mapActions("cms/collect", ["getlist", "collsave", "colldetail", "colldel"]),
        async searchList() {
            showLoading(true);
            let res = await this.getlist({
                name: this.form.name,
                page: this.page,
                limit: this.limit
            });
            this.data = res.data;
            this.total = res.count;
            hideLoading();
        },
        closeDialog(){
            this.rowdata= {}
            this.$refs.ruledatch.resetFields()
        },
        getLog(id) {
            this.batchdata.activeName = "first";
            this.getReviewerLog({ id }).then(result => {
                this.batchdata.reviewerList = result;
                this.centerDialogVisible = true;
            });
        },
        // 修改、新增
        async batch(id) {
            if (!id) {
                this.title = "新增";
                this.rowdata = {
                    app: this.appid,
                    code: "",
                    id: null,
                    name: "",
                    rule: "",
                    type: 0
                };
            } else {
                this.title = "修改";
                let res = await this.colldetail({id})
                this.rowdata = res.data;
                this.forwardData.code = this.rowdata.code;
                this.forwardData.name = this.rowdata.name;
                this.forwardData.rule = this.rowdata.rule;
                if(this.rowdata.type===1){
                    this.forwardData.type = 'JSON数据';
                }else{
                    this.forwardData.type = '动态';
                }
            }
            if (this.rowdata.app) {
                this.forwardData.jurisdiction = "私有";
            } else {
                this.forwardData.jurisdiction = "公共";
            }
            this.batchAdoptVisible = true;
        },
        // 删除
        async forward(id) {
            confirm("您确认删除吗？", "警告", {
                ok: async () => {
                    showLoading(true, "正在删除...");
                    let res = await this.colldel({ id });
                    if (res.success) {
                        this.$message({
                            type: "success",
                            message: res.errMsg
                        });
                        this.searchList();
                    } else {
                        this.$message.error("删除失败");
                    }
                    hideLoading();
                }
            });
            // this.userData = res.data;
        },
        // 保存
        batchAdoptclick() {
            this.$refs.ruledatch.validate(async valid => {
                if (!valid) {
                    return false;
                }
                this.rowdata.code = this.forwardData.code;
                this.rowdata.name = this.forwardData.name;
                this.rowdata.rule = this.forwardData.rule;
                if(this.forwardData.type=='JSON数据'){
                    this.rowdata.type = 1
                }else{
                    this.rowdata.type = 2
                }
                if (this.forwardData.jurisdiction === "公共") {
                    this.rowdata.app = 0;
                } else {
                    this.rowdata.app = this.appid;
                }
                let res = await this.collsave({
                    ...this.rowdata
                });
                if (res.success) {
                    this.$message({
                        type: "success",
                        message: res.errMsg
                    });
                    this.batchAdoptVisible = false;
                    this.searchList();
                } else {
                    this.$message.error("保存失败");
                }
            });
        },
        // 分页limit改变
        handleSizeChange(val) {
            this.limit = val;
            this.searchList();
        },
        // 分页跳转
        handleCurrentChange(val) {
            this.page = val;
            this.searchList();
        }
    }
};
</script>
<style lang="scss" scoped>
.paganition {
    text-align: right;
    margin: 10px;
}

.popform > .tit {
    display: flex;
    margin-bottom: 10px;
}
.popform > .tit > span {
    width: 50px;
    margin-top: 2px;
}
.poptitle {
    flex: 1;
}
.poptitle span {
    display: inline-block;
    vertical-align: text-top;
    width: 75%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-right: 3%;
}

.flex {
    display: flex;
    justify-content: space-between;
}
.el-col {
    margin-bottom: 5px;
}
.el-collapse {
    border: none;
}
.el-collapse-item__content {
    padding: 0;
}
.content {
    border: 1px solid #e7e6e6;
    padding: 5px;
}
.collapse {
    padding: 0 5px;
}
/deep/ .el-textarea__inner{
    resize: none;
}
/deep/ .el-form-item__content{
    display: flex;
    margin-left: 0!important;
    margin-top: 10px;
}
</style>
