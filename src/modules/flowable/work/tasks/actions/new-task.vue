<template>
    <div class="tasks-popper-body">
        <el-form ref="newTaskForm" :rules="newTaskRules" :model="newTask">
            <el-form-item label="任务名称" prop="name">
                <el-input v-model="newTask.name" placeholder="任务名称" size="mini" :maxlength="100" />
            </el-form-item>
            <el-form-item label="任务描述">
                <el-input
                    v-model="newTask.description"
                    type="textarea"
                    placeholder="任务描述"
                    size="mini"
                    :rows="3"
                    :maxlength="255"
                />
            </el-form-item>
            <el-form-item>
                <div class="new-task-btns">
                    <div>
                        <AssigneePeople
                            ref="assigneePeopleRef"
                            title="选择被分配用户"
                            :width="350"
                            :visible.sync="assigneePopper"
                            :clear.sync="searchUserClear"
                            @selected="onSlectAssignee"
                        >
                            <span class="new-task-assignee">
                                <i class="el-icon-user-solid">被分配人</i>
                                <el-tag
                                    v-if="newTask.assignee"
                                    size="mini"
                                    closable
                                    @close="onClearAssignee"
                                >{{assigneeName}}</el-tag>
                            </span>
                        </AssigneePeople>
                    </div>
                    <div>
                        <el-button type="primary" size="mini" @click="onCancelTask(false)">取消</el-button>
                        <el-button type="primary" size="mini" @click="onCreateTask">创建</el-button>
                    </div>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { showLoading, showError } from '@/utils'
import { matchName } from '@/utils/RegExpUtil'
import AssigneePeople from './involved-people'
export default {
    components: {
        AssigneePeople
    },
    props: {
        parentTaskId: {
            type: String,
            default: null
        },
        popoverVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        const newTaskRules = {
            name: [
                { required: true, message: '任务名称不能为空' },
                {
                    validator: function (rule, value, callback) {
                        if (!matchName(value)) {
                            callback('只允许中文、数字、字母、下划线、横线、空格；两边不能有空格和横线')
                        } else {
                            callback()
                        }
                    }
                },
            ]
        }
        const newTask = {
            name: 'New Task',
            description: '',
            assignee: ''
        }
        return {
            newTask,
            newTaskRules,
            // 选择分配用户Popover
            assigneePopper: false,
            assigneeName: '',
            searchUserClear: false
        }
    },
    computed: {
        assigneePopoverVisible: {
            get() {
                return this.visible
            },
            set(visible) {
                this.$emit('update:visible', visible)
            }
        }
    },
    watch: {
        popoverVisible(visible) {
            if (visible === false) {
                this.$refs.newTaskForm.resetFields()
                this.$refs.newTaskForm.clearValidate()
                this.assigneeName = ''
                this.assigneePopper = false
                this.newTask = { assignee: '', name: 'New Task', description: '' }
            }
        },
        assigneePopper(visible) {
            if (visible === true) {
                this.$nextTick(() => {
                    this.$refs.assigneePeopleRef.$refs.searchUserRef.$refs.searchUserInputRef.focus()
                })
            }
        }
    },
    methods: {
        ...mapActions('flowable/work/tasks', ['createTask']),
        // 选中分配用户
        onSlectAssignee(user) {
            this.newTask.assignee = user.id
            this.assigneeName = user.fullName
            this.assigneePopper = false
        },
        // 取消创建任务
        onCancelTask(visible, isReload = false) {
            this.searchUserClear = true
            this.$emit('update:popover-visible', visible)
            if (isReload === true) {
                this.$emit('reload')
            }
        },
        onClearAssignee() {
            this.assigneeName = ''
            this.newTask.assignee = ''
        },
        onCreateTask() {
            this.$refs.newTaskForm.validate(valid => {
                if (valid) {
                    showLoading(true, '正在提交数据...')
                    this.createTask({ ...this.newTask, parentTaskId: this.parentTaskId }).then(() => {
                        showLoading(false)
                        this.onCancelTask(false, true)
                    }).catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
                }
            })
        },
    },

}
</script>
