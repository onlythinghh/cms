<template>
    <div>
        <!-- <div class="siteSee">站点查询</div> -->
        <el-tabs v-model="activeName" tab-position="left" style="float:left" @tab-click="handleClick">
        <!--
            <el-tab-pane label="按访问量统计" name="visit">
                <el-row>
                    <el-col :span="24">
                        <div class="title">
                            <div class="title-1"></div>
                            <div class="title-2">访问量统计信息</div> 
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <div class="timer">
                            <span class="article">开始日期：</span>
                            <div class="block">
                                <el-date-picker
                                    v-model="visitTimer.startTime"
                                    type="date"
                                    value-format="timestamp"
                                    placeholder="选择创建日期"
                                >
                                </el-date-picker>
                            </div>
                            <span class="article" style="margin: 0 28px;">到</span>
                            <div class="block">
                                <el-date-picker
                                    v-model="visitTimer.endTime"
                                    type="date"
                                    value-format="timestamp"
                                    placeholder="选择结束日期"
                                >
                                </el-date-picker>
                            </div>
                            <div style="float:left;margin-left: 49px">
                                <el-button style="background:#2E9CD1;color: #FFF;width: 100px;height:35px" @click="serchSite">查询</el-button>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <el-table
                            id="out-table4"
                            :data="statVisit"
                            border
                            stripe
                            style="width: 100%"
                        >
                            <el-table-column
                                prop="login"
                                label="员工访问次数"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="logout"
                                label="游客访问次数"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="num"
                                label="总访问次数"
                            >
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>

                <el-row style="margin:30px 0"> 
                    <el-col :span="24">
                        <div class="title">
                            <div class="title-1"></div>
                            <div class="title-2">员工访问次数明细</div> 
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <el-table
                            id="out-table4"
                            :data="userVisit"
                            border
                            stripe
                            style="width: 100%"
                        >
                            <el-table-column
                                prop="account"
                                label="账号"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="username"
                                label="姓名"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="count"
                                label="次数"
                            >
                            </el-table-column>
                        </el-table>
                         <el-pagination
                            :current-page="visituserTimer.page"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="visituserTimer.limit"
                            layout="total, sizes, prev, pager, next"
                            :total="total"
                            style="float:right;margin-top:30px"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
>
                            </el-pagination>
                    </el-col>
                </el-row>
            </el-tab-pane>
            -->
            <el-tab-pane label="按站点统计" name="site">
                <el-row>
                    <el-col :span="24">
                        <div class="title">
                            <div class="title-1"></div>
                            <div class="title-2">站点统计信息</div> 
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <div class="timer">
                            <span class="article">文章创建日期：</span>
                            <div class="block">
                                <el-date-picker
                                    v-model="siteTimer.day1"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择创建日期"
                                >
                                </el-date-picker>
                            </div>
                            <span class="article" style="margin: 0 28px;">到</span>
                            <div class="block">
                                <el-date-picker
                                    v-model="siteTimer.day2"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择结束日期"
                                >
                                </el-date-picker>
                            </div>
                            <!-- <div style="float: left">
                                <div style="float: left; line-height:35px;margin-left: 20px">用户名：</div> 
                                <div style="float: left">
                                    <el-input v-model="siteTimer.name" style="width: 200px;"></el-input>
                                </div>
                            </div> -->
                            <div style="float:left;margin-left: 49px">
                                <el-button style="background:#2E9CD1;color: #FFF;width: 100px;height:35px" @click="serchSite">查询</el-button>
                                <el-button style="background:#2E9CD1;color: #FFF;width: 100px;height:35px" @click="exportExcel('out-table1')">
                                    导出</el-button>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <el-table
                            id="out-table1"
                            :data="statSite"
                            border
                            stripe
                            style="width: 100%"
                        >
                            <el-table-column
                                prop="name"
                                label="站点名称"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="channelNumber"
                                label="频道数量"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="templateNumber"
                                label="模板数量"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="releasedArticleNumber"
                                label="已发布文章数量"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="allArticleNumber"
                                label="总的文章数量"
                            >
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="按频道统计" name="channel">
                <el-row>
                    <el-col :span="24">
                        <div class="title">
                            <div class="title-1"></div>
                            <div class="title-2">频道统计信息</div> 
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <div class="timer">
                            <span class="article">文章创建日期：</span>
                            <div class="block">
                                <el-date-picker
                                    v-model="channelTimer.day1"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择创建日期"
                                >
                                </el-date-picker>
                            </div>
                            <span class="article" style="margin: 0 28px;">到</span>
                            <div class="block">
                                <el-date-picker
                                    v-model="channelTimer.day2"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择结束日期"
                                >
                                </el-date-picker>
                            </div>
                            <!-- <div style="float: left">
                                <div style="float: left; line-height:35px;margin-left: 20px">用户名：</div> 
                                <div style="float: left">
                                    <el-input v-model="channelTimer.name" style="width: 200px;"></el-input>
                                </div>
                            </div> -->
                            <div style="float:left;margin-left: 49px">
                                <el-button style="background:#2E9CD1;color: #FFF;width: 100px;height:35px" @click="serchSite">查询</el-button>
                                <el-button style="background:#2E9CD1;color: #FFF;width: 100px;height:35px" @click="exportExcel('out-table2')">
                                    导出</el-button>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <el-table
                            id="out-table2"
                            :data="statChannel"
                            border
                            stripe
                            row-key="id"
                            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                            style="width: 100%"
                        >
                            <el-table-column
                                prop="name"
                                label="频道名称"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="allArticleNumber"
                                label="所有文章数量"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="draftArticleNumber"
                                label="文章草稿数量"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="releasedArticleNumber"
                                label="已发布文章数量"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="reviewedArticleNumber"
                                label="审核中文章数量"
                            >
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="按用户统计" name="user">
                <el-row>
                    <el-col :span="24">
                        <div class="title">
                            <div class="title-1"></div>
                            <div class="title-2">用户统计信息</div> 
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <div class="timer">
                            <span class="article">文章创建日期：</span>
                            <div class="block">
                                <el-date-picker
                                    v-model="userTimer.day1"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择创建日期"
                                >
                                </el-date-picker>
                            </div>
                            <span class="article" style="margin: 0 28px;">到</span>
                            <div class="block">
                                <el-date-picker
                                    v-model="userTimer.day2"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择结束日期"
                                >
                                </el-date-picker>
                            </div>
                            <div style="float: left">
                                <div style="float: left; line-height:35px;margin-left: 20px">用户名：</div> 
                                <div style="float: left">
                                    <el-input v-model="userTimer.userName" style="width: 200px;"></el-input>
                                </div>
                            </div>
                            <div style="float:left;margin-left: 49px">
                                <el-button style="background:#2E9CD1;color: #FFF;width: 100px;height:35px" @click="serchSite">查询</el-button>
                                <el-button style="background:#2E9CD1;color: #FFF;width: 100px;height:35px" @click="exportExcel('out-table3')">
                                    导出</el-button>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <el-table
                            id="out-table3"
                            :data="statUser"
                            border
                            stripe
                            style="width: 100%"
                        >
                            <el-table-column
                                prop="userName"
                                label="用户名称"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="deptName"
                                label="部门名称"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="allArticleNumber"
                                label="所有文章数量"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="draftArticleNumber"
                                label="文章草稿数量"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="releasedArticleNumber"
                                label="发布文章数量"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="createdArticleDate"
                                label="文章创建日期"
                            >
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <!--
            <el-tab-pane label="按部门统计" name="org">
                <el-row>
                    <el-col :span="24">
                        <div class="title">
                            <div class="title-1"></div>
                            <div class="title-2">部门统计统计信息</div> 
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <div class="timer">
                            <span class="article">文章创建日期：</span>
                            <div class="block">
                                <el-date-picker
                                    v-model="deptTimer.day1"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择创建日期"
                                >
                                </el-date-picker>
                            </div>
                            <span class="article" style="margin: 0 28px;">到</span>
                            <div class="block">
                                <el-date-picker
                                    v-model="deptTimer.day2"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择结束日期"
                                >
                                </el-date-picker>
                            </div>
                            <div style="float: left">
                                <div style="float: left; line-height:35px;margin-left: 20px">部门：</div> 
                                <div style="float: left">
                                    <el-select
                                        v-model="deptTimer.org"
                                        placeholder="请选择"
                                        clearable
                                    >
                                        <el-option
                                            v-for="(text, key) in articleOrg"
                                            :key="key"
                                            :label="text"
                                            :value="Number(key)"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div style="float:left;margin-left: 49px">
                                <el-button style="background:#2E9CD1;color: #FFF;width: 100px;height:35px" @click="serchSite">查询</el-button>
                                <el-button style="background:#2E9CD1;color: #FFF;width: 100px;height:35px" @click="exportExcel('out-table4')">
                                    导出</el-button>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <el-table
                            id="out-table4"
                            :data="statDept"
                            border
                            stripe
                            style="width: 100%"
                        >
                            <el-table-column
                                prop="deptName"
                                label="部门名称"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="channelName"
                                label="频道名称"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="allArticleNumber"
                                label="所有文章数量"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="releasedArticleNumber"
                                label="发布文章数量"
                            >
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-tab-pane>
            -->
        </el-tabs>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import { showLoading, showError, } from '@/utils'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
    name:'SiteView',
    data () {
        return {
            statSite:[],
            statChannel:[],
            statUser:[],
            statDept:[],
            statVisit:[],
            userVisit:[],
            tabsName: 'site',
            activeName:'site',
            siteTimer:{
                day1: '',
                day2: '',
            },
            channelTimer:{
                day1: '',
                day2: '',
                appId: '',
            },
            userTimer:{
                day1: '',
                day2: '',
                userName: ''
            },
            deptTimer:{
                day1: '',
                day2: '',
                appId:'',
                userName: ''
            },
            visitTimer:{
                startTime:new Date().getTime(),
                endTime: new Date().getTime(),
            },
            visituserTimer:{
                page:1,
                limit:10
            },
            total:0
        };
    },
    computed: {
        // ...mapState('cms/site/siteview',['statSite','statChannel','statUser'])
        ...mapGetters('cms/site',['site']),
        ...mapGetters('authen', ['getDictionary']),
        articleOrg() {
            return this.getDictionary("articleOrg");
        },
    },
    created() {
        this.reloadVisit()
    },
    methods: {
        ...mapActions('cms/site/siteview',['siteAnalysis','channelAnalysis','userAnalysis','deptAnalysis','visitAnalysis','visituserAnalysis']),

        handleClick(tab,event) {
            this.tabsName = tab.name
            if(tab.name === 'site') this.reloadSite()
            if(tab.name === 'channel') this.reloadChannel()
            if(tab.name === 'user') this.reloadUser()
            if(tab.name === 'org') this.reloadDept()
            if(tab.name === 'visit') this.reloadVisit()
        },
        
        reloadSite() {
            showLoading(true, '正在加载数据')
            this.siteAnalysis({...this.siteTimer}).then((data) => {
                this.statSite = data
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        reloadChannel() {
            // this.channelTimer.appId = this.$store.state['cms/site'].site.id
            this.channelTimer.appId = this.site.id
            showLoading(true, '正在加载数据')
            this.channelAnalysis({...this.channelTimer}).then((data) => {
                this.statChannel = data
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        reloadUser() {
            showLoading(true, '正在加载数据')
            this.userAnalysis({...this.userTimer}).then((data) => {
                this.statUser = data
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        reloadDept() {
            this.deptTimer.appId = this.site.id
            showLoading(true, '正在加载数据')
            this.deptAnalysis({...this.deptTimer}).then((data) => {
                this.statDept = data
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        reloadVisit() {
            showLoading(true, '正在加载数据')
            this.visitAnalysis({...this.visitTimer}).then((data) => {
                if(data){
                    this.statVisit = []
                    this.statVisit.push(data)
                }else{
                    this.statVisit = []
                }
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
            this.visituser()
        },
        //查询
        serchSite() {
            if(this.tabsName === 'site') this.reloadSite()
            if(this.tabsName === 'channel') this.reloadChannel()
            if(this.tabsName === 'user') this.reloadUser()
            if(this.tabsName === 'org') this.reloadDept()
            if(this.tabsName=== 'visit') this.reloadVisit()
        },
        exportExcel (id) {
            /* out-table关联导出的dom节点  */
            var wb = XLSX.utils.table_to_book(document.querySelector(`#${id}`))
            /* get binary string as output */
            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
            try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '统计.xlsx')
            } catch (e) {
                showError(e)
            }
            return wbout
        },

        handleSizeChange(val) {
            this.visituserTimer.limit = val
            this.visituser()
        },
        handleCurrentChange(val) {
            this.visituserTimer.page = val
            this.visituser()
        },
        visituser(){
            showLoading(true)
            this.visituserTimer.startTime = this.visitTimer.startTime
            this.visituserTimer.endTime = this.visitTimer.endTime
            this.visituserAnalysis({...this.visituserTimer}).then((data) => {
                this.userVisit = data.data
                this.total= data.count
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        }

    },

}

</script>
<style lang='scss' scoped>
.siteSee {
    width:208px;
    height:48px;
    background:rgba(46,156,209,1);
    font-size: 20px;
    font-family:PingFang SC;
    color: #FFF;
    font-weight: bold;
    font-size: 100%;
    line-height: 48px;
    text-align: center;
    float: left;
}
/deep/ .el-tabs__content {
}
/deep/ .el-tabs--left, .el-tabs--right {
    overflow: visible
}
/deep/ .el-tabs__item {
    width: 208px;
    text-align: center !important;
    font-size: 16px;
    font-weight: bold;
    font-size: 96%;
}
/deep/ .el-tabs__nav {
    color: #333333;
    font-family:PingFang SC;
    & .is-active {
        background: #DFEFFE;
        color: #333;
    }
    & :hover {
        background: #DFEFFE;
        color: #333;
    }
    & .el-tabs__active-bar {
        display: none
    }
}

/deep/ .el-tabs__nav-wrap{
    &::after {
        display: none;
    }
}
.title {
    height: 37px;
    background: #F5F5F5;
    line-height:37px;
    .title-1 {
        width: 3px;
        height: 17px;
        background: #2E9CD1;
        float: left;
        line-height:37px;
        margin: 12px 5px 0 21px;
    }
    .title-2 {
        font-size:22px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
        float: left;
    }
}
.timer {
    height: 35px;
    margin: 36px 0 30px 29px;

    .article {
        font-size:18px;
        font-family:PingFang SC;
        font-weight:bold;
        color:#333;
        font-size:97%;
        float: left;
        line-height: 35px
    }
    .block {
        float: left
    }
}
/deep/ .has-gutter {
    th {
        background: #2E9CD1;
        color:  #FFF
    }
}
/deep/ .cell {
    font-weight: bold
}

</style>