<template>
    <el-popover
        :title="title"
        placement="bottom-start"
        popper-class="tasks-popper"
        trigger="click"
        width="350"
        :value="newTaskPopperVisible"
        @show="newTaskPopperVisible = true"
        @hide="newTaskPopperVisible = false"
    >
        <NewTask
            :popover-visible.sync="newTaskPopperVisible"
            :parent-task-id="parentTaskId"
            @reload="reloadTasks"
        />
        <template slot="reference">
            <slot>
                <el-button type="primary" size="mini" icon="el-icon-plus">新建任务</el-button>
            </slot>
        </template>
    </el-popover>
</template>
<script>
import NewTask from './new-task'
export default {
    components: {
        NewTask
    },
    props: {
        title: {
            type: String,
            default: '新任务'
        },
        visible: {
            type: Boolean,
            default: false
        },
        reload: {
            type: Function,
            default: () => { }
        },
        parentTaskId: {
            type: String,
            default: null
            // required: true,
        }
    },
    computed: {
        newTaskPopperVisible: {
            get() {
                return this.visible
            },
            set(isVisible) {
                this.$emit('update:visible', isVisible)
            }
        }
    },
    methods: {
        reloadTasks(...args) {
            this.$emit('reload', ...args)
        }
    }
}
</script>
