<template>
    <el-container>
        <el-main>
            <el-row>
                <el-col :span="6">
                    <el-form
                        ref="baseProfileForm"
                        :model="baseProfileForm"
                        :rules="baseProfileFormRules"
                        label-width="80px"
                    >
                        <el-form-item label="登录账号:" prop="account">
                            <el-input
                                v-model="baseProfileForm.account"
                                :disabled="true"
                                maxlength="20"
                            />
                        </el-form-item>
                        <el-form-item label="用户名:" prop="username">
                            <el-input v-model="baseProfileForm.username" maxlength="50"/>
                        </el-form-item>
                        <el-form-item label="角色:">
                            <el-input v-model="roleName" :disabled="true"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="save">保存用户信息</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { matchName } from '../../../utils/RegExpUtil'
import { showMessage } from '../../../utils'
export default {
    name: 'BaseProfile',
    data() {
        const baseProfileFormRules = {
            username: [
                { required: true, message: '用户名不能为空', trigger: 'blur' },
                {
                    validator: function(rule, value, callback) {
                        if (!matchName(value)) {
                            callback('不能输入特殊字符，前后不能有空格、横线')
                        } else {
                            callback()
                        }
                    },
                    trigger: 'blur'
                }
            ]
        }
        return {
            baseProfileForm: {
                username: '',
                account: ''
            },
            baseProfileFormRules: baseProfileFormRules
        }
    },
    computed: {
        ...mapState('authen', ['userinfo', 'roles']),

        roleName() {
            const roles = this.roles
            const roleNames = roles.map(role => role.name).join(', ')
            return roleNames
        }
    },
    created() {
        this.baseProfileForm = {
            ...this.userinfo
        }
    },
    methods: {
        ...mapActions('system/profile', ['saveProfile']),
        save() {
            this.$refs.baseProfileForm.validate(valid => {
                if (!valid) {
                    return false
                }
                this.saveProfile({ username: this.baseProfileForm.username })
                    .then(() => {
                        showMessage('用户信息保存成功')
                    })
                    .catch(error => {
                        showMessage({
                            type: 'error',
                            message: error.mesaage
                        })
                    })
            })
        }
    }
}
</script>

