<template>
    <el-card class="card-container flowable-card-container no-padding">
        <el-row>
            <el-col :span="6">
                <div class="card-left-header task-search-header">
                    <el-form label-width="70px">
                        <el-form-item>
                            <el-radio-group
                                v-model="searchForm.state"
                                size="mini"
                                @change="onParamsChange"
                            >
                                <el-radio-button label="open">全部</el-radio-button>
                                <el-radio-button label="completed">已完成</el-radio-button>
                            </el-radio-group>
                            <span class="search-more-btn">
                                <el-button
                                    type="text"
                                    size="mini"
                                    :icon="isFilterMore ? 'el-icon-arrow-up':'el-icon-arrow-down'"
                                    @click="onFilterMore"
                                ></el-button>
                            </span>
                        </el-form-item>
                        <div :class="'search-more '+ (isFilterMore?'active':'')">
                            <el-form-item label="任务名称">
                                <el-input
                                    v-model="searchForm.text"
                                    placeholder="任务名称"
                                    size="mini"
                                    clearable
                                    @change="onParamsChange"
                                />
                            </el-form-item>
                            <el-form-item label="流程定义">
                                <el-select
                                    v-model="searchForm.processDefinitionId"
                                    placeholder="流程定义"
                                    size="mini"
                                    clearable
                                    @change="onParamsChange"
                                >
                                    <el-option
                                        v-for="definition in definitions"
                                        :key="definition.id"
                                        :value="definition.id"
                                        :label="definition.name"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="类型">
                                <el-select
                                    v-model="searchForm.assignment"
                                    placeholder="类型"
                                    size="mini"
                                    @change="onParamsChange"
                                >
                                    <el-option value="involved" label="我参与的任务">我参与的任务</el-option>
                                    <el-option value="assignee" label="我是被分配人的任务">我是被分配人的任务</el-option>
                                    <el-option value="candidate" label="我是其中一个候选人的任务">我是其中一个候选人的任务</el-option>
                                </el-select>
                            </el-form-item>
                            <!--
                            <el-form-item>
                                <el-button type="primary" size="mini">重置</el-button>
                            </el-form-item>
                            -->
                        </div>
                    </el-form>
                </div>
                <div class="card-left-body">
                    <div class="tasks-btns">
                        <CreateTask :visible.sync="newTaskPopper" @reload="reloadTasks" />
                    </div>
                    <ul class="flowable-lists">
                        <li
                            v-for="task in tasks"
                            :key="task.id"
                            :class="'flowable-list-item '+ (task.id === selectedTask.id ? 'active':'')"
                            @click="onTaskClick(task)"
                        >
                            <div class="flowable-list-item-content">
                                <div class="flowable-list-item-header">
                                    <div
                                        class="flowable-process-name"
                                    >{{task.name ? task.name:'未设置名称'}}</div>
                                    <div class="flowable-process-start-time process-calc-time">
                                        <span>{{taskTime(task)}}</span>
                                    </div>
                                </div>
                                <div class="flowable-list-item-summary">
                                    <span>{{userName(task.assignee) ? userName(task.assignee) : '未分配用户'}}</span>
                                </div>
                                <div
                                    class="description"
                                >{{task.description ? task.description:'这项任务没有说明'}}</div>
                            </div>
                        </li>
                        <li class="load-more">
                            <el-divider>
                                <span
                                    v-if="hasPage && (hasPrevPage || hasNextPage)"
                                    class="actions"
                                >
                                    <i
                                        v-if="hasPrevPage"
                                        class="el-icon-arrow-up action prev"
                                        title="上一页"
                                        @click="onLoadMore(false)"
                                    ></i>
                                    <i
                                        v-if="hasNextPage"
                                        class="el-icon-arrow-down action next"
                                        title="下一页"
                                        @click="onLoadMore"
                                    ></i>
                                </span>
                                <span v-else class="no-more">没有更多了...</span>
                            </el-divider>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="18" class="flowable-col">
                <el-card shadow="never">
                    <div v-if="hasTask" slot="header" class="clearfix flowable-header">
                        <div class="flowable-header-title">
                            <h2 class="title">{{taskDetail.name ? taskDetail.name : '未设置名称'}}</h2>
                            <div class="detail">
                                <span>
                                    被分配人:
                                    <span v-if="hasAssigneer">
                                        <span v-if="canEditAssigneer" class="task-inline-edit">
                                            <AssigneePeople
                                                :visible.sync="assigneePopoverVisible"
                                                :clear.sync="clearSearchUsers"
                                                @selected="onNewAssignee"
                                            >
                                                <span>
                                                    <span>{{taskDetail.assignee.fullName}}</span>
                                                    <i class="el-icon-edit task-inline-edit-icon"></i>
                                                </span>
                                            </AssigneePeople>
                                        </span>
                                        <span v-else>{{taskDetail.assignee.fullName}}</span>
                                    </span>
                                    <span v-else>未分配用户</span>
                                </span>
                                <span>
                                    超时:
                                    <span>
                                        <span v-if="hasDueDate">
                                            <span
                                                v-if="canEditDueDate"
                                                class="task-inline-edit"
                                                @click="onDueDateVisible"
                                            >
                                                <div class="edit-date-container">
                                                    <span>
                                                        <span>{{taskDetail.dueDate | fromNow}}</span>
                                                        <i
                                                            class="el-icon-edit task-inline-edit-icon"
                                                        ></i>
                                                    </span>
                                                    <el-date-picker
                                                        ref="dueDatePicker"
                                                        v-model="newDueDate"
                                                        type="date"
                                                        placeholder="选择日期"
                                                        size="mini"
                                                        class="edit-date-opt"
                                                        @change="onDueDateChange"
                                                    />
                                                </div>
                                            </span>
                                            <span v-else>{{taskDetail.dueDate | fromNow}}</span>
                                        </span>
                                        <span v-else>
                                            <span
                                                v-if="canEditDueDate"
                                                class="task-inline-edit"
                                                @click="onDueDateVisible"
                                            >
                                                <div class="edit-date-container">
                                                    <span>
                                                        <span>未设置超时日期</span>
                                                        <i
                                                            class="el-icon-edit task-inline-edit-icon"
                                                        ></i>
                                                    </span>
                                                    <el-date-picker
                                                        ref="dueDatePicker"
                                                        v-model="newDueDate"
                                                        type="date"
                                                        placeholder="选择日期"
                                                        size="mini"
                                                        class="edit-date-opt"
                                                        @change="onDueDateChange"
                                                    />
                                                </div>
                                            </span>
                                            <span v-else>未设置超时日期</span>
                                        </span>
                                    </span>
                                </span>
                                <span v-if="taskDetail.processInstanceId">
                                    当前流程:
                                    <span
                                        class="task-inline-edit underline"
                                        @click="onToProcessInstance"
                                    >
                                        <span>{{currentProcessInstance.name}}</span>
                                    </span>
                                </span>
                                <span v-if="isEnded">结束: {{taskDetail.endDate | fromNow}}</span>
                                <span v-else>结束: 未结束</span>
                                <span
                                    v-if="taskDetail.duration"
                                >耗时: {{taskDetail.duration | dateDuration}}</span>
                            </div>
                            <div class="sub-detail">
                                <span>
                                    <div
                                        v-if="hasInvolvedPeople"
                                        class="task-list-item-avator small"
                                        @click="onToContent"
                                    >
                                        <template>{{getAvatorName(taskDetail.involvedPeople[0])}}</template>
                                    </div>
                                    <span v-else>没有人参与项目</span>
                                </span>
                                <span>
                                    <span v-if="hasContent" @click="onToContent">
                                        <i class="el-icon-document"></i>
                                    </span>
                                    <span v-else>无内容</span>
                                </span>
                                <!-- <span>
                                    <span>无评论</span>
                                </span>-->
                                <span>
                                    <span v-if="hasSubtasks" @click="onToContent">
                                        <span>{{subtasks.length}}</span>
                                        <span>个子任务</span>
                                    </span>
                                    <span v-else>无子任务</span>
                                </span>
                                <span v-if="hasFormKey">
                                    <el-button
                                        size="mini"
                                        @click="onSwitchContent"
                                    >{{tab === 'content' ? '显示表单':'显示详细内容'}}</el-button>
                                </span>
                            </div>
                        </div>
                        <div>
                            <el-button
                                v-if="canComplete"
                                size="mini"
                                type="primary"
                                @click="onCompleteTask"
                            >完成</el-button>
                        </div>
                    </div>
                    <div v-if="hasTask" class="flowable-process-tasks">
                        <div v-show="tab ==='form'">
                            <TaskForm />
                        </div>
                        <div v-show="tab ==='content'">
                            <div v-if="hasContentDetail">
                                <div class="flowable-process-tasks">
                                    <div class="flowable-process-task">
                                        <h3 class="flowable-process-task-header">
                                            <span>相关联的人</span>
                                            <InvolvedPeople
                                                :visible.sync="involvedPeoplePopoverVisible"
                                                :clear.sync="clearSearchUsers"
                                                @selected="onNewInvolvedPeople"
                                            />
                                        </h3>
                                        <div class="flowable-process-task-list">
                                            <div
                                                v-for="involved in taskDetail.involvedPeople"
                                                :key="involved.id"
                                                class="flowable-process-task-list-item small task-content-item"
                                            >
                                                <div class="task-list-item-avator small">
                                                    <template>{{getAvatorName(involved)}}</template>
                                                </div>
                                                <div class="task-list-item-content">
                                                    <div class="task-list-item-assignee">
                                                        <div class="assigneer-name">
                                                            <span>{{involved.fullName || involved.id}}</span>
                                                            <span class="actions">
                                                                <i
                                                                    v-if="!isCurrentUser(involved)"
                                                                    class="el-icon-close"
                                                                    @click="onRemoveInvolvedPeople(involved)"
                                                                ></i>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flowable-process-task">
                                        <h3 class="flowable-process-task-header">
                                            <span>相关内容</span>
                                            <CreateContent
                                                :visible="contentPopoverVisible"
                                                @upload="onNewContent"
                                            />
                                        </h3>
                                        <div class="flowable-process-task-list">
                                            <div
                                                v-for="content in taskContent"
                                                :key="content.id"
                                                class="flowable-process-task-list-item small task-content-item"
                                            >
                                                <div class="task-list-item-avator">
                                                    <i class="el-icon-document"></i>
                                                </div>
                                                <div class="task-list-item-content">
                                                    <div class="task-list-item-assignee">
                                                        <div class="assigneer-name">
                                                            <span>{{content.name}}</span>
                                                            <span class="actions">
                                                                <i
                                                                    class="el-icon-download"
                                                                    @click="onDownloadContent(content)"
                                                                ></i>
                                                                <i
                                                                    class="el-icon-close"
                                                                    @click="onRemoveContent(content)"
                                                                ></i>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flowable-process-task">
                                        <h3 class="flowable-process-task-header">
                                            <span>子任务</span>
                                            <CreateTask
                                                title="新建子任务"
                                                :visible.sync="newSubTaskPopper"
                                                :parent-task-id="taskDetail.id"
                                                @reload="reloadTasks"
                                            >
                                                <i
                                                    class="el-icon-circle-plus-outline task-action-icon"
                                                />
                                            </CreateTask>
                                        </h3>
                                        <ul class="flowable-lists">
                                            <li
                                                v-for="task in subtasks"
                                                :key="task.id"
                                                class="flowable-list-item"
                                                @click="onTaskClick(task)"
                                            >
                                                <div class="flowable-list-item-content">
                                                    <div class="flowable-list-item-header">
                                                        <div
                                                            class="flowable-process-name"
                                                        >{{task.name ? task.name:'未设置名称'}}</div>
                                                        <div
                                                            class="flowable-process-start-time process-calc-time"
                                                        >
                                                            <span>{{taskTime(task)}}</span>
                                                        </div>
                                                    </div>
                                                    <div class="flowable-list-item-summary">
                                                        <span>{{userName(task.assignee) ? userName(task.assignee) : '未分配用户'}}</span>
                                                    </div>
                                                    <div
                                                        class="description"
                                                    >{{task.description ? task.description:'这项任务没有说明'}}</div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="help-container">
                                <div>
                                    <div class="help-text">
                                        <div v-if="!isEnded" class="help-description">
                                            <span>此任务尚未详细说明。您可以通过选择下列操作之一来更改它:</span>
                                        </div>
                                        <div v-else class="help-description">此已完成的任务没有详细信息。</div>
                                        <div v-if="!isEnded" class="help-entry">
                                            <InvolvedPeople
                                                :visible.sync="involvedPeoplePopoverVisible"
                                                :clear.sync="clearSearchUsers"
                                                @selected="onNewInvolvedPeople"
                                            >
                                                <i class="el-icon-user-solid"></i>
                                                <span>参与其他人并开始合作</span>
                                            </InvolvedPeople>
                                        </div>
                                        <div v-if="!isEnded" class="help-entry">
                                            <CreateContent
                                                :visible="contentPopoverVisible"
                                                @upload="onNewContent"
                                            >
                                                <i class="el-icon-document"></i>
                                                <span>添加文档并共享知识</span>
                                            </CreateContent>
                                        </div>
                                        <!-- <div v-if="!isEnded" class="help-entry">
                                            <i class="el-icon-s-comment"></i>
                                            <span>通过添加评论启发他人</span>
                                        </div>-->
                                        <div v-if="!isEnded" class="help-entry">
                                            <CreateTask
                                                title="新建子任务"
                                                :visible.sync="newSubTaskPopper"
                                                :parent-task-id="taskDetail.id"
                                                @reload="reloadTasks"
                                            >
                                                <span>
                                                    <i class="el-icon-edit-outline"></i>
                                                    <span>创建一个子任务</span>
                                                </span>
                                            </CreateTask>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="help-container">
                        <div>
                            <div class="help-text">
                                <div class="help-description">你当前没有任务，你可以:</div>
                                <div class="help-entry">
                                    <CreateTask
                                        :visible.sync="newTaskEmptyPopper"
                                        @reload="reloadTasks"
                                    >
                                        <span>
                                            <i class="el-icon-circle-plus"></i>
                                            <span>为自己创建任务或将其分配给其他人</span>
                                        </span>
                                    </CreateTask>
                                </div>
                                <div class="help-entry" @click="onStartNewProcess">
                                    <i class="el-icon-circle-plus"></i>
                                    <span>启动一个新流程，然后跟踪器进度</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
</template>
<style lang="scss">
.edit-date-container {
    display: inline-block;
    position: relative;
    .edit-date-opt {
        position: absolute;
        top: -7px;
        left: 0;
        z-index: -10;
        opacity: 0;
        &.el-input,
        &.el-input__inner {
            width: auto;
        }
    }
}
</style>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { showLoading, showError, showMessage } from '@/utils'
import { fromNow } from '@/utils/BaseUtil'
import InvolvedPeople from './actions/involved-people'
import CreateContent from './actions/create-content'
import CreateTask from './actions/create-task'
import TaskForm from './actions/task-form'
export default {
    components: {
        AssigneePeople: InvolvedPeople,
        InvolvedPeople,
        CreateContent,
        CreateTask,
        TaskForm
    },
    data() {
        const searchForm = {
            assignment: "involved",
            state: 'open',
            sort: "created-desc",
            page: 1,
            total: 0,
            size: 5,
            processDefinitionId: null,
            text: null
        }
        return {
            searchForm,
            tasks: [],
            isFilterMore: false,
            currentProcessInstance: {},
            tab: 'content',
            // 新建任务Popover
            newTaskPopper: false,
            // 新建子任务Popover
            newSubTaskPopper: false,
            // 没有任务是点击创建任务Popover
            newTaskEmptyPopper: false,
            // 搜索用户保存成功后清理搜索条件和用户列表
            clearSearchUsers: false,
            // 分配用户Popover
            assigneePopoverVisible: false,
            // 关联用户Popover
            involvedPeoplePopoverVisible: false,
            // 上传内容Popover
            contentPopoverVisible: false,
            newDueDate: null
        }
    },
    computed: {
        ...mapState('authen', ['userinfo']),
        ...mapState('flowable/work/processes', ['processDefinitions']),
        ...mapState('flowable/work/tasks', ['selectedTask', 'taskDetail', 'taskContent', 'subtasks']),
        assignee() {
            return this.userinfo.account
        },
        getProcessDefinitionId() {
            return this.searchForm.processDefinitionId || null
        },
        userName() {
            return user => {
                if (!user) {
                    return ''
                }
                return user.fullName || user.id || ''
            }
        },
        hasTask() {
            return !!this.taskDetail.id
        },
        definitions() {
            return this.processDefinitions.data || []
        },
        isEnded() {
            return !!this.taskDetail.endDate
        },
        hasInvolvedPeople() {
            return this.taskDetail.involvedPeople && this.taskDetail.involvedPeople.length > 0
        },
        hasContent() {
            return this.taskContent && this.taskContent.length > 0
        },
        hasSubtasks() {
            return this.subtasks && this.subtasks.length > 0
        },
        hasFormKey() {
            return !!this.taskDetail.formKey
        },
        hasAssigneer() {
            return this.taskDetail.assignee && !!this.taskDetail.assignee.id
        },
        canEditAssigneer() {
            return !this.isEnded && this.hasAssigneer && this.isMyTask
        },
        hasDueDate() {
            return !!this.taskDetail.dueDate
        },
        canEditDueDate() {
            return !this.isEnded
        },
        isMyTask() {
            return this.taskDetail.assignee && this.isCurrentUser(this.taskDetail.assignee)
        },
        canComplete() {
            return this.isMyTask && !this.isEnded && this.isMyTask
        },
        hasContentDetail() {
            return this.hasInvolvedPeople || this.hasContent || this.hasSubtasks
        },
        taskTime() {
            return task => {
                if (task.endDate) {
                    return fromNow(task.endDate) + '结束'
                }
                if (task.dueDate) {
                    return fromNow(task.dueDate) + '超时'
                }
                return task.created ? fromNow(task.created) + '创建' : ''
            }
        },
        isCurrentUser() {
            return user => {
                return user.id === this.userinfo.account
            }
        },
        hasPage() {
            const { total } = this.searchForm
            return total > 0
        },
        hasPrevPage() {
            const { page } = this.searchForm
            if (!this.hasPage) {
                return false
            }
            return page - 1 > 0
        },
        hasNextPage() {
            const { page, size, total } = this.searchForm
            if (!this.hasPage) {
                return false
            }
            return page * size < total
        }
    },
    watch: {
        taskDetail(newTaskDetail) {
            const index = this.tasks.findIndex(task => task.id === newTaskDetail.id)
            if (index > -1) {
                this.tasks.splice(index, 1, { ...this.tasks[index], ...newTaskDetail })
            }
        }
    },
    created() {
        this.setState(this.selectedTask)
        this.reloadTasks()
        this.loadProcessDefinitions()
    },
    methods: {
        ...mapActions('flowable/work/tasks', [
            'queryTasks',
            'getTask',
            'getTaskContent',
            'getSubTasks',
            'completeTask',
            'assignUser',
            'updateTask',
            'involveUser',
            'removeInvolveUser',
            'createTaskContent',
            'removeTaskContent',
            'dowloadTaskContent'
        ]),
        ...mapActions('flowable/work/processes', ['getProcessDefinitions', 'getProcessInstance']),
        ...mapMutations('flowable/work/tasks', [
            'setSelectedTask',
            'setTaskDetail',
            'setTaskContent',
            'setSubTasks'
        ]),
        ...mapMutations('flowable/work/processes', ['setSelectedInstance']),
        getAvatorName(user) {
            const userName = user.fullName || user.id || ''
            if (userName) {
                return userName.split('')[0].toUpperCase()
            }
            return ''
        },
        onLoadMore(isNext = true) {
            this.setSelectedTask({})
            if (isNext) {
                this.searchForm.page = this.searchForm.page + 1
                this.reloadTasks()
            } else {
                this.searchForm.page = this.searchForm.page - 1
                this.reloadTasks()
            }
        },
        reloadTasks() {
            const { page, total, size, ..._params } = this.searchForm
            const params = { page: page - 1, size, ..._params, assignee: this.assignee }
            showLoading(true, '正在加载数据...')
            this.queryTasks(params).then(rest => {
                showLoading(false)
                this.tasks = rest.data || []
                this.searchForm = { ...this.searchForm, total: rest.total, page }
                let task = this.selectedTask
                if ((!task || !task.id) && this.tasks.length > 0) {
                    task = this.tasks[0]
                    this.setSelectedTask(task)
                }
                this.loadTask(task)
            }).catch(error => {
                showError(error.message)
                showLoading(false)
            })
        },
        setState(task) {
            if (task.id) {
                if (task.endDate && this.searchForm.state !== 'completed') {
                    this.searchForm.state = 'completed'
                } else {
                    this.searchForm.state = 'open'
                }
            }
        },
        loadProcessDefinitions() {
            // showLoading('正在加载数据...')
            this.getProcessDefinitions().then(() => {
                // showLoading(false)
            }).catch(() => {
                // showLoading(false)
            })
        },
        loadTask(task) {
            // 默认设置第一个，请求后更新即可
            this.setTaskDetail(task)
            this.setTaskContent([])
            this.setSubTasks([])
            this.onSwitchContent()
            const taskId = task.id
            const processInstanceId = task.processInstanceId
            showLoading(true, '正在加载数据...')
            Promise.all([
                this.reloadTask(taskId, false),
                this.getTaskContent(taskId),
                this.getSubTasks({ taskId, sort: "created-desc" }),
                processInstanceId && this.getProcessInstance(processInstanceId)
            ].filter(Boolean)).then(([taskDetail, taskContent, subtasks, processesInstance]) => {
                showLoading(false)
                if (processesInstance) {
                    this.currentProcessInstance = processesInstance
                }
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        reloadTask(taskId, isLoading = true) {
            isLoading && showLoading(true, '正在加载数据...')
            return this.getTask(taskId).then(response => {
                isLoading && showLoading(false)
                return Promise.resolve(response)
            }).catch(error => {
                isLoading && showLoading(false)
                return Promise.reject(error)
            })
        },
        onParamsChange() {
            this.setSelectedTask({})
            this.searchForm.page = 1
            this.reloadTasks()
        },
        onFilterMore() {
            this.isFilterMore = !this.isFilterMore
        },
        onTaskClick(task) {
            if (this.selectedTask.id === task.id) {
                return
            }
            this.setSelectedTask(task)
            this.loadTask(task)
        },
        onCompleteTask() {
            showLoading(true, '正在提交数据...')
            this.completeTask(this.selectedTask.id).then(() => {
                showLoading(false)
                this.setSelectedTask({})
                this.reloadTasks()
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        onToContent() {
            this.tab = 'content'
        },
        onSwitchContent() {
            if (this.hasFormKey) {
                this.tab = 'form'
            } else {
                this.tab = 'content'
            }
        },
        onToProcessInstance() {
            this.setSelectedInstance(this.currentProcessInstance)
            this.$router.push('/flowable/work/processes')
        },
        onStartNewProcess() {
            this.$router.push('/flowable/work/processes/startup')
        },
        onNewAssignee(user) {
            const taskId = this.selectedTask.id
            const params = { assignee: user.id, taskId }
            showLoading(true, '正在提交数据...')
            this.assignUser(params).then(data => {
                showLoading(false)
                this.setTaskDetail(data)
                this.clearSearchUsers = true
                this.assigneePopoverVisible = false
                showMessage('任务已分配给新用户:' + user.fullName)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
            // this.clearSearchUsers = true
        },
        onDueDateVisible() {
            if (this.$refs.dueDatePicker.pickerVisible === true) {
                return
            } else {
                this.$refs.dueDatePicker.showPicker()
            }
        },
        onDueDateChange(value) {
            showLoading(true, '正在提交数据...')
            const taskId = this.selectedTask.id
            const task = { dueDate: value.toISOString(), taskId }
            this.updateTask(task).then(data => {
                showLoading(false)
                const taskDetail = { ...this.taskDetail, dueDate: data.dueDate }
                this.setTaskDetail(taskDetail)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        onNewInvolvedPeople(user) {
            const taskId = this.selectedTask.id
            const params = { userId: user.id, taskId }
            showLoading(true, '正在提交数据...')
            this.involveUser(params).then(response => {
                showLoading(false)
                this.reloadTask(taskId)
                this.clearSearchUsers = true
                this.involvedPeoplePopoverVisible = false
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        onRemoveInvolvedPeople(involved) {
            const taskId = this.selectedTask.id
            const params = { userId: involved.id, taskId }
            showLoading(true, '正在提交数据...')
            this.removeInvolveUser(params).then(response => {
                showLoading(false)
                this.reloadTask(taskId)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        onNewContent({ file, onError, onSuccess, onProgress }) {
            showLoading(true, '正在上传内容...')
            const taskId = this.selectedTask.id
            const params = { file, taskId }
            this.createTaskContent(params).then(response => {
                showLoading(false)
                this.contentPopoverVisible = false
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        onDownloadContent(content) {
            //dowloadTaskContent
            const params = { contentId: content.id, filename: content.name }
            showLoading(true, '正在下载...')
            this.dowloadTaskContent(params).then(() => {
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        onRemoveContent(content) {
            showLoading(true, '正在删除内容...')
            const taskId = this.selectedTask.id
            const params = { contentId: content.id, taskId }
            this.removeTaskContent(params).then(() => {
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
    }
}
</script>
