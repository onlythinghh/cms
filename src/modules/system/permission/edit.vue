<template>
    <Modal :title="edit.isAdd ? '新增权限':'编辑权限' " :visible="edit.visiable" @close="closeModal">
        <el-row>
            <el-form ref="permForm" label-width="100px" :model="permForm" :rules="permFormRules">
                <el-form-item label="权限名称" prop="name">
                    <el-col :span="18">
                        <el-input v-model="permForm.name" placeholder="权限名称" clearable />
                    </el-col>
                </el-form-item>
                <el-form-item label="权限编码" prop="code">
                    <el-col :span="18">
                        <el-input v-model="permForm.code" placeholder="权限编码" clearable/>
                    </el-col>
                    <el-col :span="1">
                        <CodeTips />
                    </el-col>
                </el-form-item>
                <el-form-item label="父级权限" prop="pid">
                    <el-col :span="18">
                        <!-- <el-select
                            v-model="permForm.pid"
                            :filterable="true"
                            clearable
                            class="w100"
                            placeholder="请选择父级权限"
                        >
                            <el-option
                                v-for="(perm, index) in normalizePagePerms"
                                :key="index"
                                :label="perm.name"
                                :value="Number(perm.id)"
                            ></el-option>
                        </el-select>-->
                        <TreeSelect
                            ref="testSelect"
                            v-model="permForm.pid"
                            placeholder="请选择父级权限"
                            :options="parentPerms"
                            :checked-on-click="true"
                            text-prop="label"
                        />
                    </el-col>
                    <el-col :span="1">
                        <el-tooltip content="父级权限只能选择页面级别" placement="right">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-col>
                </el-form-item>
                <el-form-item label="关联资源" prop="rid">
                    <el-col :span="18">
                        <el-select
                            v-model="permForm.rid"
                            :filterable="true"
                            class="w100"
                            placeholder="请关联资源"
                            clearable
                        >
                            <el-option
                                v-for="(res, index) in validResources"
                                :key="index"
                                :label="res.name"
                                :value="Number(res.id)"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="1">
                        <el-tooltip content="已分配的权限的资源不会展示" placement="right">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-col>
                </el-form-item>
                <el-form-item label="描述" prop="descript">
                    <el-col :span="18">
                        <el-input
                            v-model="permForm.descript"
                            type="textarea"
                            :rows="3"
                            placeholder="描述"
                        />
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="save">保 存</el-button>
                    <el-button @click="closeModal">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-row>
    </Modal>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { matchName, matchExtraCode } from '../../../utils/RegExpUtil'
import { showLoading, showMessage, showError } from '../../../utils'
import { deepCopy } from '../../../utils/BaseUtil'
export default {
    name: 'PermissionEdit',
    props: {
        editProp: {
            type: Object,
            default: () => { }
        },
        clear: {
            type: Function,
            default: () => { }
        },
        reload: {
            type: Function,
            default: () => { }
        }
    },
    data() {
        const permFormRules = {
            name: [
                { required: true, message: '权限名称不能为空' },
                {
                    validator: function (rule, value, callback) {
                        if (!matchName(value)) {
                            callback(
                                '权限名称只允许输入中文、数字、字母、下划线、横线、空格；两边不能有空格和横线'
                            )
                        } else {
                            callback()
                        }
                    }
                }
            ],
            code: [
                { required: true, message: '权限编码不能为空' },
                {
                    validator: function (rule, value, callback) {
                        if (!matchExtraCode(value)) {
                            callback(
                                '只允许输入数字、字母、特殊字符(:-_),特殊字符不能连续且只能出现一种'
                            )
                        } else {
                            callback()
                        }
                    }
                }
            ],
            // pid: [{ required: true, message: '请选择父级权限' }],
            rid: [{ required: true, message: '请选择资源' }]
        }
        return {
            permForm: {},
            permFormRules,
            edit: {
                visiable: false,
                isAdd: true,
                rid: null // 编辑时候资源副本
            }
        }
    },
    computed: {
        ...mapState('system/permission', ['perms']),
        ...mapGetters('system/permission', [
            'normalizePagePerms',
            'normalizePerms'
        ]),
        ...mapGetters('system/resource', ['normalizeResources', 'treeResources']),
        validResources() {
            // 已经被关联过的资源将被过滤掉
            const normalizePerms = this.normalizePerms
            let hasResources = []
            normalizePerms.forEach(perm => hasResources.push(perm.rid))
            // 过滤空值
            hasResources = hasResources.filter(r => !!r)

            // 当前编辑时资源的ID 副本
            const currentRid = this.edit.rid || -2

            // 获取所有的资源
            const normalizeResources = deepCopy(this.normalizeResources)

            const resources = normalizeResources.filter(
                p => currentRid === p.id || hasResources.indexOf(p.id) === -1
            )
            return resources
        },
        parentPerms() {
            const perms = deepCopy(this.perms || [])
            return this.toParentPermOptions(perms)
        }
    },
    watch: {
        editProp: function (nextProp) {
            this.setDataEditInfo(nextProp)
        }
    },
    created() {
        this.setDataEditInfo(this.editProp)
        // 若资源不存在加载资源
        this.loadResources()
    },

    methods: {
        ...mapActions('system/permission', ['savePerm']),
        ...mapActions('system/resource', ['loadResources']),
        toParentPermOptions(perms = []) {
            // 当前编辑时资源的ID 副本
            const currentId = this.permForm.id || -2
            return perms.map(({ name: label, id: value, type, children }) => {
                const opt = { label, value, type }
                if (children && children.length > 0) {
                    opt.children = this.toParentPermOptions(children)
                }
                return opt
            }).filter(perm => {
                if (perm.type === 1) {
                    // 父级不能选中自己和自己的子级
                    if (currentId === perm.value) {
                        return false
                    }
                    return true
                }
                return false
            })
        },
        setDataEditInfo(prop) {
            this.edit.visiable = prop.visiable
            this.edit.isAdd = prop.isAdd
            this.edit.isAdd = prop.isAdd
            // 资源ID副本
            this.edit.rid = prop.perm.rid || null
            this.permForm = { ...prop.perm, pid: prop.perm.pid || null }
        },
        save() {
            this.$refs.permForm.validate(valid => {
                if (!valid) {
                    return false
                }
                const permForm = this.permForm
                showLoading(true, '正在保存权限信息')
                this.savePerm(permForm)
                    .then(() => {
                        showLoading(false)
                        showMessage('保存成功')
                        this.reload()
                        this.closeModal()
                    })
                    .catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
            })
        },
        closeModal() {
            this.$refs.permForm.resetFields()
            this.clear()
        }
    }
}
</script>

<style lang="scss" scoped>
    /deep/ .el-textarea__inner{
    resize: none;
}
</style>
