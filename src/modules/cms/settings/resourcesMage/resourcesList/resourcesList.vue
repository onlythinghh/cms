<template>
    <div class="table_cpnst">
        <el-tabs v-model="tableActiveName" @tab-click="handleTabClick">
            <el-tab-pane v-for="tab in tabnav" :key="tab.id" :label="tab.showName" :name="tab.showName">
                <el-table ref="multipleTable" :data="tableList" :height="eheight" @selection-change="selectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="序号" width="50">
                        <template slot-scope="scope"> {{scope.$index+1}} </template>
                    </el-table-column>
                    <el-table-column prop="resourcesUrl" label="资源内容" width="100">
                        <template slot-scope="scope">
                            <img v-if="scope.row.type == 1" style="width:50px; height:40px" :src="scope.row.pcResourcesUrl" alt="" srcset="">
                            <span v-else>{{`${scope.row.fileName}.${scope.row.format}`}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="标题"></el-table-column>
                    <el-table-column prop="keyword" label="标签" width="100"></el-table-column>
                    <el-table-column prop="type" label="类型" width="100">
                        <template slot-scope="scope">{{typeTxt[scope.row.type]}}</template>
                    </el-table-column>
                    <el-table-column prop="createUser" label="作者" width="100"></el-table-column>
                    <el-table-column prop="status" label="状态" width="100">
                        <template slot-scope="scope">
                            {{statusTxt[scope.row.status]}}
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" >
                        <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
                    </el-table-column>
                    <el-table-column v-if="isLoadOperation" label="操作">
                        <template slot-scope="scope">
                            <el-button size="small" @click="lookUp(scope.row)">查看</el-button>
                            <el-button type="text" size="small" @click="changeItems(scope)">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <el-pagination
            v-if="total > 10"
            class="pages"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="limit"
            :total="total"
            layout="total, sizes, prev, pager, next"
            @size-change="sizeChange"
            @current-change="currentChange"
        ></el-pagination>
        <el-dialog
            :title="tabItem.name||'查看'"
            :visible.sync="dialogVisible"
            width="50%"
        >
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="first">
                    <el-form :label-position="'right'" label-width="85px" :model="tabItem">
                        <el-form-item label="类型">
                            <div class="item">{{typeTxt[tabItem.type]}}</div>
                        </el-form-item>
                        <el-form-item label="标签">
                            <div class="item">{{tabItem.keyword}}</div>
                        </el-form-item>
                        <el-form-item label="格式">
                            <div class="item">{{tabItem.format}}</div>
                        </el-form-item>
                        <el-form-item label="创建日期">
                            <div class="item">{{tabItem.createTime | dateFormat}}</div>
                        </el-form-item>
                        <el-form-item label="有效日期至">
                            <div v-if="tabItem.invalidTime" class="item">{{tabItem.invalidTime | dateFormat}}</div>
                            <div v-else class="item">长期有效</div>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="内容信息" name="second">
                    <el-form :label-position="'right'" label-width="85px" :model="tabItem">
                        <!-- <el-form-item label="引用页面">
                            <div class="item">{{tabItem.type}}</div>
                        </el-form-item> -->
                        <el-form-item label="浏览次数">
                            <div class="item">{{tabItem.browseCount||0}}</div>
                        </el-form-item>
                        <el-form-item label="下载次数">
                            <div class="item">{{tabItem.uploadCount||0}}</div>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { showMessage } from '@/utils'
export default {
    props:{
        searchInfo: {
            type: Object,
            default: () => {
                return {
                    name:'',
                    keyword: '',
                    status: ''
                }
            }
        },
        isLoadOperation: {
            type: Boolean,
            default: true
        },
        eheight: {
            type: String,
            default: ''
        }
    
    },
    data() {
        return {
            dialogVisible: false,
            activeName: 'first',
            tabItem: [],
            typeTxt: ['', '图片', '视频', '其他文件'],
            statusTxt: ['待发布', '已发布', '已下线'],
            tableActiveName: '全部',
            tableList: [],
            tabIndex: '0',
            tabnav:[
                {id:'0', showName: '全部'},
                {id:'1', showName: '图片'},
                {id:'2', showName: '视频'},
                {id:'3', showName: '其他'},
            ],
            page: 1,
            total: 0, //总条数
            limit: 30, // 每页条数
            tableItemSelected: [], // 表格被勾选的数据
        }
    },
    mounted(){
        this.queryRresourcesList()
    },
    methods:{
        ...mapActions('cms/settings/resourcesMage', ['getresourcesList']),

        // 获取列表数据
        queryRresourcesList() {
            let params = {
                page: this.page,
                limit: this.limit,
                type: this.tabIndex,
                ...this.searchInfo
            }
            console.log('参数', params)
            this.getresourcesList(params).then(res => {
                console.log('资源列表：', res)
                if(res.success) {
                    this.tableList = res.data
                    this.total = res.count
                }else {
                    showMessage({
                        type: "error",
                        message: res.errMsg || '服务器异常,请稍后再试!'
                    });
                }
            })
        },
        // 选择多选框
        selectionChange(val){
            console.log('itemselect', val)
            this.tableItemSelected = val;
            this.$emit('selectionChange', val)
        },
        lookUp(data) {
            this.tabItem = data
            this.dialogVisible = true
        },
        // 修改当前行
        changeItems(scop){
            // console.log('修改当前行:',scop)
            this.$emit('changeItems', scop.row, scop.$index)
        },

        // 清除选中框
        clearTableSelection() {
            this.$refs.multipleTable.clearSelection();
        },

        // tab切换
        handleTabClick(val){
            // type: '0':全部  '1': 图片  '2': 视频  '3': 其他
            this.tabIndex = val.index
            console.log('切换tab:',this.tabIndex, val)
            this.queryRresourcesList() // 重新获取数据
            // tab切换时清楚选中的多选框
            // this.$nextTick(() => {
            //     this.$refs.multipleTable.clearTableSelection()
            //     // for(let i=0; i<this.$refs.multipleTable.length; i++) {
            //     //     this.$refs.multipleTable[i].clearTableSelection()
            //     // }
            // })
        },
        // 每页数量切换
        sizeChange(v) {
            this.limit = v
            this.queryRresourcesList()
            // this.$emit('sizeChange', v)
        },
        // 分页
        currentChange(v) {
            this.page = v
            this.queryRresourcesList()
            // this.$emit('currentChange', v)
        }
    }
}
</script>
<style lang="scss" scoped>
.table_cpnst{
    /deep/ .el-dialog__header{
        text-align: center;
    }
    /deep/ .el-dialog__body{
        padding-top: 0;
    }
    /deep/ .el-dialog__footer{
        text-align: center;
    }
    .pages{
        margin-top: 10px;
    }
    .item{
        color: #999999;
    }
}

</style>