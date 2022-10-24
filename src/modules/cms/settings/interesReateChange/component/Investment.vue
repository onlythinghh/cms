<template>
    <div class="investment">
        <!-- 投资管家 -->
        <div class="add_box">
            <el-button type="primary" @click="changeReateRow({}, null)">新增</el-button>
        </div>
        <el-table ref="tableList" :data="dataList" class="tableList">
                <el-table-column label="资产评估日" prop="ValnDate">
                    <template v-slot="{ row }">
                        {{row.ValnDate}}
                    </template>
                </el-table-column>
                <el-table-column label="投资单位卖出价" prop="UnitPrice1">
                    <template v-slot="{ row }">
                        {{row.UnitPrice1 | tofixed}}
                    </template>
                </el-table-column>
                
                <el-table-column label="操作" width="200">
                    <template v-slot="{ row, $index }">
                        <el-button type="primary" @click="changeReateRow(row, $index)">修改</el-button>
                        <el-button type="danger" @click="deleteReateRow(row, $index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 修改 -->
        <el-dialog
            :title="rowIndex == null ? '新增': '修改'"
            :visible.sync="prdVisible"
            width="460px"
            :before-close="handleClose"
        >
            <el-form ref="changeRef" label-width="100px" :rules="formDataRules" :model="currentRow">
                <el-form-item label="资产评估日" prop="ValnDate">
                    <el-date-picker
                        v-model="currentRow.ValnDate"
                        type="date"
                        :clearable="false"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择"
                        style="width: 300px"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="投资单位卖出价" prop="UnitPrice1">
                    <el-input v-model="currentRow.UnitPrice1" placeholder="请输入"
                        oninput="value=value.replace(/\D*(\d*)(\.?)(\d{0,10})\d*/,'$1$2$3').replace(/^0+(\d)/, '$1').replace(/^\./, '0.').match(/^\d*(\.?\d{0,10})/g)[0] || ''"
                        style="width: 300px"
                    />
                </el-form-item>
                <div class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="commitPrd">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    filters:{
        tofixed(val, num=4) {
            if(val) {
                return `${Number(val).toFixed(num)}`
            } else {
                return '-'
            }
            
        }
    },
    props: {
        dataList:{
            type: Array,
            default: () => []
        },
        currentProduct: {
            type: Array,
            default: () => []
        },
        prdVisible2:{
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            prdVisible: false,
            rowIndex: null,
            currentRow: {},

            formDataRules: { // 表单验证规则
                ValnDate: [{ required: true, message: "日期为必填项", trigger: "blur" }],
                UnitPrice1: [{ required: true, message: "该项为必填项", trigger: "blur" }],
            },
        }
    },
    watch:{
        prdVisible2(val){
            this.prdVisible = this.prdVisible2
        }
    },
    mounted(){
        console.log('投资管家data',this.dataList)
    },
    methods: {
        ...mapActions('cms/settings/interesReateChange', ['getInvestRateDetail','getInvestRateSave']),
        changeReateRow(row, index=null) {
            if(Object.keys(row).length){
                // this.rowIndex = index
                this.currentRow = JSON.parse(JSON.stringify(row))
            } else {  // 否则就是新增
                this.currentRow = {
                    FndDesc1: "投资单位卖出价",
                    FndDesc2: "",
                    FndDesc3: "",
                    FndDesc4: "",
                    FndDesc5: "",
                    FndId1: "",
                    FndId2: "",
                    FndId3: "",
                    FndId4: "",
                    FndId5: "",
                    FndVers1: "",
                    FndVers2: "",
                    FndVers3: "",
                    FndVers4: "",
                    FndVers5: "",
                    UnitPrice1: "", // 投资单位卖出价
                    UnitPrice2: "",
                    UnitPrice3: "",
                    UnitPrice4: "",
                    UnitPrice5: "",
                    ValnDate: "", // 资产评估日期
                }
            }
            this.rowIndex = index
            // console.log('currentRow',this.currentRow, this.rowIndex)
            this.prdVisible = true
            this.$emit('dialoagChange', true)
        },

        commitPrd() {
            this.$refs.changeRef.validate(valid => {
                // console.log('valid',valid)
                if (!valid) {
                    return false;
                }
                // showLoading(true, "数据加载中...");
                console.log('投资管家提交', this.currentRow)
                let list = JSON.parse(JSON.stringify(this.dataList))
                if(this.rowIndex == null) {
                    list.unshift(this.currentRow)
                } else {
                    list.splice(this.rowIndex, 1, this.currentRow)
                }
                this.$emit('seaveProduct',list, this.prdVisibletst)
            })
        },
        deleteReateRow(row, index) {
            this.$confirm('确定删除该条数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let list = JSON.parse(JSON.stringify(this.dataList))
                list.splice(index, 1)
                this.$emit('deleteReateRow',list, index)
            }).catch(() => {});
        },

        handleClose() {
            this.currentRow = this.$options.data().currentRow
            this.rowIndex = null
            this.prdVisible = false
            this.$emit('dialoagChange', false)
        },
        sortKey(array, key) {
            return array.sort(function(a, b) {
                var x = a[key];
                var y = b[key];
                return new Date(y).getTime() - new Date(x).getTime()
            })
        },
    }
}
</script>
<style lang="scss" scoped>
.add_box{
    text-align: right;
}
/deep/ .el-form-item--medium .el-form-item__label{
    line-height: 22px;
}
</style>