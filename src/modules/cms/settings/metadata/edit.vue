<template>
    <div>
        <div class="search">
            <div style="float:left" class="searchTitle">自定义表单{{ title }}</div>
        </div>
        <div>
            <div style="margin-bottom:10px;font-weight: bold">基本信息：</div>
            <el-form ref="searchForm" :rules="searchFormRules" label-width="100px" inline :model="editDataList">
                <el-form-item label="表单名称：" prop="name">
                    <el-input v-model="editDataList.name" clearable maxlength="30" style="width: 350px" placeholder="请输入表单名称"
                              :disabled="readonly"
></el-input>
                </el-form-item>
                <el-form-item label="显示名称：" prop="alias">
                    <el-input v-model="editDataList.alias" clearable maxlength="30" style="width: 350px" placeholder="请输入显示名称"></el-input>
                </el-form-item>
                <el-form-item label="表单状态：" prop="status">
                    <el-radio-group v-model="editDataList.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!--
                <el-form-item label="表单类型" prop="type" >
                    <el-select v-model="editDataList.type" placeholder="请选择表单类型">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                -->
                <el-form-item label="描述：" prop="remark">
                    <el-input
                        v-model="editDataList.remark"
                        clearable
                        type="textarea"
                        style="width: 350px"
                        maxlength="200"
                        placeholder="请输入描述"
                    ></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div style="border-top: 1px solid #CCC; padding-top: 20px; margin-bottom: 20px;font-weight: bold">字段信息：</div>
        <div>
            <div style="margin-bottom: 15px">
                <el-button type="primary" icon="el-icon-plus" size="small" @click="addForm">添加</el-button>
                <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="delForm">删除</el-button> -->
            </div>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="默认字段：" name="1">
                    <TableRow :has-form="true" :has-pagination="true" :has-form-border="false">
                        <el-table :data="publishTypeList" size="mini" border>
                            <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                            <el-table-column label="显示名称" align="center" prop="alias"></el-table-column>
                            <el-table-column label="显示类型" align="center">
                                <template v-slot="{row}">
                                    {{replace(row.widget)}}
                                </template>
                            </el-table-column>
                            <el-table-column label="字段名称" align="center" prop="name"></el-table-column>
                            <el-table-column label="字段类型" align="center" prop="type">
                                <template v-slot="{ row }">
                                    <span v-if="row.type === 'CHAR'">字符串型</span>
                                    <span v-if="row.type === 'NUMBER'">数值型</span>
                                    <span v-if="row.type === 'DATE'">时间类型</span>
                                    <span v-if="row.type === 'BOOL'">布尔类型</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="长度" align="center" prop="len"></el-table-column>
                            <el-table-column label="精度" align="center" prop="precision"></el-table-column>
                        </el-table>
                        <!--
                        <el-table v-else :data="submitTypeList" border>
                            <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                            <el-table-column label="显示名称" align="center" prop="alias"></el-table-column>
                            <el-table-column label="显示类型" align="center" prop="widget">
                                <template v-solt="{row}">SYSTEM</template>
                            </el-table-column>
                            <el-table-column label="字段名称" align="center" prop="name"></el-table-column>
                            <el-table-column label="字段类型" align="center" prop="type">
                                <template v-slot="{row}">
                                    <span v-if="row.type === 'CHAR'">字符串型</span>
                                    <span v-if="row.type === 'NUMBER'">数值型</span>
                                    <span v-if="row.type === 'DATE'">时间类型</span>
                                    <span v-if="row.type === 'BOOL'">布尔类型</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="长度" align="center" prop="len"></el-table-column>
                            <el-table-column label="精度" align="center" prop="precision"></el-table-column>
                        </el-table>
                        -->
                    </TableRow>
                </el-collapse-item>
            </el-collapse>
            <div class="titleType">自定义字段：</div>
            <TableRow :has-form="true" :has-pagination="true" :has-form-border="false" class="customField">
                <el-table ref="table" :data="fieldList" row-key="id" size="mini" border @selection-change="selectRow">
                    <!-- <el-table-column fixed type="selection" width="40"></el-table-column> -->
                    <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                    <el-table-column label="显示名称" align="center" prop="alias"></el-table-column>
                    <el-table-column label="显示类型" align="center">
                        <template v-slot="{row}">
                            {{replace(row.widget)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="字段名称" align="center" prop="name"></el-table-column>
                    <el-table-column label="字段类型" align="center" prop="type">
                        <template v-slot="{ row }">
                            <span>{{ optionsType[row.type] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="长度/精度" align="center" prop="len">
                        <template v-slot="{ row }">
                            <span>{{ row.len }}（{{ row.precision }}）</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="显示(列表/查询/编辑)" align="center" width="140">
                        <template v-slot="{ row }">
                            <span v-if="row.inList === 'false'">否</span>
                            <span v-else-if="row.inList === 'true'">是</span>
                            /
                            <span v-if="row.inQuery === 'false'">否</span>
                            <span v-else-if="row.inQuery === 'true'">是</span>
                            /
                            <span v-if="row.inEdit === 'false'">否</span>
                            <span v-else-if="row.inEdit === 'true'">是</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" min-width="80">
                        <template v-slot="{ row, $index }">
                            <el-button-group class="tiny">
                                <el-button type="primary" size="mini" @click="_edit(row, $index)">修改</el-button>
                                <el-button type="danger" size="mini" @click="_delete(row, $index)">删除</el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
            </TableRow>
        </div>
        <div>
            <div style="margin-top: 20px; text-align:center" class="tiny">
                <el-button type="primary" style="margin-right: 15px" size="small" @click="save">保存</el-button>
                <el-button type="primary" size="small" @click="_back">返回</el-button>
            </div>
        </div>
        <EditModal v-bind="edit" @addData="addData" @editData="editData" @close="closeEditModal" />
    </div>
</template>

<script>
import EditModal from "./addmeta";
import { mapActions, mapState } from "vuex";
import { showLoading, showError, showMessage, confirm} from "@/utils";
import { matchCode } from "@/utils/RegExpUtil";
import Sortable from "sortablejs";
export default {
    //新建表单
    name: "",
    components: {
        EditModal
    },
    data() {
        const searchFormRules = {
            name: [
                { required: true, message: "表单名称为必填项,以 t_form_ 开头" },
                {
                    validator: function(rule, value, callback) {
                        if (value.slice(0,7) !== 't_form_') {
                            callback("表单名称只能以 t_form_ 开头");
                        } else if(!matchCode(value)) {
                            callback("表单名称只能输入数字、字母、下划线");
                        } else {
                            callback();
                        }
                    }
                }
            ],
            type: [{ required: true, message: "表单类型为必填" }]
        };
        return {
            searchFormRules,
            editDataList: {
                name: "t_form_",
                id:0,
                alias: "",
                remark: "",
                status: 1,
                type: "publish"
            },
            fieldList: [],
            searchForm: {},
            activeNames: "",
            recordName: "",
            $idnex: 0,
            title: "新增",
            selectIds: [],
            edit: {
                visible: false,
                publishTypeList:[],
                info: {},
                type: "",
                id: 0,
                fieldList: []
            },
            formData: {},

            //模拟数据
            options: [
                {
                    value: "publish",
                    label: "发布"
                },
                {
                    value: "submit",
                    label: "提交"
                }
            ],
            //发布系统字段
            publishTypeList: [],

            //提交系统字段
            submitTypeList: [],
            optionsType: {
                CHAR: "字符串型",
                NUMBER: "数值型",
                DATE: "时间类型",
                BOOL: "布尔类型",
                TEXT: "文本型"
            },
            readonly:false
        };
    },
    computed: {
        ...mapState("cms/settings/metadata", ["data","ALL"])
    },
    watch: {
        "editDataList.name"(v){
            
        }
    },
    created() {
        this._systemList();
        this.$route.query.id&&this._loadFieldList(this.$route.query.id);
    },
    mounted() {
        this.rowDrop();
    },
    methods: {
        ...mapActions("cms/settings/metadata", ["metadataEdit", "metadataList", "systemList",'formDetail']),
        //列表
        _loadFieldList(id) {
            showLoading(true, "数据加载中...");
            this.formDetail({id})
                .then(data => {
                    this.editDataList.name = data.data.name;
                    this.editDataList.type = data.data.typeName;
                    this.editDataList.alias = data.data.alias;
                    this.editDataList.remark = data.data.remark;
                    this.editDataList.status = data.data.status;
                    this.editDataList.id =  data.data.id;
                    try {
                        this.fieldList = JSON.parse(data.data.params);
                    } catch {
                        this.fieldList = [];
                    }
                    if (this.$route.query.type === "edit") {
                        this.title = "修改";
                        this.readonly=true
                    } else {
                        this.title = "复制";
                        this.editDataList.id = 0;
                        this.editDataList.name = data.data.name + "_copy"
                    }
                    showLoading(false);
                })
                .catch(error => {
                    showLoading(false);
                    showError(error.message);
                });
        },
        //系统默认字段
        _systemList() {
            this.systemList()
                .then(data => {
                    this.publishTypeList = data.data;
                    this.edit.publishTypeList = data.data
                    this.submitTypeList = [];
                })
                .catch(error => {
                    showError(error.message);
                });
        },
        replace(v){
            let label = ''
            this.ALL.forEach(ele => {
                if(ele.key===v) label = ele.label
            });
            return label
        },
        //保存
        save() {
            this.$refs.searchForm.validate(valid => {
                if (!valid) {
                    return false;
                }
                if (this.recordName === this.editDataList.name) {
                    showMessage({
                        type: "warning",
                        message: `请先修改表单名称才能保存！`
                    });
                } else {
                    this.formData = { ...this.editDataList };
                    const params = JSON.stringify(this.fieldList);
                    this.formData.params = params;
                    showLoading(true, "正在保存");
                    this.metadataEdit({ ...this.formData })
                        .then(data => {
                            showMessage("保存成功");
                            this.$router.push({name:'worksheet'});
                            showLoading(false);
                        })
                        .catch(error => {
                            showLoading(false);
                            showError(error.message);
                        });
                }
            });
        },
        //返回
        _back() {
            this.$router.go(-1);
        },
        // 手动勾选数据行发生的事件
        selectRow(selection) {
            this.selectIds = selection;
        },
        //添加表单
        addForm() {
            this.edit.visible = true;
            this.edit.info = {};
            this.edit.type = "新增字段";
            this.edit.fieldList = this.fieldList;
            this.edit.publishTypeList = this.publishTypeList;
        },
        //删除表单
        delForm() {
            if(!this.selectIds.length){
                showError('请选择要删除的字段')
                return false
            }
            confirm(`确认删除选中的字段吗?`, "警告", {
                ok: () => {
                    this.fieldList = this.remove(this.fieldList, this.selectIds);
                }
            })
        },
        //修改
        _edit(row, $index) {
            this.$index = $index;
            this.edit.visible = true;
            this.edit.info = { ...row };
            this.edit.type = "修改字段";
            this.edit.fieldList = this.fieldList;
        },
        //删除
        _delete(row, $index) {
            confirm(`确认删除 ${row.alias} 此字段吗?`, "警告", {
                ok: () => {
                    this.fieldList.splice($index, 1);
                    showMessage("删除成功")
                }
            })
        },
        remove(arr1, arr2) {
            for (let i = 0; i < arr2.length; i++) {
                for (let j = 0; j < arr1.length; j++) {
                    if (arr2[i] === arr1[j]) {
                        let indexs = arr1.indexOf(arr1[j]);
                        arr1.splice(indexs, 1);
                    }
                }
            }
            return arr1;
        },
        //关闭弹窗
        closeEditModal(needReload) {
            this.edit.visible = false;
        },
        //新增字段
        addData(row) {
            this.fieldList.push(row);
        },
        //修改字段
        editData(row) {
            for (let [key, value] of Object.entries(row)) {
                this.fieldList[this.$index][key] = value;
            }
        },
        //行拖拽
        rowDrop() {
            const tbody = document.querySelector(".customField .el-table__body-wrapper tbody");
            const _this = this;
            Sortable.create(tbody, {
                onEnd({ newIndex, oldIndex }) {
                    const currRow = _this.fieldList.splice(newIndex, 1)[0];
                    _this.fieldList.splice(newIndex, 0, currRow);
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.search {
    margin-bottom: 15px;
    height: 50px;
    background: rgba(248, 248, 248, 1);
    border: 1px solid rgba(234, 234, 234, 1);
    border-radius: 6px 6px 6px 6px;
    line-height: 50px;
}
.searchTitle {
    font-size: 18px;
    font-weight: bold;
    font-size: 97%;
    color: rgba(23, 23, 23, 1);
    margin-left: 10px;
}
.titleType {
    border-bottom: 1px solid #e6ebf5;
    color: #303133;
    height: 48px;
    line-height: 48px;
    font-size: 13px;
}
/deep/ .el-textarea__inner{
    resize: none;
}
</style>
