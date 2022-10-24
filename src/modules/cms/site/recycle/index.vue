<template>
    <div>
        <TableRow has-form has-pagination :has-form-border="false">
            <template #form>
                <el-button icon="el-icon-arrow-left" @click="_cancel">返回</el-button>
                <el-button v-hasPermission="'app:btn:recycle:recovery'" icon="el-icon-position" type="primary" @click="_restore">批量恢复</el-button>
                <el-button v-hasPermission="'app:btn:recycle:delete'" icon="el-icon-delete" type="danger" @click="_empty">彻底删除</el-button>
            </template>
            <el-table :data="sites" row-key="id" border @selection-change="_siteCheck">
                <el-table-column type="selection" align="center" width="50"></el-table-column>
                <el-table-column label="站点名称" prop="name" width="350">
                    <template v-slot="{row}">
                        <a href="javascript:;" @click="_siteInfo(row)">{{row.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="显示名称" prop="showName"></el-table-column>
                <el-table-column label="站点类型" prop="type" width="100">
                    <template v-slot="{row}">{{siteType[row.type]}}</template>
                </el-table-column>
                <el-table-column label="创建时间" prop="createAt" width="170">
                    <template v-slot="{row}">{{ row.createAt | dateFormat}}</template>
                </el-table-column>
                <el-table-column label="创建人" prop="createBy" width="100"></el-table-column>
                <el-table-column label="操作" width="200">
                    <template v-slot="{ row }">
                        <el-button v-hasPermission="'app:btn:recycle:recovery'" type="primary" @click="_recovery(row.id)">恢复</el-button>
                        <el-button v-hasPermission="'app:btn:recycle:delete'" type="danger" @click="_deleteSite(row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <template #pagination>
                <Pagination
                    :current-page="searchForm.page"
                    :page-size="searchForm.limit"
                    :total="searchForm.total"
                    @current-change="_changePagination"
                ></Pagination>
            </template>
        </TableRow>

        <!-- 查看回收站的站点信息 -->
        <EditModal v-bind="edit" @closeEditModal="closeEditModal"/>
        <!-- 查看回收站的站点信息 -->
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { showLoading, showError, confirm,showMessage } from '@/utils'
import EditModal from '../main/edit'
export default {
    name: 'SiteRecycle',
    components: {
        EditModal
    },
    data() {
        return {
            edit: {
                visible: false,
                optType: 3,
                info: {}
            },
            ids: [],
            searchForm: {
                page: 1,
                limit:10,
                total:0
            }
        }
    },
    computed: {
        ...mapState('cms/site/recycle', ['sites']),
        ...mapGetters('authen', ['getDictionary']),
        siteType() {
            return this.getDictionary('siteType')
        },
    },
    created() {
        this.reload()
    },
    methods: {
        ...mapActions('cms/site/recycle', ['loadRecycles', 'restoreRecycles', 'emptyRecycles']),
        reload() {
            showLoading(true, '正在加载数据')
            this.loadRecycles({...this.searchForm}).then((data) => {
                this.searchForm.total = data.count
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })

        },
        closeEditModal() {
            this.edit.visible = false
        },
        _siteInfo(site) {
            this.edit.visible = true
            this.edit.info = { ...site }
        },
        _siteCheck(selected) {
            const ids = selected.map(item => item.id)
            this.ids = ids
        },
        //批量恢复
        _restore(site) {
            const ids = this.ids
            if (!ids || ids.length === 0) {
                showError('至少选择一条数据')
                return
            }
            confirm('确认恢复吗?', '提示', {
                ok: () => {
                    showLoading(true, '正在恢复数据')
                    this.restoreRecycles({ ids: ids.join(',') }).then(() => {
                        showLoading(false)
                        this.reload()
                    }).catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
                }
            })
        },
        //恢复
        _recovery(id) {
            showLoading(true, '正在恢复数据')
            this.restoreRecycles({ ids: id}).then(() => {
                showMessage('恢复成功')
                showLoading(false)
                this.reload()
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        //批量删除
        _empty(site) {
            const ids = this.ids
            if (!ids || ids.length === 0) {
                showError('至少选择一条数据')
                return
            }
            confirm('删除后无法恢复,确认删除吗?', '警告', {
                ok: () => {
                    showLoading(true, '正在彻底删除数据')
                    this.emptyRecycles({ ids: ids.join(',') }).then(() => {
                        showLoading(false)
                        this.reload()
                    }).catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
                }
            })
        },
        //删除
        _deleteSite(id) {
            showLoading(true, '正在彻底删除数据')
            this.emptyRecycles({ ids: id}).then(() => {
                showMessage('删除成功')
                showLoading(false)
                this.reload()
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        // 返回列表页
        _cancel(){
            this.$router.push({name:'SiteList'})
        },
        _changePagination(v) {
            this.searchForm.page = v
            this.reload()
        }
    }
}
</script>

