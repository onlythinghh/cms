<template>
    <div>
        <TableRow :has-form="true" :has-pagination="true">
            <template v-slot:form>
                <!-- <el-row :gutter="10"> -->
                    <el-form ref="searchForm" label-width="80px" :model="searchForm">
                        <div class="search-wrapper">
                            <el-form-item label="任务名称">
                                <el-input
                                    v-model="searchForm.name"
                                    placeholder="任务名称"
                                    clearable
                                    maxlength="150"
                                />

                            </el-form-item>
                            <el-form-item label="开始时间" style="margin-right:100px;">
                                <el-date-picker
                                    v-model="time"
                                    type="daterange"
                                    range-separator="-"
                                    value-format="yyyy-MM-dd"
                                    start-placeholder="开始时间-开始"
                                    end-placeholder="开始时间-结束"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="任务状态">
                                <el-select v-model="searchForm.status" class="w100" placeholder="选择分类" clearable>
                                    <el-option 
                                        v-for="item in taskStatus" 
                                        :key="item.key" 
                                        :label="item.name"
                                        :value="item.key"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <!-- <el-form-item> -->
                                <div style="float: left">
                                    <el-button type="primary" @click="_search">查询</el-button>
                                    <el-button type="primary" @click="_close">重置</el-button>
                                </div>
                                
                            <!-- </el-form-item> -->
                        </div>
                    </el-form>
                <!-- </el-row> -->
            </template>
            <el-table border stripe :data="list" >
                <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
                
                <el-table-column prop="name" label="任务名称" align="center" min-width="200px">
                    <template v-slot="{row}">
                        <el-tooltip class="item" effect="dark" :content="row.name" placement="top">
                            <span style="color:#199ED8">{{row.name}}</span>                            
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="任务来源" align="center">
                    <template v-slot="{row}">
                        <span v-if="row.type === 1">站点</span>
                        <span v-if="row.type === 2">频道</span>
                        <span v-if="row.type === 3">文章</span>
                    </template>
                </el-table-column>
                <el-table-column prop="statusName" label="状态" align="center">
                    <!-- <template v-slot="{row}">
                        <span v-if="row.status === 1">待执行</span>
                        <span v-if="row.status === 2">执行中</span>
                        <span v-if="row.status === 3">已发布</span>
                        <span v-if="row.status === 4">挂起</span>
                    </template> -->
                </el-table-column>
                <el-table-column prop="startTime" label="开始时间" align="center" min-width="180px">
                    <template v-slot="{row}">{{row.startTime}}</template>
                </el-table-column>
                <el-table-column prop="endTime" label="结束时间" align="center" min-width="180px">
                    <template v-slot="{row}">{{row.endTime}}</template>
                </el-table-column>

                <el-table-column label="操作" width="400px" align="center">
                    <template v-slot="{row}">
                        <el-button :disabled="row.status !== 1" size="mini" type="primary" @click="_edit(row)">编辑</el-button>
                        <el-button 
                            v-if="row.isShowStartButton" 
                            :disabled="!row.isShowEndButton" 
                            size="mini" 
                            type="warning" 
                            :loading="loadingBtn"
                            @click="start(row)"
                        >启用</el-button>
                        <el-button 
                            v-show="row.status !== 4" 
                            v-if="row.isShowEndButton" 
                            :disabled="row.isShowEndButto" 
                            size="mini" 
                            type="warning" 
                            :loading="loadingBtn"
                            @click="end(row)"
                        >挂起</el-button>
                        <el-button size="mini" :disabled="rowStatus(row.status)" type="danger" @click="_delete(row)">删除</el-button>
                        <!-- <el-button size="mini" type="success" @click="_monitoring(row)">监控</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <template v-slot:pagination>
                <Pagination
                    :current-page="searchForm.page"
                    :page-size="searchForm.limit"
                    :total="total"
                    @current-change="changePagination"
                ></Pagination>
            </template>
        </TableRow>
        <EditModal v-bind="edit" @closePublishModal="closePublishModal"/>
        
    </div>
</template>

<script>
import {mapActions, mapState,mapGetters} from 'vuex'
// import { showLoading, showMessage, showError} from '@/utils'
import { showLoading,showMessage, showError} from '@/utils'
import EditModal from './edit'
export default {
    name: "",
    components:{
        EditModal
    },
    data() {
        const searchForm = {
            name: '',
            day1: '',
            day2: '',
            status: null,
            page: 1,
            limit:10,
        }
        const taskStatus = [
            {key: 1,name:'待执行'},
            {key: 2,name:'执行中'},
            {key: 3,name:'已执行'},
            {key: 4,name:'挂起'},
            // {key: 5,name:'执行中(暂停)'}
        ]
        return {
            searchForm,
            taskStatus,
            time: '',
            total:0,
            // start: '挂起',
            edit: {
                visible: false,
                info:{}
            },
            loadingBtn: false,
            isDel: false,
        };
    },
    computed: {
        ...mapState('cms/task',['list']),
        ...mapGetters('cms/site', ['site']),
        ...mapState("authen", ["userinfo"]),
    },
    watch:{
        
    },
    created() {
        this._schedulerList()
        if(this.site.id) {
            localStorage.setItem('siteId',JSON.stringify(this.site.id))
        }
        
        
    },
    mounted() {
        this.isDel = this.userinfo.roleCodes.includes("Taskprocessing") ? true : false
    },
    methods: {
        ...mapActions('cms/task',['schedulerList','schedulerProgress','deleteScheduler','startScheduler','endScheduler']),
        _schedulerList() {
            showLoading(true,'列表加载中')
            this.searchForm.day1 = '',
            this.searchForm.day2 = ''
            if(this.time !== null) {
                this.searchForm.day1 = this.time[0]
                this.searchForm.day2 = this.time[1]
            }
            
            this.schedulerList({...this.searchForm}).then(({data,count})=>{
                showLoading(false)
                this.total = count
            }) .catch(error=>{
                showLoading(false)
                showError(error.message)
            }) 
        },
        rowStatus(status) {
            let bol = this.isDel ? status === 3 : status !== 1
            return bol
        },
        _search() {
            this.searchForm.page = 1,
            this._schedulerList()
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
        },
        //编辑
        _edit(info) {
            info['both'] = '编辑'
            this.edit.visible = true
            this.edit.info = { ...info }
        },
        //监控
        _monitoring(info) {
            info['both'] = '监控'
            this.edit.visible = true
            if(info.status !== 1 && info.status !==4) {
                this.schedulerProgress({taskId: info.id}).then(data=>{
                    info['total'] = data.data.total
                    info['published'] = data.data.published
                    info['unpublished'] = data.data.unpublished
                    this.edit.info = {...info}
                }) .catch(error=>{
                    showError(error.message)
                })
            }
        },
        start(row){
            this.loadingBtn = true
            this.startScheduler({taskId: row.id}).then(data=>{
                this._schedulerList()
                showMessage(data.data)
                this.loadingBtn = false
            })
        },
        end(row) {
            this.loadingBtn = true
            this.endScheduler({taskId: row.id}).then(data=>{
                showMessage(data.data)
                this._schedulerList()
                this.loadingBtn = false
            })
        },
        
        //删除
        _delete(row) {
            this.deleteScheduler ({taskId: row.id}).then( data => {
                showMessage(data.data)
                this._schedulerList()
            }) .catch(error=>{
                showError(error.message)
            })
        },
        closePublishModal(needReload) {
            this.edit.visible = false
            needReload && this._schedulerList()
        },
        // 改变当前页
        changePagination(currentPage) {
            this.searchForm.page = currentPage
            this._schedulerList()
        },
    },
};
</script>
<style lang='scss' scoped>
/deep/ .table-form {
    border: none
}
/deep/ .has-gutter {
    th {
        background: #2F9FD2;
        color: #FFF
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
