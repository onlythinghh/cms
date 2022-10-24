<template>
<!-- 结算利率 -->
    <div class="interest_rate">
        <p class="title">当前同步时间<span>官网-新型产品的结算利率和公司核心业务系统同步进行更新</span></p>
        <el-form ref="rateRef" :model="formData" :rules="Rules" label-width="0px">
            <el-form-item prop="value">
                <el-input v-model="formData.value" maxlength="3" placeholder="请输入内容">
                    <el-select slot="append" v-model="formData.unit" placeholder="请选择">
                        <el-option label="小时" value="h"></el-option>
                        <el-option label="天" value="d"></el-option>
                    </el-select>
                </el-input>
                <el-button type="primary" class="btn" @click="changeThat">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { showLoading } from "@/utils"
export default {
    data() {
        return {
            formData: {
                value: '',
                unit: 'h',
            },
            Rules:{
                value: [
                    { required: true, message: "时间值不能为空", trigger: "blur" },
                    {
                        validator: function (rule, value, callback) {
                            let reg = /^[0-9]+$/
                            if (!reg.test(value)) {
                                callback('只允许输入数字')
                            } else {
                                callback()
                            }
                        }
                    }
                ],
            }
            
        }
    },
    mounted() {
        this.queryInterestRate()
    },
    methods: {
        ...mapActions('cms/settings/interestRate', ['getInterestRate', 'AddInterestRate']),
        queryInterestRate() {
            this.getInterestRate().then(res => {
                // console.log('获取利率', res)
                if(res.success) {
                    let str = res.data
                    this.formData.value = str.substr(0, str.length-1)
                    this.formData.unit = str.substr(str.length-1, 1)
                }
            })
        },
        changeThat() {
            this.$refs.rateRef.validate(async valid => {
                if (!valid) {
                    return false;
                }
                showLoading(true, "正在加载");
                let params = {
                    time: `${this.formData.value}${this.formData.unit}`
                }
                this.AddInterestRate(params).then(res => {
                    // console.log('设置利率', res)
                    if(res.success) {
                        this.queryInterestRate()
                        this.$message.success(res.data)
                    } else {
                        this.$message.error(res.errMsg|| '服务器异常，请稍后再试!')
                    }
                    showLoading(false)
                })
            })
            
        }
    }
}
</script>
<style lang="scss" scoped>
.interest_rate{
    width: 600px;
    margin-left: 15px;
    .title{
        font-size: 16px;
        font-weight: bold;
        span{
            font-size: 12px;
            color: #ccc;
            font-weight: initial;
            margin-left: 10px;
        }
    }
    .btn{
        margin-left: 10px;
    }
}

/deep/ .el-select {
    .el-input{
        width: 80px;
    }
}
/deep/ .el-input {
    width: 330px;
}
</style>