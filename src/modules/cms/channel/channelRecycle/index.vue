<template>
    <TableRow has-form has-pagination :has-form-border="false">
        <template #form>
            <el-button icon="el-icon-arrow-left" @click="_goChannelList">返回</el-button>
            <el-button
                v-hasPermission="'channel:btn:recycle:recovery'"
                icon="el-icon-position"
                type="primary"
                @click="_batchRecovery"
            >
                批量恢复
            </el-button>
            <el-button
                v-hasPermission="'channel:btn:recycle:delete'"
                icon="el-icon-delete"
                type="danger"
                @click="_batchDeletion"
            >
                批量删除
            </el-button>
        </template>
        <el-table :data="tableData" row-key="id" border style="width: 100%" @selection-change="_handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="title" label="频道名称" min-width="180"></el-table-column>
            <el-table-column prop="showTitle" label="显示名称" min-width="180"></el-table-column>
            <el-table-column label="操作">
                <template v-slot="{ row }">
                    <el-button v-hasPermission="'channel:btn:recycle:recovery'" type="primary" @click="_recovery(row.id)">恢复</el-button>
                    <el-button v-hasPermission="'channel:btn:recycle:delete'" type="danger" @click="_deleteChannel(row.id)">删除</el-button>
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
import { mapState, mapActions } from 'vuex'
import { showLoading, showMessage, confirm } from '@/utils'
import siteMixin from '../../cmsmixins/siteMixin'
export default {
    name: 'ChannelRecycle',
    mixins: [siteMixin],
    data () {
        return {
            multipleSelected: [],
            curr: 1,
        }
    },
    computed: {
        ...mapState('authen', ['isAdmin']),
        ...mapState('cms/channel/components', ['channelPermissions']),
        ...mapState('cms/channel/channelRecycle', ['tableData','currentPage', 'limit', 'totalPage'])
    },
    created () {
        this.init()
    },
    methods: {
        // 判断是否有按钮操作权限,并且不是管理员
        hasPermission (permission) {
            return !this.isAdmin && (this.channelPermissions || []).findIndex(v => v === permission) !== -1
        },

        ...mapActions('cms/channel/channelRecycle', ['getRecycleList', 'operationRecycleChannel']),
        _handleSelectionChange (arr) {
            this.multipleSelected = arr
        },

        async init () {
            showLoading(true, '频道回收站列表加载中...')
            await this.getRecycleList()
            showLoading(false)
        },

        reloadWhenSiteChange () {
            this.init()
        },

        _batchRecovery () {
            this.multipleSelected.length
                ? this._recovery(this.multipleSelected.map(({ id }) => id).join(','))
                : showMessage({ type: 'warning', message: '请至少选择一个需要恢复的频道！' })
        },

        async _recovery (ids) {
            this.$store.commit('cms/channel/channelRecycle/UPDATE_CURRENT_PAGE', this.curr)
            showLoading(true, '频道恢复中...')
            await this.operationRecycleChannel({
                ids,
                flag: 'recovery',
            })
            showLoading(false)
            showMessage('恢复成功！')
            this.getRecycleList({page:this.curr})
        },

        _batchDeletion () {
            this.multipleSelected.length
                ? this._deleteChannel(this.multipleSelected.map(({ id }) => id).join(','))
                : showMessage({ type: 'warning', message: '请至少选择一个需要删除的频道！' })
        },

        _deleteChannel (ids) {
            confirm('删除不可恢复，确认删除吗？', '警告', {
                ok: async () => {
                    showLoading(true, '删除中...')
                    await this.operationRecycleChannel({
                        ids,
                        flag: 'delete'
                    })
                    showLoading(false)
                    showMessage('删除成功！')
                    this.$store.commit('cms/channel/channelRecycle/UPDATE_CURRENT_PAGE', 1)
                    this.multipleSelected = []
                    this.getRecycleList()
                }
            })
        },

        // 翻页
        async _changePagination (v) {
            this.curr = v
            showLoading(true, '频道回收站列表加载中...')
            this.$store.commit('cms/channel/channelRecycle/UPDATE_CURRENT_PAGE', v)
            await this.getRecycleList({
                page: v
            })
            showLoading(false)
        },

        _goChannelList(){
            this.$store.commit('cms/channel/channelRecycle/UPDATE_CURRENT_PAGE', 1)
            this.$router.push({name:'channelList'})
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
