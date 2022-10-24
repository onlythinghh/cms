<template>
<!-- 数据管理 -->
    <div class="data_manage">
        <TableRow :has-form="true" :has-header="true" :has-pagination="true">
            <template v-slot:form>
                <el-form ref="searchRef" label-width="0px" :model="searchInfo">
                    <el-row :gutter="10">
                        <el-col :span="24">
                            <el-form-item>
                                <el-radio-group v-model="searchInfo.attrType" size="small" @change="onChangeType">
                                    <el-radio-button
                                        v-for="item in attrTypeOpt"
                                        :key="item.value"
                                        :label="item.value"
                                    >{{item.name}}</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col v-show="false">
                            <el-form-item>
                                <el-input
                                    v-model="searchInfo.keyword"
                                    placeholder="请输入名称"
                                    clearable
                                    style="width: 240px; margin-right: 10px"
                                    maxlength="30"
                                />
                                <el-button type="primary" @click="queryDataList">查询</el-button>
                                <el-button @click="restQueryDataList">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
            <el-table ref="tableList" :data="dataList" class="tableList">
                <el-table-column label="事件名称" prop="name"></el-table-column>
                <el-table-column label="分组" prop="group"></el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime|dateFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="itemDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                v-if="dataTotal > 10"
                class="pages"
                :page-sizes="[10, 20, 30, 40, 50]"
                :page-size="pageInfo.size"
                :total="dataTotal"
                layout="total, sizes, prev, pager, next"
                @size-change="sizeChange"
                @current-change="currentChange"
            ></el-pagination>
        </TableRow>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            searchInfo: {
                attrType: '0',
                keyword: ''
            },
            attrTypeOpt: [
                {name: '基础事件', value: '0'},
                {name: '用户属性', value: '1'},
                {name: '事件属性', value: '2'}
            ],
            dataList: [],
            dataTotal: 0,
            pageInfo: {
                size: 10,
                page: 1
            }
        }
    },
    mounted(){
        this.queryDataList()
    },
    methods:{
        ...mapActions('cms/settings/dataManage', ['getIndicatorAction']),
        // 查询数据列表
        queryDataList() {
            let data = {
                ...this.searchInfo,
                ...this.pageInfo
            }
            this.getIndicatorAction({data, idx:this.searchInfo.attrType}).then(res => {
                console.log('res', res)
                if(res.success) {
                    this.dataList = res.data
                    this.dataTotal = res.total
                } else {
                    this.dataList = []
                }
            }).catch(err => {
                this.dataList = []
            })
            // this.dataList = obj
            
        },

        // 切换
        onChangeType(){
            this.searchInfo.keyword = ''
            this.queryDataList()
        },
        // 重置查询
        restQueryDataList(){
            this.searchInfo = this.$options.data().searchInfo
            this.queryDataList()
        },

        //表格删除
        itemDelete(row){
            console.log('删除', row)
        },

        sizeChange(v){
            this.pageInfo.size = v
            this.queryDataList()
        },
        currentChange(v){
            this.pageInfo.page = v
            this.queryDataList()
        },
    }
}
</script>