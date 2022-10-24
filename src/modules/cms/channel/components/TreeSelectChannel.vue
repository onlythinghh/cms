/**
 * 独立频道列表组件，需要传入的参数:
 * title: 弹框标题
 * 显示与隐藏使用: v-model
 * 对外暴露方法：on-change(id)
 */
<template>
    <Modal :visible="value" :title="title" custom-class="tree-channel-select" width="400px" @close="_close">
        <plain-channel-list ref="channelList" is-checkbox :self="self||null" @on-change="_getCurrentNode" @node-click="_getClickNode" />
        <div class="btn-wrapper">
            <el-button type="primary" @click="_getCheckNodes">保存</el-button>
            <el-button @click="_close">取消</el-button>
        </div>
    </Modal>
</template>
<script>
import PlainChannelList from './PlainChannelList'
import { showMessage } from '@/utils'
export default {
    name: 'TreeSelectChannel',
    components: {
        PlainChannelList
    },
    props: {
        title: {
            type: String,
            default: '选择频道'
        },
        value: {
            type: Boolean,
            default: false
        },
        isSelectSelf: {
            type: Boolean,
            default: false
        },
        self: {
            type: Number,
            default: null
        }
    },
    data () {
        return {
            currentNode: {},
            clickNode: {}
        }
    },
    methods: {
        _getCurrentNode (data) {
            this.currentNode = data
        },
        _getClickNode (data) {
            this.clickNode = data
        },
        _getCheckNodes () {
            if (JSON.stringify(this.currentNode) !== '{}') {
                this.$emit('on-change', this.currentNode.id)
                this.$refs.channelList.$_reset()
            } else {
                showMessage({
                    message: `请选择一个频道！`,
                    type: 'error'
                })
            }
        },
        _close () {
            this.$refs.channelList.$_reset()
            this.$emit('input', false)
        }
    }
}
</script>
<style lang="scss" scoped>
.tree-channel-select {
    .btn-wrapper {
        width: 100%;
        padding: 5px 0;
        left: 0;
        position: absolute;
        bottom: 0;
        background: #fff;
        z-index: 300;
        text-align: center;
        button{
            margin: 0 10px;
        }
    }
}
/deep/.el-dialog {
    .el-dialog__body{
        .el-tree{
            padding-bottom: 30px;
        }
        height: 74vh;
        overflow: auto;

    }
}
</style>
