<template>
    <Modal
        width="650px"
        :visible="assignRoleForm.visiable"
        :title="'设置'+(assignRoleForm.username)+'角色'"
        @close="_closeModal"
    >
        <el-form
            ref="assignRoleForm"
            :model="assignRoleForm"
            :rules="assignRoleFormRules"
            label-width="100px"
        >
            <el-row>
                <el-form-item label="选择角色:" prop="userRoles">
                    <el-col :span="20">
                        <el-checkbox-group v-model="assignRoleForm.userRoles">
                            <el-checkbox
                                v-for="role in checkedRoles"
                                :key="role.id"
                                :label="role.id"
                                name="roles"
                            >{{role.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="save">保 存</el-button>
                    <el-button @click="_closeModal">取 消</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </Modal>
</template>
<script>
import { mapActions } from 'vuex'
import { showLoading, showMessage, showError } from '../../../utils'
export default {
    name: 'AssignRole',
    props: {
        assignRole: {
            type: Object,
            default: () => { }
        },
        close: {
            type: Function,
            default: () => { }
        }
    },

    data() {
        return {
            assignRoleForm: {
                visiable: false,
                roles: [], // 角色详细列表
                userRoles: [],
                account: '',
                username: '',
                id: ''
            },
            assignRoleFormRules: {
                userRoles: [
                    {
                        type: 'array',
                        required: true,
                        message: '请至少选择一个角色'
                    }
                ]
            },
            needRelod: false
        }
    },
    computed: {
        checkedRoles: function () {
            const { roles, userRoles } = this.assignRoleForm

            roles.forEach(role => {
                if (userRoles.indexOf(role.id) > -1) {
                    role.checked = true
                } else {
                    role.checked = false
                }
            })
            return roles
        }
    },
    watch: {
        assignRole: function (assignRole) {
            // Vue.set(this.assignRoleForm, assignRole)
            this.needRelod = false
            // 使用副本
            this.assignRoleForm = { ...assignRole }
        }
    },
    methods: {
        ...mapActions('system/user', {
            setUserRoles: 'assignRole'
        }),
        _closeModal(needRelod = false) {
            this.$refs.assignRoleForm.resetFields()
            this.assignRoleForm.visiable = false
            this.needRelod = needRelod
        },
        _close: function () {
            // 该close 事件自动回调处理业务逻辑
            this.close(this.needRelod)
        },
        save: function () {
            this.$refs.assignRoleForm.validate(valid => {
                if (!valid) {
                    return false
                }
                const { id, account, userRoles } = this.assignRoleForm
                const user = {
                    id,
                    account,
                    roles: userRoles.join(',')
                }
                showLoading(true, '保存用户角色')
                this.setUserRoles(user)
                    .then(() => {
                        showLoading(false)
                        showMessage('用户角色设置成功')
                        this._closeModal(true)
                    })
                    .catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
            })
        }
    }
}
</script>

