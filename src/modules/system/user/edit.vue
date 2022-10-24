<template>
    <Modal
        :title="(editInfo.isAdd ? '新增':'编辑') + '用户信息'"
        :visible="editInfo.visiable"
        @close="_close"
    >
        <el-form ref="userForm" :model="userForm" :rules="userFormRules" label-width="100px">
            <el-row>
                <el-form-item label="登录账号:" prop="account">
                    <el-col :span="20">
                        <el-input
                            v-model="userForm.account"
                            placeholder="登录账号"
                            maxlength="20"
                            :disabled="!editInfo.isAdd"
                            clearable
                        />
                    </el-col>
                </el-form-item>
                <el-form-item label="用户名称:" prop="username">
                    <el-col :span="20">
                        <el-input v-model="userForm.username" placeholder="用户名称" maxlength="20" clearable />
                    </el-col>
                </el-form-item>
                <el-form-item v-if="editInfo.isAdd && !userForm.isDomain" label="密码:" prop="pcode">
                    <el-col :span="20">
                        <el-input
                            v-model="userForm.pcode"
                            placeholder="新用户密码"
                            type="password"
                            maxlength="20"
                            clearable
                        />
                    </el-col>
                </el-form-item>
                <el-form-item v-if="editInfo.isAdd && !userForm.isDomain" label="确认密码:" prop="repcode">
                    <el-col :span="20">
                        <el-input
                            v-model="userForm.repcode"
                            placeholder="确认密码"
                            type="password"
                            maxlength="20"
                            clearable
                        />
                    </el-col>
                </el-form-item>
                <el-form-item v-if="editInfo.isAdd" label="选择角色:" prop="roles">
                    <el-col :span="20">
                        <el-checkbox-group v-model="userForm.roles" clearable>
                            <el-checkbox
                                v-for="role in editInfo.roles"
                                :key="role.id"
                                :label="role.id"
                                :value="role.id"
                            >{{role.name}} </el-checkbox>
                        </el-checkbox-group>
                    </el-col>
                </el-form-item>
                <el-form-item v-if="editInfo.isAdd" label="是否启用:" prop="enabled">
                    <el-checkbox v-model="userForm.enabled"></el-checkbox>
                </el-form-item>
                <el-form-item label="域账号登录:" prop="isDomain ">
                    <el-radio-group v-model="userForm.isDomain">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="性别:" prop="sex">
                    <el-radio-group v-model="userForm.sex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">女</el-radio>
                        <el-radio :label="0">未知</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="邮箱:" prop="email">
                    <el-col :span="20">
                        <el-input v-model="userForm.email" placeholder="邮箱" maxlength="50" clearable/>
                    </el-col>
                </el-form-item>
                <el-form-item label="手机:" prop="phone">
                    <el-col :span="20">
                        <el-input v-model="userForm.phone" placeholder="手机" maxlength="11" clearable/>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="save">保 存</el-button>
                    <el-button @click="closeModal">取 消</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </Modal>
</template>
<script>
import {
    userMatchName,
    matchAccountName,
    matchPasswd,
    matchEmail
} from '../../../utils/RegExpUtil'
import { showMessage, showLoading, showError } from '../../../utils'
import { mapActions } from 'vuex'
export default {
    name: 'UserEdit',
    props: {
        editInfo: {
            type: Object,
            default: () => { }
        },
        close: {
            type: Function,
            default: () => { }
        }
    },
    data() {
        const defaultUserForm = {
            id: null,
            account: '',
            username: '',
            enabled: true,
            sex: 0,
            email: '',
            phone: '',
            pcode: '',
            repcode: '',
            roles: [],
            isDomain: false
        }
        const userForm = { ...defaultUserForm }
        const userFormRules = {
            account: [
                {
                    required: true,
                    message: '登录账号不能为空'
                },
                {
                    validator: function (rule, value, callback) {
                        if (!matchAccountName(value)) {
                            callback('登录账号只允许输入数字、字母、空格和下划线')
                        } else {
                            callback()
                        }
                    }
                }
            ],
            username: [
                {
                    required: true,
                    message: '用户名称不能为空'
                },
                {
                    validator: function (rule, value, callback) {
                        if (!userMatchName(value)) {
                            callback(
                                '用户名称只允许中文、数字、字母、下划线、空格'
                            )
                        } else {
                            callback()
                        }
                    }
                }
            ],
            pcode: [
                {
                    required: true,
                    message: '密码不能为空'
                },
                {
                    max: 20,
                    message: '密码最大长度不能超过20个字符'
                },
                {
                    min: 6,
                    message: '密码最小长度不能低于6个字符'
                },
                {
                    validator: function (rule, value, callback) {
                        if (!matchPasswd(value)) {
                            callback(
                                '密码至少包含数字、小写字母、大写字母、特殊字符中的三种'
                            )
                        } else {
                            callback()
                        }
                    }
                }
            ],
            repcode: [
                {
                    required: true,
                    message: '确认密码不能为空'
                },
                {
                    validator: (rule, value, callback)=> {
                        if (value !== this.userForm.pcode) {
                            callback(
                                '两次输入密码不一致!'
                            )
                        } else {
                            callback()
                        }
                    }
                }
            ],
            roles: [
                {
                    required: true,
                    message: '请选择角色'
                },
            ],
            email: [
                {
                    validator: function (rule, value, callback) {
                        if (value && !matchEmail(value)) {
                            callback('邮箱输入不合法')
                        } else {
                            callback()
                        }
                    }
                }
            ]
        }
        return {
            defaultUserForm,
            userForm,
            userFormRules,
            needRelod: false
        }
    },
    watch: {
        editInfo: function ({ userinfo }) {
            this.needRelod = false
            this.setUserForm(userinfo)
        }
    },
    created() {
        this.setUserForm(this.defaultUserForm)
    },
    methods: {
        ...mapActions('system/user', ['saveUser']),
        closeModal(needRelod = false) {
            this.editInfo.visiable = false
            this.$refs.userForm.resetFields()
            this.needRelod = needRelod
        },
        _close() {
            this.close(this.needRelod)
        },
        setUserForm(userinfo) {
            this.userForm = { ...this.defaultUserForm, ...userinfo }
        },
        save() {
            this.$refs.userForm.validate(valid => {
                if (!valid) {
                    return false
                }
                const getUserinfo = ({ pcode, repcode, roles, ...userinfo }) => {
                    const isAdd = this.editInfo.isAdd
                    const _userinfo = { ...userinfo }
                    if (isAdd) {
                        _userinfo.roles = roles.join(',')
                        _userinfo.pcode = pcode
                        _userinfo.repcode = repcode
                    }
                    return _userinfo
                }
                const userinfo = getUserinfo(this.userForm)
                showLoading(true, '正在保存用户信息')
                this.saveUser(userinfo)
                    .then(() => {
                        showLoading(false)
                        this.closeModal(true)
                        showMessage('用户信息保存成功')
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


