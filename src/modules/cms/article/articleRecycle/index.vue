<template>
    <TableRow
        has-form
        has-pagination
        :has-form-border="false"
    >
        <template #form>
            <el-button
                icon="el-icon-arrow-left"
                @click="_goArticleList"
            >返回</el-button>
            <el-button
                icon="el-icon-position"
                type="primary"
                @click="_batchRecovery"
            >
                批量恢复</el-button>
            <el-button
                icon="el-icon-delete"
                type="danger"
                @click="_batchDeletion"
            >批量删除</el-button>
        </template>
        <el-table
            :data="list"
            row-key="id"
            border
            style="width: 100%"
            @selection-change="_handleSelectionChange"
        >
            <el-table-column
                type="selection"
                width="55"
            ></el-table-column>
            <el-table-column
                prop="title"
                label="文章名称"
            ></el-table-column>
            <el-table-column
                label="文章类型"
                width="80"
            >
                <template v-slot="{ row }">{{ articleType[row.type] }}</template>
            </el-table-column>
            <el-table-column
                prop="channel"
                label="所属频道"
            ></el-table-column>
            <el-table-column
                prop="statusName"
                label="文章状态"
                width="80"
            >
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="创建时间"
                width="180"
            >
                <template v-slot="{ row }">{{ row.createTime | dateFormat }}</template>
            </el-table-column>
            <el-table-column
                prop="createBy"
                label="创建人"
                width="80"
            ></el-table-column>
            <el-table-column
                label="操作"
                width="200"
            >
                <template v-slot="{ row }">
                    <el-button
                        v-hasPermission="'article:btn:recycle:recovery'"
                        type="primary"
                        @click="_recovery(row.id)"
                    >恢复</el-button>
                    <el-button
                        v-hasPermission="'article:btn:recycle:delete'"
                        type="danger"
                        @click="_deleteArticle(row.id)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <template #pagination>
            <Pagination
                :current-page="currentPage"
                :page-size="limit"
                :total="totalPage"
                @current-change="_changePagination"
            ></Pagination>
        </template>
    </TableRow>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { showLoading, showMessage, confirm } from '@/utils'
import siteMixin from '../../cmsmixins/siteMixin'
export default {
    name: 'ArticleRecycle',
    mixins: [siteMixin],
    data() {
        return {
            formId:this.$route.query.formId,
            multipleSelected: [],
            currentChannelId: 1
        }
    },
    computed: {
        ...mapState('authen', ['isAdmin']),
        ...mapState('cms/article/articleList', ['appid']),
        ...mapState('cms/article', ['currentChannel']),
        ...mapState('cms/channel/components', ['articlePermissions']),
        ...mapState('cms/article/articleRecycle', ['list', 'currentPage', 'limit', 'totalPage']),
        ...mapGetters('authen', ['getDictionary']),
        articleType() {
            return this.getDictionary('articleType')
        },
        articleStatus() {
            return this.getDictionary('articleStatus')
        }
    },
    watch: {
        // currentChannel(v) {
        //     this.init()
        // }
    },
    created() {
        if (!this.appid || !this.currentChannel.id) {
            this._goArticleList()
        } else {
            this.currentChannelId = this.currentChannel.id
            this.init()
        }
    },
    methods: {
        // 判断是否有按钮操作权限,并且不是管理员
        hasPermission(permission) {
            return !this.isAdmin && (this.articlePermissions || []).findIndex(v => v === permission) !== -1
        },
        ...mapActions('cms/article/articleRecycle', ['getArticleRecycleList', 'operationRecycleArticle']),

        _goArticleList() {
            this.$router.push({ name: 'articleList' })
        },

        _handleSelectionChange(arr) {
            // arr.map(item => this.multipleSelected.push(item.id))
            this.multipleSelected = arr
        },

        async init() {
            if (this.currentChannelId) {
                showLoading(true, '文章回收站列表数据加载中...')
                await this.getArticleRecycleList({
                    appid: this.appid,
                    formId: this.formId,
                    channelId: this.currentChannel.id
                })
                showLoading(false)
            }
        },

        reloadWhenSiteChange() {
            this.init()
        },

        // 翻页
        async _changePagination(v) {
            showLoading(true, '文章列表数据加载中...')
            this.$store.commit('cms/channel/articleRecycle/UPDATE_CURRENT_PAGE', v)
            await this.getArticleRecycleList({
                page: v,
                formId: this.formId,
                channelId: this.currentChannelId
            })
            showLoading(false)
        },

        _batchRecovery() {
            this.multipleSelected.length
                ? this._recovery(this.multipleSelected.map(({ id }) => id).join(','))
                : showMessage({ type: 'warning', message: '请至少选择一个需要恢复的文章！' })
        },

        async _recovery(ids) {
            showLoading(true, '文章恢复中...')
            await this.operationRecycleArticle({
                ids,
                formId: this.formId,
                flag: 'recovery',
                channelId: this.currentChannelId
            })
            this.multipleSelected = []
            showLoading(false)
            showMessage('恢复成功！')
            this.init()
        },

        _batchDeletion() {
            this.multipleSelected.length
                ? this._deleteArticle(this.multipleSelected.map(({ id }) => id).join(','))
                : showMessage({ type: 'warning', message: '请至少选择一个需要删除的文章！' })
        },

        _deleteArticle(ids) {
            confirm('删除不可恢复，确认删除吗？', '警告', {
                ok: async () => {
                    showLoading(true, '删除中...')
                    await this.operationRecycleArticle({
                        ids,
                        formId: this.formId,
                        flag: 'delete',
                        channelId: this.currentChannelId
                    })
                    showLoading(false)
                    showMessage('删除成功！')
                    this.multipleSelected = []
                    this.init()
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
/deep/ .cell {
   @include ellipsisMultiline(2)
    
}
</style>
