<template>
    <div>
        <div v-if="$route.name === 'worksheet'">
            <TableRow :has-form="true" :has-pagination="true" :has-form-border="false">
                <template v-slot:form>
                    <el-form ref="searchForm" inline :model="searchForm">
                        <el-form-item label="表单名称" prop="name">
                            <el-input
                                v-model="searchForm.name"
                                clearable
                                placeholder="请输入表单名称"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="显示名称" prop="alias">
                            <el-input
                                v-model="searchForm.alias"
                                clearable
                                placeholder="请输入显示名称"
                            ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="_search">查询</el-button>
                            <el-button @click="_resetSearch">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <el-button
                        type="primary"
                        icon="el-icon-plus"
                        @click="_addMetadata"
                    >新建表单</el-button>
                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        @click="_delMetadata"
                    >删除</el-button>
                <!-- </router-link> -->
                </template>
                <el-table border stripe :data="data" class="metatype" @selection-change="select">
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column label="序号" width="50">
                    <template v-slot="{$index}">
                        <span>{{($index+1) + ((searchForm.page-1) * 10)}}</span>
                    </template>
                </el-table-column>
                    <el-table-column prop="name" label="表单名称"></el-table-column>
                    <el-table-column prop="alias" label="显示名称"></el-table-column>
                    <el-table-column prop="statusName" label="状态"></el-table-column>
                    <el-table-column prop="createAt" label="创建时间" min-width="124">
                        <template v-slot="{row}">{{row.createAt | dateFormat}}</template>
                    </el-table-column>
                    <el-table-column prop="createBy" label="创建人"></el-table-column>

                    <el-table-column label="操作" min-width="160">
                        <template v-slot="{row}">
                          <el-button-group>
                            <el-button size="mini" type="primary" @click="_edit(row)">修改</el-button>
                            <el-button size="mini" type="primary" @click="_copy(row)">复制</el-button>
                            <el-button size="mini" type="danger" @click="_delete(row)">删除</el-button>
                          </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
                <template v-slot:pagination>
                    <Pagination
                        :current-page="searchForm.page"
                        :page-size="10"
                        :page-sizes="[10]"
                        :total="total"
                        :hide-on-single-page="false"
                        layout="total, sizes, prev, pager, next, jumper"
                        @current-change="changePagination"
                    ></Pagination>
                </template>
            </TableRow>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { showLoading, showError, showMessage, confirm } from '@/utils'
export default {
    //自定义表单
    data () {
        return {
            searchForm: {
                name: '',
                alias: '',
                page: 1,
                limit: 10,
                flag: 2,
            },
            selectIds: [],
            total: null,
        }

    },
    computed: {
        ...mapState("cms/settings/metadata", ["data"]),
    },
    watch: {
        $route(v) {
            if(v.name === 'worksheet') {
                this._loadMetadata()
            }
        }
    },
    created() {
        this._loadMetadata()
    },
    methods: {
        ...mapActions('cms/settings/metadata',['metadataList','metadataDel']),
        //查询
        _search() {
            this._loadMetadata()
        },
        //重置
        _resetSearch() {
            this.searchForm.name = '',
            this.searchForm.alias = ''
            this._loadMetadata()
        },
        //列表
        _loadMetadata() {
            showLoading(true, "数据加载中...");
            this.metadataList({...this.searchForm})
                .then((data) => {
                    this.total = data.count
                    showLoading(false);
                })
                .catch(error => {
                    showLoading(false);
                    showError(error.message);
                });
        },
        //新增
        _addMetadata() {
            this.$router.push({name:'worksheetAdd',query:{type:'add'}})
        },
        //多条删除
        _delMetadata() {
            if (!this.selectIds.length) {
                showMessage({
                    type: 'warning',
                    message: `请选择一个需要删除的表单！`
                })
            } else {
                confirm('确定删除这些表单吗？', '警告', {
                    ok: async () => {
                        showLoading(true,'正在删除中')
                        let ids = []
                        this.selectIds.map(item => ids.push(item.id))
                        this.metadataDel({ids: ids.join(',')})
                            .then((data)=>{
                                showLoading(false)
                                showMessage(data.data)
                                this._loadMetadata()
                            })
                            .catch(error=>{
                                showLoading(false)
                                showError(error.message)
                            })
                    }
                })
            }

        },
        // 手动勾选数据行发生的事件
        select(selection) {
            this.selectIds = selection;
        },
        //复制
        _copy(row) {
            this.$router.push({name:'worksheetAdd',query:{id:row.id}})
        },
        //修改
        _edit(row) {
            this.$router.push({name:'worksheetAdd',query:{type:'edit',id: row.id}})
        },
        //单条删除
        _delete(row) {
            confirm(`确认删除 ${row.name} 表单吗?`, "警告", {
                ok: () => {
                    showLoading(true,'正在删除中')
                    this.metadataDel({ids: row.id})
                        .then((data)=>{
                            showLoading(false)
                            showMessage(data.data)
                            this._loadMetadata()
                        })
                        .catch(error=>{
                            showLoading(false)
                            showError(error.message)
                        })
                }
            })
        },
        //转页
        changePagination(page) {
            this.searchForm.page = page
            this.metadataList({...this.searchForm})
        },
    },

}

</script>
<style lang='scss' scoped>
    .search {
        height: 50px;
        background: rgba(248, 248, 248, 1);
        border: 1px solid rgba(234, 234, 234, 1);
        border-radius: 6px 6px 6px 6px;
        line-height: 50px;
    }
    .searchTitle {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: bold;
        font-size: 97%;
        color: rgba(23, 23, 23, 1);
        margin-left: 10px;
    }
    /deep/ .metatype {
        tr {
            th {
                background: #dfeffe
            }
        }
    }
</style>
