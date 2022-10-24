<template>
    <el-container>
        <el-main>
            <el-row>
                <el-col >
                    <el-form
                        ref="passwdForm"
                        :model="passwdForm"
                        :rules="passwdFormRules"
                        label-width="100px"
                    >
                        <el-form-item label="新密码:" prop="passwd">
                            <el-input
                                v-model="passwdForm.passwd"
                                maxlength="20"
                                placeholder="输入新密码"
                                type="password"
                                style="width:200px"
                                show-password
                                @copy.native="copy"
                            />
                        </el-form-item>
                        <el-form-item label="确认新密码:" prop="repasswd">
                            <el-input
                                v-model="passwdForm.repasswd"
                                maxlength="20"
                                placeholder="重新输入新密码"
                                type="password"
                                style="width:200px"
                                show-password
                                @copy.native="copy"
                            />
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="save">确认修改</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>
<script>
import { mapActions } from 'vuex'
import { matchPasswd } from '../../../utils/RegExpUtil'
import { showLoading, showMessage } from '../../../utils'
import { logoutRoute } from '../../../utils/ServiceUtil'
export default {
    name: 'ProfilePasswd',
    data() {
        return {
            passwdForm: {
                passwd: '',
                repasswd: ''
            },
            passwdFormRules: {
                passwd: [
                    { required: true, message: '密码不能为空' },
                    { min: 6, message: '密码长度不能低于6个字符' },
                    { max: 20, message: '密码长度不能超过20个字符' },
                    {
                        validator: (rule, value, callback) => {
                            if (!matchPasswd(value)) {
                                callback(
                                    '至少包含数字、小写字母、大写字母、特殊字符中的三种'
                                )
                            } else {
                                callback()
                            }
                        }
                    }
                ],
                repasswd: [
                    { required: true, message: '确认密码不能为空' },
                    {
                        validator: (rule, value, callback) => {
                            if (this.passwdForm.passwd !== value) {
                                callback('两次密码输入不一致')
                            } else {
                                callback()
                            }
                        }
                    }
                ]
            }
        }
    },
    methods: {
        ...mapActions('system/profile', ['savePasswd']),
        copy() {
            // 禁止copy 明文模式不起作用
            return false
        },
        save() {
            this.$refs.passwdForm.validate(valid => {
                if (!valid) {
                    return false
                }
                showLoading(true, '正在保存密码')
                this.savePasswd(this.passwdForm)
                    .then(response => {
                        showLoading(false)
                        if(response.data.success){
                            showMessage({
                                type: 'success',
                                message: '密码修改成功,请牢记新密码；即将重新登录',
                                onClose: () => {
                                    this.$router.push(logoutRoute)
                                }
                            })
                        }else{
                            showMessage({
                                type: 'error',
                                message: response.data.errMsg || '密码修改失败'
                            })
                        }
                    })
                    .catch(error => {
                        showLoading(false)
                        showMessage({
                            type: 'error',
                            message: error.message || '密码修改失败'
                        })
                    })
            })
        }
    }
}
</script>

