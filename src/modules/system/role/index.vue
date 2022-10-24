<template>
    <el-card class="card-container">
        <el-row>
            <el-col :span="6">
                <div class="card-left-header">
                    <span>角色身份</span>
                    <span class="toolbars">
                        <el-tooltip content="新增角色">
                            <el-button size="mini" class="mini" @click="editRole({}, true)">
                                <i class="el-icon-plus"></i>
                            </el-button>
                        </el-tooltip>
                    </span>
                </div>
                <ul class="role-list">
                    <li
                        v-for="(role, index) in roles"
                        :key="index"
                        :class="role.id === roleForm.id ? 'active':''"
                        @click="editRole(role, false)"
                    >
                        <span>{{role.name}}</span>
                        <span>
                            <i class="el-icon-arrow-right"></i>
                        </span>
                    </li>
                </ul>
            </el-col>
            <el-col :span="18">
                <div class="role-detail">
                    <el-form
                        ref="roleForm"
                        :model="roleForm"
                        :rules="roleFormRules"
                        label-width="100px"
                    >
                        <el-form-item>
                            <el-col :span="12">
                                <div v-if="!edit.isAdd" class="role-code">
                                    <strong>{{roleForm.name}}</strong>
                                    <!-- <el-tag type="info">ID: {{roleForm.id}}</el-tag> -->
                                    <el-tooltip v-if="!roleForm.def" content="删除角色">
                                        <el-button size="mini" @click="deleteRole">
                                            <i class="el-icon-delete"></i>
                                        </el-button>
                                    </el-tooltip>
                                </div>
                                <div v-else class="role-code">
                                    <strong>新增角色身份</strong>
                                </div>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="角色名称" prop="name">
                            <el-col :span="12">
                                <el-input
                                    v-model="roleForm.name"
                                    placeholder="角色名称"
                                    maxlength="20"
                                    clearable
                                />
                            </el-col>
                        </el-form-item>
                        <el-form-item label="角色编码" prop="code">
                            <el-col :span="12">
                                <el-input
                                    v-model="roleForm.code"
                                    placeholder="角色编码"
                                    maxlength="20"
                                    :disabled="roleForm.def"
                                    clearable
                                />
                            </el-col>
                            <el-col :span="1">
                                <el-tooltip
                                    v-if="roleForm.def"
                                    content="系统角色不可编辑"
                                    placement="right"
                                >
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                            </el-col>
                        </el-form-item>
                        <hr />
                        <el-form-item label="选择权限：" prop="perms">
                            <el-tree
                                ref="permTree"
                                :data="treePerms"
                                show-checkbox
                                node-key="id"
                                :default-expand-all="false"
                                :auto-expand-parent="true"
                                :expand-on-click-node="true"
                                :check-on-click-node="false"
                                :check-strictly="false"
                                @check="check"
                            ></el-tree>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="save">保 存</el-button>
                            <!-- <el-button type="primary" @click="todata">权限设置</el-button> -->
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>
<style lang="scss">
.card-container {
    .role-list {
        list-style-type: none;
        padding: 0;
        > li {
            padding: 8px 15px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            font-size: 15px;
            &:hover,
            &.active {
                background: #409eff;
                color: #fff;
                border-radius: 2px;
            }
        }
    }
    .role-detail {
        .role-code {
            > *:not(:last-child) {
                margin-right: 5px;
            }
            > strong {
                font-size: 18px;
            }
        }
    }
}
</style>
<script>
import Vue from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import { showError, showLoading, confirm, showMessage } from '../../../utils'
import { matchName, matchCode } from '../../../utils/RegExpUtil'
export default {
    name: 'Role',
    data() {
        const roleForm = {}
        const roleFormRules = {
            name: [
                { required: true, message: '角色名称不能为空' },
                {
                    validator: function (rule, value, callback) {
                        if (!matchName(value)) {
                            callback(
                                '角色名称支允许中文、数字、字母、下划线、横线、空格；两边不能有空格和横线'
                            )
                        } else {
                            callback()
                        }
                    }
                }
            ],
            code: [
                { required: true, message: '角色编码不能为空' },
                {
                    validator: function (rule, value, callback) {
                        if (!matchCode(value)) {
                            callback('角色编码只允许数字、字母、下划线')
                        } else {
                            callback()
                        }
                    }
                }
            ],
            perms: [
                {
                    validator: (rule, value, callback) => {
                        // TODO 若没有此操作的权限 则不用校验
                        const perms = this.roleForm.perms
                        if (!perms || perms.length === 0) {
                            callback('请至少选择一项权限')
                        } else {
                            callback()
                        }
                    }
                }
            ]
        }
        return {
            edit: {
                isAdd: true
            },
            roleForm,
            roleFormRules,
            roleId:""
        }
    },
    computed: {
        ...mapState('system/role', ['roles']),
        ...mapGetters('system/permission', ['treePerms']),
        defaultCheckedKeys() {
            // 默认选中节点值只设置叶子节点选中
            // 若设置父节点选中，父节点会直接将叶子节点设置选中，无论叶子节点本身是否选中
            /* const hasPerms = this.roleForm.perms || []
            const treePerms = [].slice.call(this.treePerms || [])
            const filter = (perms, _hasPerms) => {
                let checkedKeys = []
                perms.forEach(perm => {
                    if (_hasPerms.indexOf(perm.id) > -1) {
                        const children = perm.children
                        if (children && children.length > 0) {
                            checkedKeys = [...checkedKeys, ...filter(children, _hasPerms)]
                        } else {
                            checkedKeys.push(perm.id)
                        }
                    }
                })
                return checkedKeys
            }
            return filter(treePerms, hasPerms) */
            return this.filter(this.roleForm.perms || [])
        }
    },
    created() {
        // 每次进入都重新加载
        this.clear()
        Promise.all([
            // 加载所有的角色
            this.reloadRoles(),
            // 加载权限
            this.loadPerms()
        ]).then(() => {
            // 保证数据全部加载完成，设置默认选中状态
            this.setTreeCheckedKeys(this.defaultCheckedKeys)
        })
    },
    methods: {
        ...mapActions('system/role', ['loadRoles', 'saveRole', 'delRole']),
        ...mapActions('system/permission', ['loadPerms']),
        filter(hasPerms){
            // 默认选中节点值只设置叶子节点选中
            // 若设置父节点选中，父节点会直接将叶子节点设置选中，无论叶子节点本身是否选中
            // const hasPerms = this.roleForm.perms || []
            const treePerms = [].slice.call(this.treePerms || [])
            const filter = (perms, _hasPerms) => {
                let checkedKeys = []
                perms.forEach(perm => {
                    if (_hasPerms.indexOf(perm.id) > -1) {
                        const children = perm.children
                        if (children && children.length > 0) {
                            checkedKeys = [...checkedKeys, ...filter(children, _hasPerms)]
                        } else {
                            checkedKeys.push(perm.id)
                        }
                    }
                })
                return checkedKeys
            }
            return filter(treePerms, hasPerms)
        },
        editRole: function (role, isAdd = false) {
            this.roleId = role.id
            this.edit.isAdd = !!isAdd
            this.roleForm = { ...role, perms: !isAdd && role.perms && role.perms.length > 0 ? role.perms : [] } // 副本
            this.setTreeCheckedKeys(this.filter(this.roleForm.perms || []))
        },
        setTreeCheckedKeys(checkedKeys) {
            this.$refs.permTree.setCheckedKeys(checkedKeys)
        },
        check(data, { checkedKeys, halfCheckedKeys }) {
            // 半选中状态需要提交给后台
            Vue.set(this.roleForm, 'perms', [...checkedKeys, ...halfCheckedKeys])
            this.setTreeCheckedKeys(checkedKeys)
            // 覆盖默认的校验
            this.validatePermsField()
        },
        validatePermsField() {
            this.$refs.roleForm.validateField('perms', errorMsg=>{
            })
        },
        deleteRole: function () {
            const roleName = this.roleForm.name
            // 删除角色
            confirm('此操作不可恢复,确认删除该角色吗 ? ', '警告', {
                ok: () => {
                    showLoading(true, `正在删除角色 ${roleName}`)
                    this.delRole(this.roleForm)
                        .then(() => {
                            this.clear()
                            this.reloadRoles().then(res => {
                                // 设置选中
                                this.setTreeCheckedKeys(this.defaultCheckedKeys)
                                return Promise.resolve(res)
                            })
                            showLoading(false)
                            showMessage(`角色 ${roleName} 删除成功`)
                        })
                        .catch(error => {
                            showLoading(false)
                            showError(error.message)
                        })
                }
            })
        },
        reloadRoles() {
            // 重新加载主要是为了数据的同步
            showLoading(true, '正在加载角色')
            return this.loadRoles()
                .then(roles => {
                    showLoading(false)
                    if (roles && roles.length > 0) {
                        this.edit.isAdd = false
                        let role = this.roleForm
                        const isExistRole = roles.find(
                            _role => _role.id === role.id
                        )
                        if (isExistRole) {
                            role.perms = isExistRole.perms
                        } else {
                            role = roles[0]
                            this.roleForm = { ...role }
                        }
                    } else {
                        this.clear()
                    }

                    return Promise.resolve('成功')

                })
                .catch(error => {
                    showLoading(false)
                    showError(error.message)
                    return Promise.reject(error)
                })
        },
        clear() {
            this.edit.isAdd = true
            this.roleForm = {
                perms: [] // 默认值
            }
        },
        save() {
            // 覆盖默认的校验
            this.validatePermsField()
            this.$refs.roleForm.validate(valid => {
                if (!valid) {
                    return false
                }
                const roleForm = this.roleForm
                const role = {
                    id: roleForm.id || '',
                    name: roleForm.name,
                    code: roleForm.code,
                    noPerms: false, // TODO 选中权限操作的若无此操作的权限，则设置为true
                    perms: (roleForm.perms || []).join(',')
                }

                showLoading(true, `正在保存角色信息...`)
                this.saveRole(role)
                    .then(id => {
                        id && (this.roleForm.id = id)
                        this.reloadRoles()
                        showLoading(false)
                        showMessage('角色信息保存成功')
                    })
                    .catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
            })
        },
        todata(){
            this.$router.push({path:'authority',query:{roleId:this.roleId?this.roleId:this.roles[0].id,roleTag:"role"}})
        }
    }
}
</script>


