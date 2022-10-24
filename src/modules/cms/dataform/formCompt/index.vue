<template>
<!-- 留资表单 -->
    <div class="from_component">
        <!-- <input onkeyup="value=value.replace(/[\<\>\'\%\;\)\(\&\+]/g,'')"
        onpaste="value=value.replace(/[\<\>\'\%\;\)\(\&\+]/g,'')"
        oncontextmenu = "value=value.replace(/[\<\>\'\%\;\)\(\&\+\]/g,'')"> -->
        <div class="top_btn">
            <el-button type="primary" @click="addForm">新增字段</el-button>
        </div>
        <el-table
            ref="fromlist"
            :data="formTableData"
            style="width: 100%"
        >
            <el-table-column label="序号" width="50">
                <template slot-scope="scope"> {{scope.$index+1}} </template>
            </el-table-column>
            <el-table-column prop="fieldName" label="字段名称" width="180"> </el-table-column>
            <el-table-column prop="displayName" label="显示名称" width="180"></el-table-column>
            <el-table-column label="字段类型">
                <template slot-scope="scope">
                    <!-- <span v-if="scope.row.fieldType == 0">文本框</span> -->
                    <span v-if="scope.row.fieldType == 1">单选框</span>
                    <span v-else-if="scope.row.fieldType == 2">多选框</span>
                    <span v-else-if="scope.row.fieldType == 3">时间</span>
                    <span v-else-if="scope.row.fieldType == 4">输入框</span>
                </template>
            </el-table-column>
            <el-table-column prop="describe" label="描述"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="formEdit(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="formCopy(scope.row)">复制</el-button>
                    <el-button type="text" size="small" @click="formDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :title="titles[addTitleType]"
            :visible.sync="addVisible"
            :close-on-click-modal="false"
            width="50%"
            @close="handleClose"
        >
            <el-form ref="fomAddInfo" :rules="formDataRules" label-width="80px" :model="addInfo">
                <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="12">
                        <el-form-item label="字段名称" prop="fieldName">
                            <el-input v-model="addInfo.fieldName" placeholder="请输入字段名称" clearable maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="长度">
                            <el-input v-model="addInfo.fieldLength" placeholder="请输入长度" clearable maxlength="5" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="12">
                        <el-form-item label="显示名称" prop="displayName">
                            <el-input v-model="addInfo.displayName" placeholder="请输入显示名称" clearable maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="默认值">
                            <el-input v-model="addInfo.defaultValue" placeholder="请输入默认值" clearable maxlength="30" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="12">
                        <el-form-item label="描述">
                            <el-input v-model="addInfo.describe" placeholder="请输入描述" clearable maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示类型">
                            <el-select v-model="addInfo.fieldType" placeholder="请选择显示类型" clearable @change="showWidgetType">
                                <el-option v-for="item in widgetList" :key="item.key" :label="item.label" :value="item.key"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item v-if="showEnumerate" label="枚举值" prop="enumJson" class="enumerate">
                            <el-table border size="mini" height="210" :data="addInfo.enumJson" @row-dblclick="dbclick">
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
            </el-form>
            
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="serveAdd">保 存</el-button>
                <el-button @click="addVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
// $("#foo_ss_key").on('input', function(){
//     var _vals = $("#foo_ss_key")
//     _vals.val(_vals.val().replace(/[><"'%;)(&+]/, ""))
// })
</script>
<script>
import { mapActions } from 'vuex'
import { matchCode } from "@/utils/RegExpUtil";
export default {
    data() {
        return {
            formTableData: [],
            value: '',
            addVisible: false,
            addTitleType: '0',
            titles: ['新增字段', '编辑字段', '复制字段'],
            addInfo: {
                fieldName: '', // 字段名称
                fieldLength: 0, // 长度
                displayName: '', // 显示名称
                defaultValue: '', // 默认值
                fieldType: '', // 字段类型
                describe: '', // 描述
                enumJson: []
            },
            formDataRules: { // 表单验证规则
                fieldName: [{ required: true, message: "字段名称为必填项", trigger: "blur" },
                    {validator: function(rule, value, callback) {
                        if (value && !matchCode(value)) {
                            callback("表单名称只能输入数字、字母、下划线");
                        } else {
                            callback();
                        }
                    }}
                ],
                displayName: [{required: true, message: "显示名称为必填项", trigger: "blur"}]
            },
            showEnumerate: false,
            showEdit: false,
            widgetList: [
                {
                    key: 4,
                    label: "输入框"
                },
                {
                    key: 3,
                    label: "时间"
                },
                {
                    key: 2,
                    label: "多选框"
                },
                {
                    key: 1,
                    label: "单选框"
                },
            ]
            
        }
    },
    watch:{
        addVisible(newval) {
            if(newval) {
                this.showWidgetType()
            }
        }
    },
    mounted(){
        console.log('重新渲染组件1')
        this.queryTablelist({})
    },
    methods:{
        ...mapActions('cms/dataform',['getFieldList','getyzFieldSave', 'getyzFieldDel']),

        queryTablelist(){
            this.getFieldList({page: 1, limit: 999}).then(res => {
                console.log('数据:', res)
                if(res.success){
                    res.data.forEach(ele => {
                        ele.enumJson = ele.enumJson ? JSON.parse(ele.enumJson) : []
                    });
                    
                    this.formTableData = res.data
                } else {
                    this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                }
            })
        },
        // 新增字段
        addForm(){
            this.addVisible = true
            this.addTitleType = '0'
        },
        // 留资表单——编辑
        formEdit(row) {
            this.addInfo = JSON.parse(JSON.stringify(row))
            this.addVisible = true
            this.addTitleType = '1'
        },
        // 留资表单——复制
        formCopy(row) {
            // console.log('复制',row)
            this.addInfo = JSON.parse(JSON.stringify(row))
            this.addVisible = true
            this.addTitleType = '2'
        },
        // 留资表单——删除
        formDelete(row) {
            // console.log('删除',row)
            let params = {
                ids: [row.id]
            }
            this.getyzFieldDel(params).then(res => {
                if(res.success) {
                    this.queryTablelist()
                    this.$message.success(res.data)
                } else {
                    this.$message.error(res.data||res.errMsg||'服务器繁忙，请稍后再试！')
                }
            })
        },
        // 保存新增字段
        serveAdd() {
            this.$refs.fomAddInfo.validate(valid => {
                if (!valid) {
                    return false;
                }
            
                let {fieldName, fieldLength ,displayName, defaultValue,
                    fieldType, describe, enumJson, id=''
                } = this.addInfo
                let enumArr = fieldType == 3 ? '' : enumJson.length > 0 ? JSON.stringify(enumJson) : ''
                let params = {
                    fieldName, // 字段名称
                    fieldLength, // 长度
                    displayName, // 显示名称
                    defaultValue, // 默认值
                    fieldType, // 字段类型
                    describe, // 描述
                    enumJson: enumArr
                }
                if(this.addTitleType == '1') {
                    params.id = id
                }
                console.log('params11',params)
                this.getyzFieldSave(params).then(res => {
                    console.log('新增字段:', res)
                    if(res.success) {
                        this.queryTablelist()
                        this.addVisible = false
                        this.$message.success(res.data)
                    } else {
                        this.$message.error(res.errMsg||'服务器繁忙，请稍后再试！')
                    }
                }).catch(error => {
                    this.$message.error(error||'服务器繁忙，请稍后再试！')
                })
            })
        },

        // 选择显示类型
        showWidgetType(){
            let { fieldType } = this.addInfo
            this.showEnumerate = fieldType == 1 || fieldType == 2 ? true : false
        },
        //新增枚举值
        addEnumerate() {
            this.addInfo.enumJson.push({ key: "", label: "" });
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
            this.addInfo.enumJson.splice(index, 1);
        },
        // 新增弹窗关闭
        handleClose(){
            this.addInfo = this.$options.data().addInfo
            this.$refs.fomAddInfo.resetFields()
            // this.$emit("close", this.needReload);
        }
    }
}
</script>
<style lang="scss" scoped>
.from_component{
    .top_btn{
        text-align: right;
    }
}
</style>