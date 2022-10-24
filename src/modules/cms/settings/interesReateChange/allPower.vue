<template>
    <!-- 利率数据修改 -->
    <div class="interesRateChange">
        <TableRow :has-form="true" :has-header="true" :has-pagination="true">
            <template v-slot:form>
                <el-form ref="searchRef" label-width="80px" :model="searchInfo">
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="选择产品">
                                <el-select v-model="searchInfo.productNmae" placeholder="请选择" style="width: 100%" @change="checkdProduct">
                                    <el-option
                                        v-for="item in productopt"
                                        :key="item.PlanCode"
                                        :label="item.PlanDescDisp"
                                        :value="item.PlanCode"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        
                    </el-row>
                </el-form>
            </template>
            <template v-slot:header-right>
                <el-button type="primary" :disabled="!searchInfo.productNmae" @click="changeReateRow({}, null)">新增</el-button>
            </template>
            <el-table ref="tableList" :data="detailList" class="tableList">
                <el-table-column label="适用日期" prop="ValnDate">
                    <template v-slot="{ row }">
                        {{row.ValnDate | dateFormat("YYYY年MM月")}}
                    </template>
                </el-table-column>
                <el-table-column label="年结算利率" prop="IntRtYearly">
                    <template v-slot="{ row }">
                        {{row.IntRtYearly | tofixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column label="日结算利率" prop="IntRtDaily">
                    <template v-slot="{ row }">
                        {{row.IntRtDaily | tofixed}}
                    </template>
                </el-table-column>
                <el-table-column label="公布时间" prop="PublicDate">
                    <template v-slot="{ row }">
                        {{row.PublicDate | dateFormat("YYYY年MM月")}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="280">
                    <template v-slot="{ row, $index }">
                        <el-button type="primary" @click="changeReateRow(row, $index)">修改</el-button>
                        <el-button type="danger" @click="deleteReateRow(row, $index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </TableRow>
        <!-- 修改 -->
        <el-dialog
            :title="rowIndex == null ? '新增': '修改'"
            :visible.sync="prdVisible"
            width="460px"
            :before-close="handleClose"
        >
            <el-form ref="changeRef" label-width="100px" :rules="formDataRules" :model="currentRow">
                <el-form-item label="适用日期" prop="ValnDate">
                    <el-date-picker
                        v-model="currentRow.ValnDate"
                        type="month"
                        :clearable="false"
                        value-format="yyyy-MM"
                        placeholder="请选择"
                        style="width: 300px"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="年结算利率" prop="IntRtYearly">
                    <el-input v-model="currentRow.IntRtYearly" placeholder="请输入年结算利率"
                        oninput="value=value.replace(/\D*(\d*)(\.?)(\d{0,10})\d*/,'$1$2$3').replace(/^0+(\d)/, '$1').replace(/^\./, '0.').match(/^\d*(\.?\d{0,10})/g)[0] || ''"
                        style="width: 300px"
                    />
                </el-form-item>
                <el-form-item label="日结算利率" prop="IntRtDaily">
                    <el-input v-model="currentRow.IntRtDaily" placeholder="请输入日结算利率"
                        oninput="value=value.replace(/\D*(\d*)(\.?)(\d{0,10})\d*/,'$1$2$3').replace(/^0+(\d)/, '$1').replace(/^\./, '0.').match(/^\d*(\.?\d{0,10})/g)[0] || ''"
                        style="width: 300px"
                    />
                </el-form-item>
                <el-form-item label="公布时间" prop="PublicDate">
                    <el-date-picker
                        v-model="currentRow.PublicDate"
                        type="month"
                        value-format="yyyy-MM"
                        :clearable="false"
                        placeholder="请选择"
                        style="width: 300px"
                    ></el-date-picker>
                </el-form-item>
                
                <div class="dialog-footer">
                    <el-button @click="prdVisible = false">取 消</el-button>
                    <el-button type="primary" @click="commitPrd">确 定</el-button>
                </div>
            </el-form>

            
            
        </el-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { showLoading } from "@/utils"
export default {
    filters:{
        tofixed(val, num=4) {
            return `${Number(val).toFixed(num)}%`
        }
    },
    data() {
        return {
            searchInfo:{
                productNmae: ''
            },
            // currentProduct:{},
            productopt: [],
            detailList: [],
            currentRow: {

            },
            rowIndex: null,
            prdVisible: false,
            formDataRules: { // 表单验证规则
                ValnDate: [{ required: true, message: "适用日期为必填项", trigger: "blur" }],
                IntRtYearly: [{ required: true, message: "年结算利率为必填项", trigger: "blur" }],
                IntRtDaily: [{ required: true, message: "日结算利率为必填项", trigger: "blur" }],
                PublicDate: [{required: true, message: "公布时间为必填项", trigger: "blur"}]
            },
            
        }
    },
    mounted() {
        this.getProductList('init')
    },

    methods: {
        ...mapActions('cms/settings/interesReateChange', ['getRateList', 'getRateDetail', 'getRateSave']),

        getProductList(type = '') {
            showLoading(true, "数据加载中...");
            let params = {
                page: 0,
                size: 999
            }
            this.getRateList(params).then(res => {
                // console.log('res', res)
                if(res.success) {
                    let data = res.data.resData.planInfoList
                    let tyles = ['UVL', 'GP']
                    this.productopt = data.filter(ele => tyles.includes(ele.InsType))
                    if(type&&type == 'init') {
                        this.searchInfo.productNmae = this.productopt[0].PlanCode
                    }
                    console.log('list',this.productopt)
                    this.getProductDetails()
                } else {
                    this.$message.error(res.errMsg || '服务器异常，请稍后再试!')
                }
            }).finally(() => {
                showLoading(false);
            })
        },
        getProductDetails() {
            let d = this.productopt
            let vals = d.filter(ele => ele.PlanCode == this.searchInfo.productNmae)
            console.log('vals',vals)
            if(!vals.length) return false
            let params = {
                planCode: vals[0].PlanCode,
                versNum: vals[0].VersNum,
                insType: vals[0].InsType
            }
            this.getRateDetail(params).then(res => {
                console.log('details',res)
                if(res.success) {
                    let data = res.data.resData.uvlUnitPriceInfoList || []
                    this.detailList = this.sortKey(data, 'ValnDate');
                } else {
                    this.$message.error(res.errMsg || '服务器异常，请稍后再试!')
                }
            })
        },
        checkdProduct(v) {
            // this.currentProduct = v
            this.getProductList()
        },
        changeReateRow(row, index=null) {
            if(Object.keys(row).length){
                // this.rowIndex = index
                this.currentRow = JSON.parse(JSON.stringify(row))
            } else {  // 否则就是新增
                this.currentRow = {
                    ValnDate: "",
                    IntRtDaily: "",
                    PublicDate: "",
                    IntRtYearly: "",
                }
            }
            this.rowIndex = index
            console.log('currentRow',this.currentRow, this.rowIndex)
            this.prdVisible = true
        },
        handleClose() {
            this.currentRow = this.$options.data().currentRow
            this.rowIndex = null
            this.prdVisible = false
        },
        commitPrd() {
            this.$refs.changeRef.validate(valid => {
                console.log('valid',valid)
                if (!valid) {
                    return false;
                }
                
                console.log('提交', this.currentRow)
                // this.detailList.splice(this.rowIndex, 1, this.currentRow)
                let list = JSON.parse(JSON.stringify(this.detailList))
                if(this.rowIndex == null) {
                    list.unshift(this.currentRow)
                } else {
                    list.splice(this.rowIndex, 1, this.currentRow)
                }
                
                console.log('1111111',list)
                let vals = this.productopt.filter(ele => ele.PlanCode == this.searchInfo.productNmae)
                let params = {
                    planCode: vals[0].PlanCode,
                    versNum: vals[0].VersNum,
                    insType: vals[0].InsType,
                    resData: {
                        uvlUnitPriceInfoList: [...list]
                    }
                }
                this.getRateSave(params).then(res => {
                    console.log('保存',res)
                    if(res.success) {
                        this.prdVisible = false
                        this.getProductList()
                    }
                })
            })
        },
        // 删除
        deleteReateRow(row, index) {
            this.$confirm('确定删除该条数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let list = JSON.parse(JSON.stringify(this.detailList))
                list.splice(index, 1)
                let vals = this.productopt.filter(ele => ele.PlanCode == this.searchInfo.productNmae)
                let params = {
                    planCode: vals[0].PlanCode,
                    versNum: vals[0].VersNum,
                    insType: vals[0].InsType,
                    resData: {
                        uvlUnitPriceInfoList: [...list]
                    }
                }
                this.getRateSave(params).then(res => {
                    console.log('删除保存',res)
                    if(res.success) {
                        this.prdVisible = false
                        this.getProductList()
                    }
                })
            }).catch(() => {});
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