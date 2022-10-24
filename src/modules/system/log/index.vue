<template>
    <div>
        <TableRow :has-form="true" :has-pagination="true">
            <template v-slot:form>
                <!-- <el-row :gutter="10"> -->
                    <el-form ref="searchForm" label-width="80px" :model="searchForm">
                        <div class="search-wrapper">
                            <el-form-item label="用户账号">
                                <el-input
                                    v-model="searchForm.account"
                                    placeholder="用户账号"
                                    clearable
                                    maxlength="50"
                                />

                            </el-form-item>
                            <el-form-item label="操作时间" style="margin-right:200px;">
                                <el-date-picker
                                    v-model="time"
                                    type="datetimerange"
                                    range-separator="-"
                                    value-format="timestamp"
                                    start-placeholder="开始时间-开始"
                                    end-placeholder="开始时间-结束"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="类型">
                                <el-select v-model="searchForm.type" class="w100" placeholder="选择分类" clearable>
                                    <el-option 
                                        v-for="(item, index) in logActionMap"
                                        :key="index" 
                                        :label="item"
                                        :value="index"
                                        clearable
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="模块">
                                <el-select v-model="searchForm.module" class="w100" placeholder="选择分类" clearable>
                                    <el-option 
                                        v-for="(item, index) in logModule"
                                        :key="index" 
                                        :label="item"
                                        :value="index"
                                        clearable
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <!-- <el-form-item> -->
                                <div style="float: right;margin-bottom:20px">
                                    <el-button type="primary" @click="_search">查询</el-button>
                                    <el-button type="primary" @click="_close">重置</el-button>
                                </div>
                            <!-- </el-form-item> -->
                        </div>
                    </el-form>
                <!-- </el-row> -->
            </template>
            <el-table border stripe :data="list" >
                <el-table-column type="index" label="序号" width="100" align="center" :index="indexMethod"></el-table-column>
                <el-table-column prop="operatorId" label="用户ID" align="center" min-width="200px">
                </el-table-column>
                <el-table-column prop="operatorAccount" label="用户账号" align="center" min-width="100px">
                </el-table-column>
                <el-table-column prop="ip" label="用户IP" align="center" min-width="200px">
                </el-table-column>
                <!-- <el-table-column prop="statusName" label="账号状态" align="center"  min-width="100px"> -->
                    <!-- <template v-slot="{row}">
                        <span v-if="row.status === 1">待执行</span>
                        <span v-if="row.status === 2">执行中</span>
                        <span v-if="row.status === 3">已发布</span>
                        <span v-if="row.status === 4">挂起</span>
                    </template> -->
                <!-- </el-table-column> -->
                <el-table-column prop="time" label="操作时间" align="center" min-width="180px">
                    <template v-slot="{row}">{{formatDate(row.time)}}</template>
                </el-table-column>
                <el-table-column prop="module" label="操作模块" align="center" min-width="200px">
                </el-table-column>
                <el-table-column prop="actionName" label="操作类型" align="center" min-width="100px">
                </el-table-column>
                <el-table-column prop="success" label="操作结果" align="center" min-width="100px">
                    <template v-slot="{row}">
                        <span v-if="row.success">成功</span>
                        <span v-else>失败</span>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="操作详情" align="center" min-width="200px">
                </el-table-column>
            </el-table>
            <template v-slot:pagination>
                <Pagination
                    layout="total,prev,pager,next"
                    :current-page="searchForm.page"
                    :page-size="searchForm.limit"
                    :total="total"
                    @current-change="changePagination"
                ></Pagination>
            </template>
        </TableRow>
        <div class="dis" :style="'display:'+disStyle">
            <el-button type="text" style="margin-left: 10px;" icon="el-icon-star-off" @click="dis = true"/>
            <el-dialog :visible.sync="dis" :before-close="disClose" center top="10vh">
                <el-form ref="disForm" :model="disForm" label-width="60px">
                    <el-form-item label="接口" prop="url" :rules="{required: true, message: '接口不能为空', trigger: 'blur'}">
                        <el-input v-model="disForm.url" clearable >
                            <el-select slot="prepend" v-model="disForm.type" style="width:120px">
                                <el-option label="GET" value="1"></el-option>
                                <el-option label="POST-data" value="2" ></el-option>
                                <el-option label="POST-json" value="3" ></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-row style="max-height:50vh;overflow: auto;">
                        <div v-for="(domain,index) in disForm.domains" :key="index">
                            <el-col :span="11">
                                <el-form-item 
                                    label-width="100px"
                                    :label="'参数'+(index+1)"
                                    :prop="'domains.'+ index +'.value'"
                                    :rules="{required:true,message:'参数名不能为空',trigger:'blur'}"
                                >
                                    <el-input v-model="domain.value" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item 
                                    :prop="'domains.'+ index +'.key'"
                                    :rules="{required:true,message:'参数值不能为空',trigger:'blur'}"
                                >
                                    <el-input v-model="domain.key" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="2">
                                <el-button type="text" style="margin-left: 10px;" icon="el-icon-delete" @click="remove(index)"></el-button>
                            </el-col>
                        </div>
                    </el-row>
                    <el-form-item label="返回值">
                        <el-input v-model="disRes" type="textarea" :rows="3" />
                    </el-form-item>
                </el-form>
            <div slot="footer">
                <el-button type="primary" @click="_ajax">发 送</el-button>
                <el-button type="primary" @click="adddata">新增参数</el-button>
                <el-button style="margin-left:10px" @click="disClose">取 消</el-button>
            </div>
        </el-dialog>
        </div>
    </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import { showLoading, showError} from '@/utils'
export default {
    name: "",
    data() {
        const searchForm = {
            account: '',
            start: '',
            end: '',
            module:"",
            type: "",
            page: 1,
            limit:50,
        }
        return {
            searchForm,
            time: '',
            disForm:{
                url:'',
                type:"1",
                heade:false,
                domains:[{value:'',key:''}]
            },
            disRes:'',
            total:0,
            dis:false,
            disStyle:'none',
            // start: '挂起',
            edit: {
                visible: false,
                info:{}
            },
            loadingBtn: false,
            list:[]
        };
    },
    computed: {
        ...mapGetters('authen', ['getDictionary']),
        ...mapGetters('cms/site', ['site']),
        logActionMap() {
            return this.getDictionary('logActionMap')
        },
        logModule(){
            return this.getDictionary('logModule')
        }
    },
    watch:{
        dis(v){
            this.disStyle = v?'block':'none'
        }
    },
    created() {
        this._logList()
        if(this.site.id) {
            localStorage.setItem('siteId',JSON.stringify(this.site.id))
        }
    },
    methods: {
        ...mapActions('system/log',['logList','ajaxGet','ajaxForm','ajaxJson']),
        indexMethod(index){
            index = (index+1)+(this.searchForm.page-1)*this.searchForm.limit
            return index
        },
        _logList() {
            showLoading(true,'列表加载中')
            this.searchForm.start = '',
            this.searchForm.end = ''
            if(this.time !== null) {
                this.searchForm.start = this.time[0]
                this.searchForm.end = this.time[1]
            }
            
            this.logList({...this.searchForm}).then(({data,count})=>{
                showLoading(false) 
                this.list = data
                this.total = count
            }) .catch(error=>{
                showLoading(false)
                showError(error.message)
            }) 
        },
        _search() {
            this.searchForm.page = 1,
            this._logList()
        },
        _close() {
            this.searchForm = {
                name: '',
                day1: '',
                day2: '',
                status: null,
                page: 1,
                limit:10,
            },
            this.time = []
            this._logList()
        },
        // 改变当前页
        changePagination(currentPage) {
            this.searchForm.page = currentPage
            this._logList()
        },
        formatDate(date) {
            date = new Date(date);
            var YY = date.getFullYear() + '-';
            var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
            var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
            return YY + MM + DD +" "+hh + mm + ss;
        },
        _ajax(){
            this.$refs.disForm.validate(async v=>{
                if(!v){
                    return false
                }
                this.disRes = ''
                let data = {}
                let res = null
                this.disForm.domains.forEach(ele => {
                    data[ele.value] = ele.key
                });
                if(this.disForm.type==1){
                    let _data = '?'
                    Object.keys(data).forEach(i=>{
                        _data+=i+'='+data[i]+"&"
                    })
                    res = await this.ajaxGet({
                        url:this.disForm.url+_data.slice(0,-1),
                    })
                }else if(this.disForm.type==2){
                    res = await this.ajaxForm({url:this.disForm.url,data})
                }else if(this.disForm.type==3){
                    res = await this.ajaxJson({url:this.disForm.url,data})
                }
                this.disRes = JSON.stringify(res)
            })
        },
        adddata(){
            this.disForm.domains.push({value:'',key:''})
        },
        remove(i){
            this.disForm.domains.splice(i,1)
        },
        disClose(){
            this.dis = false
        }
    },
};
</script>
<style lang='scss' scoped>
/deep/ .table-form {
    border: none !important;
    border-bottom:none;
    
}
/deep/ .has-gutter {
    th {
        background: #2F9FD2;
    }
}
.search-wrapper {
    float: left;
    /deep/ .el-form-item--medium {
        float: left
    }
    /deep/ .el-form-item {
        margin-right: 20px;

        &:last-child {
            .el-form-item__content {
                width: auto;
            }
        }

        .el-form-item__content {
            width: 250px;
            
        }
    }
}
/deep/ .cell {
    @include ellipsisMultiline(2)
}
</style>
