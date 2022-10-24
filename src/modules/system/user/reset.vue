<template>
    <Modal :visible="modalVisible" title="修改密码" @close="closeModel">
        <el-form ref="userForm" :model="userForm" :rules="userFormRules" label-width="100px">
            <el-row>
                <el-form-item label="新密码:" prop="pcode">
                    <el-col :span="20">
                        <el-input
                            v-model="userForm.pcode"
                            placeholder="输入新密码"
                            type="password"
                            maxlength="20"
                        />
                    </el-col>
                </el-form-item>
                <el-form-item label="确认新密码:" prop="repcode">
                    <el-col :span="20">
                        <el-input
                            v-model="userForm.repcode"
                            placeholder="重新输入新密码"
                            type="password"
                            maxlength="20"
                        />
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="save">保 存</el-button>
                    <el-button @click="_cancel">取 消</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </Modal>
</template>
<script>
import {
    matchPasswd,
} from '../../../utils/RegExpUtil'
import { showMessage,showLoading,showError } from '../../../utils'
import { mapActions } from 'vuex'
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        info: {
            type: Object,
            default: ()=>{}
        },
    },
    data() {
        return {
            childrencateory:[],
            userForm: {
                id:null,
                pcode: '',
                repcode: ''
            },
            userFormRules:{            
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
                        validator:(rule, value, callback)=>{
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
            },
            modalVisible:false,
            needReload: true

        }
    },
    // computed: {
    //     ...mapGetters('cms/site', {
    //         'sites': 'normalizeSites'
    //     }),

    // },
    watch: {
        visible(nextVisible) {
            this.modalVisible = nextVisible
        },
        info(nextInfo){
            this.userForm.id = nextInfo.id
        },
    },
    methods: {
        ...mapActions('system/user', ['resetPassWord']),
        _cancel(){
            this.$emit('close', this.needReload)
        },
        closeModel(){
            this.$refs.userForm.resetFields()
            this.$emit('close',this.needReload)
        },
        save(){
            this.$refs.userForm.validate(valid => {
                if (!valid) {
                    return false
                }
                showLoading(true, '正在保存用户信息')
                this.resetPassWord({...this.userForm}) .then(data=>{
                    showLoading(false)
                    this.needReload = true
                    this._cancel()
                    showMessage(data)
                    this.userForm = {
                        id: null,
                        pcode: '',
                        repcode: ''
                    }
                }) .catch(error=>{
                    showLoading(false)
                    showError(error.message)
                })
                
            })
            
        }

    },


}
</script>
