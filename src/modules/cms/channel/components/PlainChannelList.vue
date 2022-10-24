/**
 * 干净的频道列表，可接受一个props:
 * isCheckbox: 是否展示复选框
 * on-change: 给父级传递选中的数据，仅isCheckbox为true时生效
 * node-click: 给父级传递每次节点点击的数据，data当前的数据，node当前的节点，el-tree原有事件
 */
<template>
    <div>
        <el-input
            v-model="filterText"
            clearable
            placeholder="输入关键字进行过滤"
        >
        </el-input>
        <el-tree
            ref="tree"
            node-key="id"
            :data="channelFilterData"
            :check-strictly="true"
            :expand-on-click-node="false"
            :props="defaultProps"
            :show-checkbox="isCheckbox"
            :render-content="renderContent"
            :highlight-current="true"
            :default-expanded-keys="defaultExpandedKeys"
            :filter-node-method="filterNode"
            @check="_setCheckNodes"
            @node-click="_selectedCurrentNode"
        ></el-tree>
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { showLoading } from '@/utils'
import { deepCopy } from '@/utils/BaseUtil'
import siteMixin from '../../cmsmixins/siteMixin'
export default {
    name: 'PlainChannelList',
    mixins: [siteMixin],
    props: {
        isCheckbox: {
            type: Boolean,
            default: false
        },
        isAllowSelectSelf: {
            type: Boolean,
            default: false
        },
        self: {
            type: Number,
            default: null
        },
        curArticleId: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'name',
                // disabled: (data,node) =>{
                //     return true
                // }
            },
            siteId: null,
            filterText: '',
            expandedKeys: [],
            treeList: {}
        }
    },
    computed: {
        ...mapState('cms/article', ['currentChannel']),
        ...mapState('cms/channel/channelList', ['channelList']),
        ...mapGetters('cms/site', ['site']),
        defaultExpandedKeys() {
            const channelFilterData = this.channelFilterData || []
            const expandKeys = []
            const loadDefaultExpandKeys = (data, level) => {
                if (level > 3) {
                    return
                }
                data.forEach(item => {
                    if (item.children && item.children.length > 0) {
                        expandKeys.push(item.id)
                        loadDefaultExpandKeys(item.children, level + 1)
                    }
                })
            }
            if (channelFilterData.length > 0) {
                loadDefaultExpandKeys(channelFilterData, 1)
            }
            return expandKeys
        },
        channelFilterData() {
            const channelList = this.channelList
            const { self } = this.$props
            // 移动需要过滤掉自己
            const filter = data => {
                return data.filter(item => {
                    if (item.children && item.children.length > 0) {
                        item.children = filter(item.children)
                    }
                    return item.id !== self
                })
            }
            return self ? filter(deepCopy(channelList)) : channelList
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val)
        }
    },
    created() {
        // if (!this.channelList.length) {
        //     showLoading(true, '频道列表加载中...')
        this.getChannelList({filter: 'INFO'}).then(() => {
            if (this.$route.path === '/cms/article/article-list') {
                if (this.$refs.tree && this.checkLocalStorageChannelData()) {
                    this.$refs.tree.setCurrentNode(this.currentChannel)
                    this.$store.commit('cms/channel/components/SET_PERMISSION', this.$refs.tree.getCurrentNode())
                }
            }
        })

        // }
    },
    methods: {
        ...mapActions('cms/channel/channelList', ['getChannelList']),
        // 处理树状图数据（半成品）
        jurisdiction(data) {
            if(Array.isArray(data)){
                data.forEach(item => {
                    if(Array.isArray(item.articlePermissions) && item.articlePermissions.length > 0){
                        // this.treeList.children = item.name
                    }
                })
            }else {
                data = data.children
                this.jurisdiction(data)
            }
        },
        checkLocalStorageChannelData() {
            // 校验LocalStorage中的数据是否存在
            const channelFilterData = this.channelFilterData || []
            const currentChannel = this.currentChannel || {}
            if (!currentChannel.id) {
                return false
            }
            const find = data => {
                return data.some(item => {
                    if (item.id === currentChannel.id) {
                        return true
                    }
                    return item.children && item.children.length > 0 && find(item.children)
                })
            }
            return find(channelFilterData)
        },
        reloadWhenSiteChange() {
            showLoading(true, '频道列表加载中...')
            this.getChannelList().then(() => showLoading(false))
        },
        //模糊查询过滤
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },

        // 清空选择
        $_reset() {
            this.$refs.tree.setCheckedNodes([])
        },
        // 当前选中的节点
        _setCheckNodes(data) {
            this.$refs.tree.setCheckedNodes([data])
            this.$emit('on-change', data)
        },

        // 当前点击的节点
        _selectedCurrentNode(data, node) {
            this.$store.commit("cms/article/articleList/CUSTOMER_FORM", false)
            this.$store.commit('cms/channel/components/SET_PERMISSION', data)
            this.$emit('node-click', data, node)
        },

        renderContent(h, { node, data, store }) {
            return (
                <div class="custom-tree-node" style="flex: 1;">
                    <div slot="reference" class={['tree-item', `level-${node.level}`]} style="flex: 1;">
                        <i class={node.childNodes.length ? 'el-icon-folder' : 'el-icon-tickets'} />
                        <span class="tree-label"> {node.label}</span>
                    </div>
                </div>
            )
        }
    }
}
</script>
<style lang="scss" scoped>
/deep/.tree-item {
    width: 250px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
/deep/ .el-input{
    width:90%;
    display: block;
    margin: 10px auto auto;
}
</style>
