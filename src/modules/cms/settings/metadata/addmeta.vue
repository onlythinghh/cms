<template>
    <Modal :visible="modalVisible" :title="title" width="75%" @close="_closeModal">
        <el-form ref="editData" :rules="editDataRules" :model="editData" label-width="100px">
            <el-row class="meta">
                <el-col :span="10" style="height:615px">
                    <el-form-item label="数据库类型："></el-form-item>
                    <el-form-item label="字段名称" prop="name">
                        <el-input v-model="editData.name" maxlength="30" placeholder="请输入字段名称" clearable />
                    </el-form-item>
                    <el-form-item label="显示名称" prop="alias">
                        <el-input v-model="editData.alias" maxlength="30" placeholder="请输入显示名称" clearable/>
                    </el-form-item>
                    <el-form-item label="字段类型" prop="type">
                        <el-select v-model="editData.type" placeholder="请选择" clearable @change="showType">
                            <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="长度" prop="len">
                        <el-input v-model="editData.len" type="number" :disabled="disabledLen" maxlength="5" placeholder="请输入长度" clearable/>
                    </el-form-item>
                    <el-form-item label="精度" prop="precision">
                        <el-input v-model="editData.precision" :disabled="disabledPre" placeholder="请输入精度" clearable/>
                    </el-form-item>
                    <el-form-item label="是否唯一" prop="unique">
                        <el-radio-group v-model="editData.unique">
                            <el-radio label="true">是</el-radio>
                            <el-radio label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否为空" prop="empty">
                        <el-radio-group v-model="editData.empty">
                            <el-radio label="true">是</el-radio>
                            <el-radio label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否显示" prop="show">
                        <el-radio-group v-model="editData.show">
                            <el-radio label="true">是</el-radio>
                            <el-radio label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="showDefault" label="默认值" prop="def">
                        <el-radio-group v-if="editData.type === 'DATE'" v-model="editData.def" clearable>
                            <el-radio label="true">当前时间</el-radio>
                            <el-radio label="false">无</el-radio>
                        </el-radio-group>
                        <el-radio-group v-else-if="editData.type === 'BOOL'" v-model="editData.def" clearable>
                            <el-radio label="true">是</el-radio>
                            <el-radio label="false">否</el-radio>
                        </el-radio-group>
                        <el-input v-else v-model="editData.def" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="描述" maxlength="500" prop="desc">
                        <el-input v-model="editData.desc" placeholder="请输入描述" clearable/>
                    </el-form-item>
                </el-col>
                <el-col :span="14">
                    <el-form-item label="显示属性："></el-form-item>
                    <el-form-item label="显示类型" prop="widget">
                        <el-select v-model="editData.widget" placeholder="请选择显示类型" clearable @change="showWidgetType">
                            <el-option v-for="item in widgetList" :key="item.key" :label="item.label" :value="item.key"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="列表显示" prop="inList">
                        <el-radio-group v-model="editData.inList" :disabled="showWidget">
                            <el-radio label="true">是</el-radio>
                            <el-radio label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否必填" prop="required">
                        <el-radio-group v-model="editData.required" :disabled="showWidget">
                            <el-radio label="true">是</el-radio>
                            <el-radio label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否只读" prop="readonly">
                        <el-radio-group v-model="editData.readonly" :disabled="showWidget">
                            <el-radio label="true">是</el-radio>
                            <el-radio label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="作为查询" prop="inQuery">
                        <el-radio-group v-model="editData.inQuery" :disabled="showWidget">
                            <el-radio label="true">是</el-radio>
                            <el-radio label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="编辑显示" prop="inEdit">
                        <el-radio-group v-model="editData.inEdit" :disabled="showWidget">
                            <el-radio label="true">是</el-radio>
                            <el-radio label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-row v-if="showImage" class="imgClass">
                        <el-form-item label="大小">
                            <el-col :span="10" style="margin-right: 39px">
                                <el-input v-model="editData.width" maxlength="30">
                                    <template slot="prepend">宽</template>
                                </el-input>
                            </el-col>
                            <el-col :span="10">
                                <el-input v-model="editData.height" maxlength="30" style="margin-left: 20px">
                                    <template slot="prepend">高</template>
                                </el-input>
                            </el-col>
                        </el-form-item>
                    </el-row>
                    <el-form-item v-if="showEnumerate" label="枚举值" prop="enums" class="enumerate">
                        <el-table border size="mini" height="210" :data="editData.enums" @row-dblclick="dbclick">
                            <el-table-column label="键" prop="key">
                                <template v-slot="{ row }">
                                    <el-input v-if="showEdit" v-model="row.key" style="width:100%;hight:100%"></el-input>
                                    <span v-else>{{ row.key }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="显示" prop="label">
                                <template v-slot="{ row }">
                                    <el-input v-if="showEdit" v-model="row.label" style="width:100%;hight:100%"></el-input>
                                    <span v-else>{{ row.label }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot="header">
                                    <span style="margin-right: 10px">操作</span>
                                    <el-button type="primary" size="mini" @click="addEnumerate">新增</el-button>
                                </template>
                                <template slot-scope="scope">
                                    <div class="editBtn">
                                        <el-button type="primary" size="mini" @click="editEnumerate">修改</el-button>
                                        <el-button type="danger" size="mini" @click="deleteEnumerate(scope.$index)">删除</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-col>
            </el-row>

            <div style="text-align: center;margin-top: 20px">
                <el-button type="primary" style="margin-right: 20px" @click="_save">保存</el-button>
                <el-button type="danger" style="margin-right: 20px" @click="_reset">重置</el-button>
                <el-button @click="_cancel">取消</el-button>
            </div>
        </el-form>
    </Modal>
</template>
<script>
import { matchCode } from "@/utils/RegExpUtil";
import { showError } from "@/utils";
import { mapState } from 'vuex';
export default {
    // name: 'ArticleSourceEditModal',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        info: {
            type: Object,
            default: () => {}
        },
        close: {
            type: Function,
            default: () => {}
        },
        type: {
            type: String,
            default: ""
        },
        id: {
            type: Number,
            default: 0
        },
        fieldList: {
            type: Array,
            default: () => {}
        },
        publishTypeList:{
            type:Array,
            default:()=>{}
        }
    },
    data() {
        let repeat = async (rule, value, callback) => {
            let widget = this.editData.type
            if(widget!='BOOL'&&widget!='DATE'){
                callback(value ? (value[0]=='0'?new Error('长度不能已0开头'):
                    (value[0]=='-'?new Error('长度必须为整数'):'')) : new Error('长度不能为0'))
            }
        }
        return {
            editDataRules: {
                name: [{ required: true, message: "字段名为必填项",trigger: "blur" },
                    {validator: function(rule, value, callback) {
                        if (value && !matchCode(value)) {
                            callback("表单名称只能输入数字、字母、下划线");
                        } else {
                            callback();
                        }
                    }
                    }
                ],

                alias: [{ required: true, message: "显示名称必填项", trigger: "blur" }],
                type: [{ required: true, message: "字段类型为必填项", trigger: "blur" }],
                len: [{ required: true, message: "长度为必填项", trigger: "blur" },
                    { validator: repeat, trigger: "blur" },
                ],
                widget: [{ required: true, message: "显示类型必填项", trigger: "blur" }]
            },
            editData: {
                name: "",
                alias: "",
                type: "CHAR",
                len: 0,
                precision: 0,
                unique: "false",
                empty: "false",
                show: "true",
                def: "",
                desc: "",
                widget: "",
                inList: "true",
                required: "true",
                readonly: "true",
                inQuery: "true",
                inEdit: "true",
                width: "",
                hieght: "",
                enums: []
            },
            title: "新增字段",
            modalVisible: false,
            typeValue: "",
            modifier: false,
            disabledPre: false,
            disabledLen: false,
            showEdit: false,
            showWidget: false,
            showEnumerate: false,
            showImage: false,
            showDefault: true,
            widgetList:[]
        };
    },
    computed: {
        ...mapState("cms/settings/metadata", ["WidgetList","optionsType","ALL"]),
        vessel() {
            var arry = []
            arry = this.publishTypeList.map(i=>i.name)
            return arry.concat(this.fieldList
                .map(item => item.name)
                .filter(name => {
                    return !(this.type.indexOf("修改") > -1 && name === this.editData.name);
                }));
        }
    },
    watch: {
        visible(nextVisible) {
            this.modalVisible = nextVisible;
            this.needReload = false;
        },
        info(nextInfo) {
            if (nextInfo.name) {
                this.editData = JSON.parse(JSON.stringify(nextInfo));
                this.typeValue = this.editData.type;
                this.modifier = true;
            } else {
                this.modifier = false;
                this.editData = {
                    name: "",
                    alias: "",
                    type: "CHAR",
                    len: 0,
                    precision: 0,
                    unique: "false",
                    empty: "false",
                    show: "true",
                    def: "",
                    desc: "",
                    widget: "",
                    inList: "true",
                    required: "true",
                    readonly: "true",
                    inQuery: "true",
                    inEdit: "true",
                    width: "",
                    hieght: "",
                    enums: []
                };
            }
        },
        type(v) {
            this.title = v;
        },
        modalVisible(v){
            if(v){
                this.showWidgetType()
                this.showType(this.editData.type,true)
            }
        },
        "editData.type"(v) {
            if (v === "NUMBER") {
                this.disabledPre = false;
            } else {
                this.disabledPre = true;
            }
            if (v === "DATE" || v === "BOOL") {
                this.editData.len = 0;
                this.disabledLen = true;
                this.editData.def = "true";
            } else {
                this.disabledLen = false;
                this.editData.def = "";
            }
        }
    },
    methods: {
        showWidgetType() {
            this.showWidget = false
            this.editData.inEdit = "true"
            if (this.editData.widget === "SELECT" || this.editData.widget === "CHECKBOX"
             || this.editData.widget === "RADIO" ||this.editData.widget==="TAGS") {
                setTimeout(()=>{
                    this.showEnumerate = true;
                })
            } else {
                this.showEnumerate = false;
            }
            if(this.editData.widget ==='HIDDEN'){
                this.showWidget = true
                this.editData.inList = "false"
                this.editData.required = "false"
                this.editData.readonly = "false"
                this.editData.inQuery = "false"
                this.editData.inEdit = "false"
            }
            if (this.editData.widget === "IMAGE") {
                this.showImage = true;
            } else {
                this.showImage = false;
            }
        },
        showType(row,v) {
            switch (row) {
            case "CHAR":
                this.showDefault = true;
                this.showImage = false;
                this.showEnumerate = false;
                if (this.editData.widget && !v) {
                    this.editData.widget = "";
                }
                this.widgetList = [...this.WidgetList]
                break;
            case "NUMBER":
                this.showDefault = true;
                this.showImage = false;
                this.showEnumerate = false;
                if (this.editData.widget && !v) {
                    this.editData.widget = "";
                }
                this.widgetList = [
                    {
                        key: "TEXT",
                        label: "普通文本"
                    },
                    {
                        key: "HIDDEN",
                        label: "隐藏域"
                    },
                    {
                        key: "SELECT",
                        label: "下拉框"
                    },
                    {
                        key: "RADIO",
                        label: "单选框"
                    },

                ];
                break;
            case "DATE":
                this.showDefault = true;
                this.showImage = false;
                this.showEnumerate = false;
                if (this.editData.widget && !v) {
                    this.editData.widget = "";
                }
                this.widgetList = [
                    {
                        key: "HIDDEN",
                        label: "隐藏域"
                    },
                    {
                        key: "DATE",
                        label: "日期"
                    },
                    {
                        key: "TIME",
                        label: "时间"
                    },
                    {
                        key: "DATETIME",
                        label: "日期时间"
                    }
                ];
                break;
            case "BOOL":
                this.showDefault = true;
                this.showImage = false;
                this.showEnumerate = false;
                if (this.editData.widget && !v) {
                    this.editData.widget = "";
                }
                this.widgetList = [
                    {
                        key: "HIDDEN",
                        label: "隐藏域"
                    },
                    {
                        key: "RADIO",
                        label: "单选框"
                    }
                ];
                break;
            case "TEXT":
                this.showDefault = false;
                this.showImage = false;
                this.showEnumerate = false;
                if (this.editData.widget && !v) {
                    this.editData.widget = "";
                }
                this.widgetList = [
                    {
                        key: "TEXTAREA",
                        label: "文本域"
                    },
                    {
                        key: "RICHTEXT",
                        label: "富文本"
                    }
                ];
            }
        },
        //保存
        _save() {
            let Date = {...this.editData}
            this.$refs.editData.clearValidate()
            var _v = true
            if(Date.type=="BOOL"){
                if(Date.enums.length==2){
                    Date.enums.forEach(i=>{
                        if(i.key!='1' && i.key!='0'){
                            showError('键值为: 0,1')
                            _v = false
                            throw Error('键值为: 0,1');
                        }
                        if(!i.label){
                            showError("显示内容不能为空")
                            _v = false
                            throw Error('显示内容不能为空');
                        }
                    })
                }else{
                    showError('布尔类型必须有两个枚举值且键值为: 0,1');
                    Date.enums = [{key:0,label:''},{key:1,label:''}]
                    _v = false
                }
            }
            if(this.showEnumerate){
                if(Date.widget!=="TAGS"&&!Date.enums.length){
                    showError('请添加枚举值');
                    _v = false
                }
            }
            this.$refs.editData.validate(valid => {
                if (!valid) {
                    return false;
                }
                if(!_v){
                    return false
                }
                if(Date.widget=='HIDDEN' &&Date.def==''){
                    showError('隐藏域必须填写默认值');
                    return false
                }
                if (this.modifier) {
                    if (Date.type == "NUMBER") {
                        if (parseInt(Date.len) < parseInt(Date.precision)) {
                            showError('精度只能比长度小，且不能为负数！');
                        } else {
                            if (this.vessel.indexOf(Date.name) > -1) {
                                showError('字段名已存在，不能重复！');
                            } else {
                                this.$emit("editData", Date);
                                this._closeModal();
                            }
                        }
                    } else {
                        if (this.vessel.indexOf(Date.name) > -1) {
                            showError('字段名已存在，不能重复！');
                        } else {
                            this.$emit("editData", Date);
                            this._closeModal();
                        }
                    }
                } else {
                    if (Date.type == "NUMBER") {
                        if (parseInt(Date.len) < parseInt(Date.precision)) {
                            showError('精度只能比长度小，且不能为负数！');
                        } else {
                            if (this.vessel.indexOf(Date.name) > -1) {
                                showError('字段名已存在，不能重复！');
                            } else {
                                this.$emit("addData", Date);
                                this._closeModal();
                            }
                        }
                    } else {
                        if (this.vessel.indexOf(Date.name) > -1) {
                            showError('字段名已存在，不能重复！');
                        } else {
                            this.$emit("addData", Date);
                            this._closeModal();
                        }
                    }
                }
            });
        },
        //重置
        _reset() {
            this.editData = {
                name: "",
                alias: "",
                type: "CHAR",
                len: 0,
                precision: 0,
                unique: "false",
                empty: "false",
                show: "true",
                def: "",
                desc: "",
                widget: "",
                inList: "true",
                required: "true",
                readonly: "true",
                inQuery: "true",
                inEdit: "true",
                width: "",
                hieght: "",
                enums: []
            };
        },
        //取消
        _cancel() {
            // this.vessel = []
            this.modalVisible = false;
            this.editData = this.info;
            this.$emit("close", this.needReload);
        },
        //关闭弹窗
        _closeModal() {
            // this.vessel = []
            this.editData = this.info;
            this.$refs.editData.resetFields()
            this.$emit("close", this.needReload);
        },
        //新增枚举值
        addEnumerate() {
            this.editData.enums.push({ key: "", label: "" });
        },
        //双击表格
        dbclick(row, event, column) {
            this.showEdit = !this.showEdit;
        },
        //修改表格
        editEnumerate() {
            this.showEdit = true;
        },
        //删除表格
        deleteEnumerate(index) {
            this.editData.enums.splice(index, 1);
        }
    }
};
</script>
<style lang="scss" scoped>
/deep/ .el-select {
    width: 100%;
}
/deep/ .imgClass {
    .el-input__inner {
        padding-right: 15px;
    }
}
/deep/ .enumerate {
    .el-form-item__content {
        line-height: 26px !important;
    }
    .el-input__inner {
        padding-left: 5px;
        padding-right: 5px;
    }
}
/deep/ .el-button--mini {
    padding: 5px 7px !important;
}
/deep/ .meta {
    .el-col-10 {
        padding-right: 30px;
        border-right: 1px solid #dcdfe6;
    }
}
</style>
