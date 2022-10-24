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
            :data="sites"
            :check-strictly="true"
            :expand-on-click-node="false"
            :props="defaultProps"
            :show-checkbox="isCheckbox"
            :highlight-current="true"
            :render-content="renderContent"
            default-expand-all
            :filter-node-method="filterNode"
            @check="_setCheckNodes"
            @node-click="_selectedCurrentNode"
        ></el-tree>
    </div>
    
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { showLoading } from '@/utils'
// import { deepCopy } from '@/utils/BaseUtil'
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
        }
    },
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            filterText:''
        }
    },
    computed: {
        ...mapState('cms/site', ['sites']),
        
    },
    watch:{
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    created() {
        if (!this.sites.length) {
            showLoading(true, '频道列表加载中...')
            this.loadSites().then(() => showLoading(false))
        }
    },
    methods: {
        ...mapActions('cms/site', ['loadSites']),

        reloadWhenSiteChange() {
            showLoading(true, '频道列表加载中...')
            this.loadSites().then(() => showLoading(false))
        },
        //模糊查询过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
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
            // this.$store.commit('cms/channel/components/SET_PERMISSION', data)
            this.$emit('node-click', data, node)
        },

        renderContent(h, { node, data, store }) {
            return (
                <div class="custom-tree-node" style="flex: 1;">
                    <div
                        slot="reference"
                        class={['tree-item', `level-${node.level}`]}
                        style="flex: 1;"
                    >
                        <i class={node.childNodes.length ? 'el-icon-folder' : 'el-icon-tickets'}></i>
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
/deep/ .el-tree-node > .el-tree-node__children{
    overflow: visible
}
</style>
