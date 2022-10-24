<template>
    <Modal :title="(isAdd ? '新增' : '修改') + '数据字典'" :visible="modalVisible" @close="_closeCall">
        <el-form ref="dictForm" :model="dictForm" :rules="dictFormRules" label-width="100px">
            <el-row>
                <el-form-item label="字典名称" prop="name">
                    <el-col :span="18">
                        <el-input v-model="dictForm.name" placeholder="数据字典名称" maxlength="20" clearable/>
                    </el-col>
                </el-form-item>
                <el-form-item label="字典编码" prop="code">
                    <el-col :span="18">
                        <el-input v-model="dictForm.code" placeholder="数据字典编码" maxlength="20" clearable/>
                    </el-col>
                </el-form-item>
                <el-form-item label="父级字典" prop="pid" class="dict-parent">
                    <el-col :span="18">
                        <TreeSelect
                            ref="testSelect"
                            v-model="dictForm.pid"
                            placeholder="选择父级字典"
                            :options="options"
                            :checked-on-click="true"
                            text-prop="label"
                            clearable
                        />
                    </el-col>
                </el-form-item>
                <el-form-item label="字典数据" prop="val">
                    <el-col :span="18">
                        <el-input v-model="dictForm.val" placeholder="字典数据" maxlength="200" clearable/>
                    </el-col>
                </el-form-item>
                <el-form-item label="字典排序" prop="sort" class="dict-sort">
                    <el-col :span="18">
                        <el-input-number
                            v-model="dictForm.sort"
                            :controls="false"
                            :min="0"
                            :max="100"
                            placeholder="字典排序"
                            maxlength="3"
                        />
                    </el-col>
                </el-form-item>
                <el-form-item label="描述" prop="descript">
                    <el-col :span="18">
                        <el-input
                            v-model="dictForm.descript"
                            type="textarea"
                            placeholder="描述"
                            maxlength="200"
                            rows="3"
                        />
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="save">确认</el-button>
                    <el-button @click="_closeModal(false)">取消</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </Modal>
</template>
<style lang="scss" >
.dict-sort .el-input-number {
    width: 100%;
    .el-input__inner {
        text-align: left !important;
    }
}
.dict-parent .el-cascader {
    width: 100%;
}
</style>


<script>
import { mapState, mapActions } from 'vuex'
import { matchName, matchExtraCode } from '../../../utils/RegExpUtil'
import { deepCopy } from '../../../utils/BaseUtil'
import { showLoading, showMessage, showError } from '../../../utils';
export default {
    name: 'DictEdit',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        isAdd: {
            type: Boolean,
            default: true
        },
        info: {
            type: Object,
            default: () => { }
        },
        close: {
            type: Function,
            default: () => { }
        }
    },
    data() {
        const defaultDictForm = {
            id: null,
            name: '',
            code: '',
            pid: '',
            sort: 1,
            val: '',
            descript: '',
            pids: []
        }
        const dictFormRules = {
            name: [
                { required: true, message: '字典名称不能为空' },
                {
                    validator: function (rule, value, callback) {
                        if (!matchName(value)) {
                            callback('只允许中文、数字、字母、下划线、横线、空格；两边不能有空格和横线')
                        } else {
                            callback()
                        }
                    }
                },
            ],
            code: [
                { required: true, message: '字典编码不能为空' },
                {
                    validator: function (rule, value, callback) {
                        if (!matchExtraCode(value)) {
                            callback('只允许输入数字、字母、特殊字符(:-_),特殊字符不能连续且只能出现一种')
                        } else {
                            callback()
                        }
                    }
                },
            ],
            sort: [
                {
                    validator: function (rule, value = '', callback) {
                        if (value !== 0 && value !== '' && !/^\d+$/.test(value)) {
                            callback('只允许输入数字')
                        } else {
                            callback()
                        }
                    }
                },
            ]
        }
        return {
            defaultDictForm,
            modalVisible: false,
            dictForm: defaultDictForm,
            dictFormRules,
            needReload: false
        }
    },
    computed: {
        ...mapState('system/dict', ['dicts']),
        options() {
            // 父级字典数据
            const datas = deepCopy(this.dicts)
            const addLevel = (data = [], level = 1) => {
                return data.map(item => {
                    item.level = level
                    if (item.children && item.children.length > 0) {
                        addLevel(item.children, level + 1)
                    }
                    return item
                })
            }
            const options = this.toOptions(addLevel(datas, 1))
            return options
        }
    },
    watch: {
        info(dictInfo) {
            this.dictForm = { ...this.defaultDictForm, ...dictInfo }
        },
        visible(isVisible) {
            this.modalVisible = isVisible
            this.needReload = false
        }
    },
    methods: {
        ...mapActions('system/dict', ['saveDict']),
        toOptions(dicts = []) {
            const currentDict = this.dictForm
            return dicts.map(({ name: label, id: value, level, children }) => {
                const opt = { label, value, level }
                if (children && children.length > 0) {
                    opt.children = this.toOptions(children)
                }
                return opt
            }).filter(dict => {
                // 父级不能选中自己和自己的子级
                if (currentDict && currentDict.id) {
                    return dict.value !== currentDict.id
                }
                // 不能选择大于5级及以上的字典作为父级
                if (dict.level >= 5) {
                    return false
                }
                return true
            })
        },
        _closeModal(needReload = false) {
            this.modalVisible = false
            this.needReload = !!needReload
        },
        _closeCall() {
            this.close(this.needReload)
            this.$refs.dictForm.resetFields()
        },
        save() {
            this.$refs.dictForm.validate(valid => {
                if (!valid) {
                    return
                }

                const pid = this.dictForm.pid || null
                showLoading(true, '正在保存字典信息')
                this.saveDict({ ...this.dictForm, pid }).then(() => {
                    showLoading(false)
                    showMessage('保存成功')
                    this._closeModal(true)
                }).catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
            })
        }
    }
}
</script>

<style lang="scss"  scoped>
/deep/ .el-textarea__inner{
    resize: none;
}
</style>
