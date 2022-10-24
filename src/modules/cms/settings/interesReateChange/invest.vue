<template>
    <div class="invest">
        <!-- 投资连结保险信息 -->
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
                <!-- <el-button type="primary" :disabled="!searchInfo.productNmae" @click="changeReateRow({}, null)">新增</el-button> -->
            </template>
            <!-- <component :is="iscomponent" :currentProduct="currentProduct" :dataList="currentData" @getProductDetails="getProductDetails"></component> -->
            <component
                :is="iscomponent"
                :currentProduct="currentProduct"
                :dataList="currentData"
                :prdVisible2="prdVisible2"
                @seaveProduct="seaveProduct"
                @deleteReateRow="deleteReateRow"
                @getProductDetails="getProductDetails"
                @dialoagChange="dialoagChange"
            ></component>
        </TableRow>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { showLoading } from "@/utils"
import growth from './component/growth.vue'
import insvestment from './component/Investment.vue'
import jinyu from './component/Jinyu.vue'
import lucky from './component/lucky.vue'
export default {
    components:{
        growth,
        insvestment,
        jinyu,
        lucky
    },
    data() {
        return {
            searchInfo: {
                productNmae: ''
            },
            iscomponent: 'growth',
            comptVal:{
                BIL01: 'growth', // 成长星
                IR001: 'insvestment', // 投资管家
                SPULB: 'jinyu', // 金玉盈盈
                SPULR: 'lucky', // 鸿运人生
            },
            productopt: [],
            detailList: [],
            currentRow: {},
            currentData: [],
            currentProduct:[],

            prdVisible2: false
        }
    },
    mounted() {
        this.getProductList('init')
    },
    methods:{
        ...mapActions('cms/settings/interesReateChange', ['getRateList', 'getInvestRateDetail', 'getInvestRateSave']),
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
                    let tyles = ['UL']
                    this.productopt = data.filter(ele => tyles.includes(ele.InsType))
                    console.log('type',type)
                    if(type&&type == 'init') {
                        this.searchInfo.productNmae = this.productopt[0].PlanCode
                    }
                    console.log('list-----------------',this.productopt)
                    this.getProductDetails(type)
                } else {
                    this.$message.error(res.errMsg || '服务器异常，请稍后再试!')
                }
            }).finally(() => {
                showLoading(false);
            })
        },
        getProductDetails(type) {
            let d = this.productopt
            let vals = d.filter(ele => ele.PlanCode == this.searchInfo.productNmae)
            console.log('vals',vals)
            this.currentProduct = vals
            if(!vals.length) return false
            let params = {
                planCode: vals[0].PlanCode,
                versNum: vals[0].VersNum,
                insType: vals[0].InsType
            }
            this.getInvestRateDetail(params).then(res => {
                console.log('details222',res)
                if(res.success) {
                    
                    // this.currentData = res.data.resData.uvlUnitPriceInfoList
                    let datas = res.data.resData || []
                    this.currentData = this.sortKey(datas, 'ValnDate');
                } else {
                    this.currentData = []
                    this.$message.error(res.errMsg || '服务器异常，请稍后再试!')
                }
            })
        },

        checkdProduct(v) {
            // this.currentProduct = v
            this.iscomponent = this.comptVal[v]
            this.getProductList()
        },
        changeReateRow() {

        },
        // 保存数据
        seaveProduct(list, val) {
            showLoading(true, "数据加载中...");
            this.prdVisible2 = val
            let d = this.productopt
            let vals = d.filter(ele => ele.PlanCode == this.searchInfo.productNmae)
            let params = {
                planCode: vals[0].PlanCode,
                versNum: vals[0].VersNum,
                insType: vals[0].InsType,
                resData: list
            }
            this.getInvestRateSave(params).then(res => {
                if(res.success) {
                    this.$message.success(res.errMsg || '操作成功!')
                    this.prdVisible2 = false
                    this.getProductDetails()
                }
            }).finally(() => {
                showLoading(false);
            })
        },
        // 删除数据
        deleteReateRow(row, index) {
            showLoading(true, "数据加载中...");
            
            let d = this.productopt
            let vals = d.filter(ele => ele.PlanCode == this.searchInfo.productNmae)
            let params = {
                planCode: vals[0].PlanCode,
                versNum: vals[0].VersNum,
                insType: vals[0].InsType,
                resData: row
            }
            this.getInvestRateSave(params).then(res => {
                if(res.success) {
                    this.$message.success(res.errMsg || '操作成功!')
                    this.prdVisible2 = false
                    this.getProductDetails()
                }
            }).finally(() => {
                showLoading(false);
            })
        },
        // 新增/修改弹框关闭
        dialoagChange(val) {
            this.prdVisible2 = val
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