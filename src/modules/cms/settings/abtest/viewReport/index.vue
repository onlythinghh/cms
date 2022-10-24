<template>
    <div class="view_report">
        <div class="updata_cont">
            <span v-show="newTimer">更新于{{newTimer}}</span>
            <el-button type="primary" @click="initData">更新</el-button>
            <el-button @click="goback">返回</el-button>
        </div>
        <div class="report target_cont">
            <div class="target_top">
                <div class="tit">关注指标</div>
                <div class="record">
                    <el-button type="text" size="mini" @click="reportDownload">下载报告</el-button>
                    <el-button type="text" size="mini" @click="getDetailLog">操作记录</el-button>
                </div>
            </div>
            <div class="target_table">
                <el-table id="infoTabs" :data="tableData">
                    <!-- 循环列表内容 -->
                    <!-- <el-table-column v-for="(item, index) in tableTitle" :key="index" :prop="item.prop" :label="item.name"></el-table-column> -->
                    <el-table-column label="实验分组" prop="parentName"></el-table-column>
                    <el-table-column label="进组人数" prop="parentCount"></el-table-column>
                    <el-table-column label="指标名称" prop="name"></el-table-column>
                    <el-table-column label="指标点击量" prop="content"></el-table-column>
                </el-table>
            </div>
        </div>
        <div class="report target_echarts">
            <div class="top_info">
                <el-radio-group v-model="sharchInfo.freq" size="mini">
                    <el-radio-button label="day">天</el-radio-button>
                    <el-radio-button label="hour">小时</el-radio-button>
                    <el-radio-button label="minute">分钟</el-radio-button>
                </el-radio-group>
                <el-date-picker
                    v-model="sharchInfo.time"
                    type="daterange"
                    size="mini"
                    value-format="yyyy-MM-dd"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="margin: 0 10px"
                ></el-date-picker>
                <el-button type="primary" size="mini" @click="getReporeDataDetail">查询</el-button>
            </div>
            <div v-for="(item, idx) in echartDataLen" :id="'myCharts'+idx" :key="idx" class="echarts_main" style="width: 100%;height:500px;"></div>
            <el-empty v-if="echartDataLen.length <= 0" description="暂无数据"></el-empty>
        </div>
       <el-dialog
            :visible.sync="showLog"
            class="show_tst_Info"
            title="操作记录"
            width="60%"
        >
            <el-table ref="logList" :data="logList" class="logList">
                <el-table-column label="操作人" prop="updateUser"></el-table-column>
                <el-table-column label="操作时间" prop="upateTime">
                    <template v-slot="{ row }">{{ row.upateTime | dateFormat }}</template>
                </el-table-column>
                <el-table-column label="测试名称" prop="name"></el-table-column>
                <el-table-column label="操作" prop="operation"></el-table-column>
                <el-table-column label="内容描述" prop="description"></el-table-column>
            </el-table>
            <el-pagination
                v-if="total > 10"
                class="pages"
                :page-sizes="[20, 30, 40, 50]"
                :page-size="logPages.size"
                :total="total"
                layout="total, sizes, prev, pager, next"
                @size-change="sizeChange"
                @current-change="currentChange"
            ></el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showLog = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { queryUrlString, deepCopy, dateFormat } from '@/utils/BaseUtil'
import * as myEcharts from 'echarts'
export default {
    data() {
        return {
            testId: '',
            indicator: '',
            // tableTitle:[
            //     {name: '实验分组', prop: 'grouping'},
            //     {name: '进组人数', prop: 'number'},
            //     {name: '点击人数', prop: 'clicks'}
            // ],
            // tableData:[
            //     {grouping: '123', number: '111', clicks: '123'}
            // ],
            tableData:[],
            sharchInfo:{
                freq: 'day',
                beginDate: '',
                endDate: '',
                time:'',
            },
            echartDataLen: [], // 图表数量（取决于数据长度）
            newTimer: '',
            logPages: {
                page: 0,
                size: 10
            },
            logList: [],
            showLog: false,
            total: 0
            
        }
    },
    mounted(){
        this.testId = queryUrlString('testId')
        this.indicator = queryUrlString('indicator')
        this.initData()
    },
    methods:{
        ...mapActions('cms/settings/abtest', ['getABtestReport', 'getABtestReportDetail',
            'getABtestDetailLog',
            'getABtestReportDownload'
        ]),
        ...mapActions('cms/settings/poll',['pollStatistics']),
        initData(){
            this.getReporeData()
            this.getReporeDataDetail()
            this.newTimer = dateFormat(new Date().getTime())
        },
        getReporeData(){
            let params = {
                testId: this.testId
            }
            this.getABtestReport(params).then(res => {
                console.log('详情数据：', res)
                if(res.success){
                    let list = res.data.groups || []
                    let tmp = []
                    if(list.length> 0) {
                        list.forEach(item => {
                            item.indicators.forEach(ele => {
                                ele.parentName = item.name
                                ele.parentCount = item.count
                                tmp.push(ele)
                            });
                            return item.indicators
                        })
                        this.tableData = tmp
                        console.log('tmp::::', tmp)
                    }
                } else {
                    this.$message.error(res.errMsg||'服务器繁忙，请稍后再试！')
                }
            })
        },
        getReporeDataDetail(){
            let { freq, time } = this.sharchInfo
            let params = {
                testId: this.testId,
                // indicator: this.indicator,
                freq: freq, //'hour',
                beginDate: time.length > 0 ? time[0] :'',
                endDate: time.length > 0 ? time[1] :'',
            }
            this.getABtestReportDetail(params).then(res => {
                console.log('详情数据222：', res)
                if(res.success){
                    this.echartDataLen = res.data
                    setTimeout(() => {
                        let data = deepCopy(res.data)
                        data.forEach((ele, idx) => {
                            this.queryEchart(ele, idx)
                        })
                    },1000)
                    
                    
                } else {
                    this.$message.error(res.errMsg||'服务器繁忙，请稍后再试！')
                }
            })
        },
        // 操作记录
        getDetailLog() {
            this.getABtestDetailLog({...this.logPages}).then(res => {
                let { success, data } = res
                if(success) {
                    this.showLog = true
                    this.logList = data.content || []
                    this.total = res.total
                } else {
                    this.showLog = false
                    this.$message.error(res.errMsg||'服务器繁忙，请稍后再试！')
                }
            })
        },
        sizeChange(v){
            this.logPages.size = v
            this.getDetailLog()
        },
        currentChange(v){
            this.logPages.page = v
            this.getDetailLog()
        },
        // 下载报告
        reportDownload() {
            this.getABtestReportDownload({testId: this.testId}).then(res => {
                console.log('下载报告：',res)
                if(res.success) {
                    this.$message.success(res.message)
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        queryEchart( list, index){
            console.log('list2222',list)
            if(list.length < 1) return false

            let labels = list.labels
            let seriesArr = [] // 数据线
            let legendArr = []
            // list.forEach(item => {
            let obj = {
                name: list.action,
                type: 'line',
                stack: 'Total',
                data: list.count
            }
            seriesArr.push(obj)
            legendArr.push(list.action)
            // })
            console.log('渲染表格数据',seriesArr)
            let { freq } = this.sharchInfo
            let type = freq == 'day' ? '天': freq == 'hour' ? '时' : '分'
            let options = {
                title: {
                    text: `${seriesArr[0].name} (${type}级趋势)`
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: { // 顶部示意图
                    top: '25px',
                    data: legendArr
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                // toolbox: {
                //     feature: {
                //     saveAsImage: {}
                //     }
                // },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: labels // x轴 title
                },
                yAxis: {
                    type: 'value'
                },
                series: seriesArr
            };
            this.$nextTick(function() {
                let div1 = document.getElementById(`myCharts${index}`)
                div1.style.width = '100%';
                div1.style.height = '500px';
                const myChart = myEcharts.init(document.getElementById(`myCharts${index}`));
                myChart.setOption(options)
            })
        },
        goback() {
            this.$router.go(-1);
        }
    }
}
</script>
<style lang="scss" scoped>
.view_report{
    .updata_cont{
        text-align: right;
        margin: 10px;
        span{
            margin-right: 10px;
        }
    }
    .report{
        padding: 10px;
        background: #f6f6f6;
        margin: 10px;
        .target_top{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }
        &.target_echarts{
            border: 1px solid #f6f6f6;
        }
        .top_info{
            padding: 15px 0;
            background: #f6f6f6;
        }
        .echarts_main{
            background: #ffffff;
            margin-bottom: 15px;
            width: 100%;
            height: 500px;
        }
    }
}
</style>