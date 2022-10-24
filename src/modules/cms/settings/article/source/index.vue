<template>
    <div style="show-source">
        <TableRow has-form has-header has-pagination>
            <template v-slot:form>
                <el-form inline>
                    <el-form-item label="名称">
                        <el-input
                            v-model="searchForm.name"
                            placeholder="名称"
                            clearable
                            maxlength="150"
                        />
                    </el-form-item>
                    <el-form-item label="选择站点">
                        <el-select v-model="searchForm.appid" placeholder="选择站点" clearable>
                            <el-option
                                v-for="(site, index) in sites"
                                :key="index"
                                :label="site.name"
                                :value="site.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="_search">查询</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <template v-slot:header-left>
                <el-button type="primary" @click="_addSource">新增</el-button>
            </template>

            <el-table :data="sources" row-key="id" class="article-source-radio">
                <el-table-column label="序号" type="index" width="100">
                    <template v-if="selection" v-slot="{row, $index}">
                        <el-radio
                            v-model="tableCheck.id"
                            :label="row.id"
                            @change="tableCheckChange(row)"
                        >{{$index + 1}}</el-radio>
                    </template>
                    <template v-else v-slot="{row, $index}">{{$index + 1}}</template>
                </el-table-column>
                <el-table-column label="名称" prop="name"></el-table-column>
                <el-table-column label="链接" prop="url"></el-table-column>
                <el-table-column label="描述" prop="desc"></el-table-column>
                <el-table-column v-if="!selection" label="操作">
                    <template v-slot="{row}">
                        <el-button size="mini" type="primary" @click="_editSource(row)">修改</el-button>
                        <el-button size="mini" type="danger" @click="_delete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <template v-slot:pagination>
                <Pagination
                    :current-page="searchForm.page"
                    :total="searchForm.total"
                    @current-change="changePagination"
                />
            </template>
        </TableRow>

        <div v-if="selection" class="article-source-footer">
            <el-button type="primary" @click="_ok">确认</el-button>
            <el-button @click="_cancel">取消</el-button>
        </div>

        <EditModal v-bind="edit" @close="closeEditModal"/>
    </div>
</template>
<style lang="scss" scoped>
.article-source-footer {
    text-align: center;
    padding-top: 15px;
}
.article-source-radio .el-radio__label {
    display: none;
}

</style>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { showLoading, showError, confirm ,showMessage} from '../../../../../utils'
import EditModal from './edit'
export default {
    name: 'ArticleSource',
    components: {
        EditModal
    },
    props: {
        selection: {
            type: Boolean,
            default: false
        },
        sourceId: {
            type: Number,
            default: null
        },
        ok: {
            type: Function,
            default: () => { }
        },
        cancel: {
            type: Function,
            default: () => { }
        }
    },
    data() {
        return {
            tableCheck: {
                id: null
            },
            searchForm: {
                page: 1,
                total: 0,
                name: '',
                appid: null
            },
            edit: {
                visible: false,
                info: {}
            }
        }
    },
    computed: {
        ...mapState('cms/settings/article/source', ['sources']),
        ...mapGetters('cms/site', {
            'sites': 'normalizeSites'
        }),
        
    },
    created() {
        // this.sites.unshift({ id: 0, name: '公共来源' })
        this.search()
    },
    mounted() {
        this.$nextTick(() => {
            this.sites.unshift({ id: 0, name: '公共来源' })
        })
    },
    beforeDestroy() {
        this.sites.shift({ id: 0, name: '公共来源' })
    },
    methods: {
        ...mapActions('cms/settings/article/source', ['loadSources', 'deleteSource']),
        tableCheckChange(value) {
            this.tableCheck = { ...value }
        },
        changePagination(currentPage) {
            this.searchForm.page = currentPage
            this.search()
        },
        search() {
            // this.searchForm.page = 1
            showLoading(true, '正在加载资源')
            const params = this.searchForm
            this.loadSources(params).then(({ count }) => {
                this.searchForm.total = count
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        closeEditModal(needReload) {
            this.edit.visible = false
            needReload && this.search()
        },
        _addSource() {

            this.edit.visible = true
            this.edit.info = {}
        },
        _editSource(source) {
            this.edit.visible = true
            this.edit.info = { ...source }
        },
        _ok() {
            this.$props.ok && this.$props.ok({ ...this.tableCheck })
        },
        _cancel() {
            this.tableCheck = { id: null }
            this.$props.cancel && this.$props.cancel()
        },
        _search() {
            this.searchForm.page = 1
            this.search()

        },
        _delete({ id }) {
            confirm('删除后不可恢复,确认删除吗？', '警告', {
                ok: () => {
                    showLoading(true, '正在删除')
                    this.deleteSource({ id }).then(res => {
                        if(res.success){
                            showMessage(res.errMsg)
                            this.search()
                        }else{
                            showError('删除失败！')
                        }
                    }).catch(error => {
                        showError(error.message)
                    })
                    showLoading(false)
                }
            })
        }
    }

}
</script>
