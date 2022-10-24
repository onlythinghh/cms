<template>
    <el-card class="card-container flowable-card-container no-padding">
        <el-row>
            <el-col :span="6">
                <div class="card-left-header">
                    <el-radio-group v-model="searchForm.state" size="mini" @change="onStateChange">
                        <el-radio-button label="all">全部</el-radio-button>
                        <el-radio-button label="running">运行</el-radio-button>
                        <el-radio-button label="completed">已完成</el-radio-button>
                    </el-radio-group>

                    <span class="toolbars">
                        <el-tooltip content="启动流程" placement="top">
                            <el-button
                                type="primary"
                                size="mini"
                                icon="el-icon-switch-button"
                                @click="onStartup"
                            >
                                <span class="hidden-lg-and-down">启动流程</span>
                            </el-button>
                        </el-tooltip>
                    </span>
                </div>
                <div class="card-left-body">
                    <ul class="flowable-lists">
                        <li
                            v-for="item in instances"
                            :key="item.id"
                            :class="'flowable-list-item '+ (instance.id === item.id ? 'active':'')"
                            @click="onInstanceItemClick(item)"
                        >
                            <div class="flowable-list-item-content">
                                <div class="flowable-list-item-header">
                                    <div
                                        class="flowable-process-name"
                                    >{{item.name ? item.name:'未设置名称'}}</div>
                                    <div
                                        class="flowable-process-start-time process-calc-time"
                                    >{{item.started | fromNow}} 开始</div>
                                </div>
                                <div class="flowable-list-item-summary">
                                    <!-- eslint-disable-next-line -->
                                    <span>{{userName(item.startedBy) ? '由'+userName(item.startedBy)+'启动' : '未分配用户'}}</span>
                                    <span
                                        style="margin-left:10px;"
                                    >{{item.started | dateFormat('YYYY-MM-DD HH:mm')}}</span>
                                </div>
                                <div class="description">{{item.processDefinitionName}}</div>
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
                <el-card v-if="instance.id" shadow="never">
                    <div slot="header" class="clearfix flowable-header">
                        <div class="flowable-header-title">
                            <h2 class="title">{{instance.name ? instance.name : '未设置名称'}}</h2>
                            <div class="detail">
                                <span>启动用户: {{userName(instance.startedBy) ? '由'+userName(instance.startedBy)+'启动' : '未分配用户'}}</span>
                                <span>开始: {{instance.started | fromNow}}</span>
                                <span v-if="isEnded(instance)">结束: {{instance.ended | fromNow}}</span>
                                <span v-else>结束: 未结束</span>
                            </div>
                        </div>
                        <div>
                            <el-button v-if="showbpmn" size="mini" type="primary">显示图</el-button>
                            <el-button
                                v-if="canCancel(instance)"
                                size="mini"
                                type="primary"
                                @click="onCancelProcessInstance"
                            >取消流程</el-button>
                            <el-button
                                v-if="candelete(instance)"
                                size="mini"
                                type="primary"
                                @click="onDeleteProcessInstance"
                            >删除流程</el-button>
                        </div>
                    </div>
                    <div class="flowable-process-tasks">
                        <div class="flowable-process-task">
                            <h3 class="flowable-process-task-header">活动中的任务</h3>
                            <div class="flowable-process-task-list">
                                <div
                                    v-if="!runningTasks || runningTasks.length ===0"
                                    class="empty-task"
                                >当前没有任务处于活动状态 ...</div>
                                <div
                                    v-for="task in runningTasks"
                                    v-else
                                    :key="task.id"
                                    class="flowable-process-task-list-item"
                                    @click="onTaskClick(task)"
                                >
                                    <div
                                        v-if="userName(task.assignee)"
                                        class="task-list-item-avator"
                                    >{{getAvatorName(task.assignee.fullName || task.assignee.id)}}</div>
                                    <div class="task-list-item-content">
                                        <div class="task-list-item-assignee">
                                            <div class="assigneer-name">{{task.name}}</div>
                                            <div class="assigneer-time process-calc-time">
                                                <span>{{task.created| fromNow}}</span> 创建
                                            </div>
                                        </div>
                                        <div class="task-list-item-description">
                                            <span v-if="userName(task.assignee)">
                                                当前分配给
                                                <span>{{userName(task.assignee)}}</span>
                                            </span>
                                            <span v-else>尚未分配用户</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flowable-process-task">
                            <h3 class="flowable-process-task-header">完成的任务</h3>
                            <div class="flowable-process-task-list">
                                <div
                                    v-if="!completedTasks || completedTasks.length ===0"
                                    class="empty-task"
                                >当前没有任务处于完成状态 ...</div>
                                <div
                                    v-for="task in completedTasks"
                                    v-else
                                    :key="task.id"
                                    class="flowable-process-task-list-item"
                                    @click="onTaskClick(task)"
                                >
                                    <div
                                        v-if="userName(task.assignee)"
                                        class="task-list-item-avator"
                                    >{{getAvatorName(task.assignee.fullName || task.assignee.id)}}</div>
                                    <div class="task-list-item-content">
                                        <div class="task-list-item-assignee">
                                            <div class="assigneer-name">{{task.name}}</div>
                                            <div class="assigneer-time process-calc-time">
                                                <span>耗时 {{task.duration | dateDuration}}</span>
                                            </div>
                                        </div>
                                        <div class="task-list-item-description">
                                            <span v-if="userName(task.assignee)">
                                                <span>{{userName(task.assignee)}}</span>
                                                <span
                                                    style="margin-left:5px;"
                                                >{{task.endDate | fromNow}}完成</span>
                                            </span>
                                            <span v-else>尚未分配用户</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>
                <el-card v-else shadow="never">
                    <div class="help-container">
                        <div>
                            <div class="help-text">
                                <div class="help-description">
                                    <span>现在没有正在运行的流程。如果流程已完成, 则可以使用 "流程" 列表的筛选器找到它们</span>
                                </div>
                                <div class="help-entry" @click="onStartup">
                                    <i class="el-icon-circle-plus"></i>
                                    <span>启动新流程并跟踪其进度</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { showLoading, showError } from '@/utils'

export default {
    data() {
        const searchForm = {
            page: 1,
            size: 5,
            total: 0,
            state: 'running',
            sort: "created-desc"
        }
        return {
            searchForm,
            // instance: {},
            runningTasks: [],
            completedTasks: [],
            showbpmn: false
        }
    },
    computed: {
        ...mapState('authen', ['userinfo']),
        ...mapState('flowable/work/processes', ['processInstances', 'selectedInstance']),
        ...mapGetters('flowable/work/processes', ['hasProcessInstance']),
        /* hasNextPage() {
            const { page = 1, size = 0, total = 0 } = this.processInstances || {}
            if (size == 0 || total == 0) {
                return false
            }
            const totalPage = total % size === 0 ? total / size : Math.floor(total / size) + 1
            if (page < totalPage) {
                return true
            }
            return false
        }, */
        hasPage() {
            const { total } = this.processInstances
            return total > 0
        },
        hasPrevPage() {
            const { page } = this.processInstances
            if (!this.hasPage) {
                return false
            }
            return page - 1 > 0
        },
        hasNextPage() {
            const { page, size, total } = this.processInstances
            if (!this.hasPage) {
                return false
            }
            return page * size < total
        },
        instances() {
            return this.processInstances.data || []
        },
        userName() {
            return user => {
                if (!user) {
                    return ''
                }
                return user.fullName || user.id || ''
            }
        },
        instance: {
            get() {
                return this.selectedInstance
            },
            set(instance) {
                this.setSelectedInstance(instance)
            }
        }
    },
    created() {
        this.reloadProcessInstances()
    },
    methods: {
        ...mapActions('flowable/work/processes', ['queryProcessInstances', 'getProcessInstance', 'deleteProcessInstance']),
        ...mapActions('flowable/work/tasks', ['queryTasks']),
        ...mapMutations('flowable/work/processes', ['setSelectedInstance']),
        ...mapMutations('flowable/work/tasks', ['setSelectedTask']),
        onLoadMore(isNext) {
            this.instance = {}
            if (isNext) {
                this.searchForm.page = this.searchForm.page + 1
                this.reloadProcessInstances()
            } else {
                this.searchForm.page = this.searchForm.page - 1
                this.reloadProcessInstances()
            }
        },
        reloadProcessInstances({ total, ...params } = this.searchForm) {
            showLoading(true, '正在加载数据...')
            this.queryProcessInstances(params).then(defaultData => {
                showLoading(false)
                if (!this.instance.id || !this.hasProcessInstance(this.instance.id)) {
                    this.instance = defaultData
                    this.loadProcessInstance(defaultData.id)
                } else {
                    this.loadProcessInstance(this.instance.id)
                }
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        loadProcessInstance(processInstanceId) {
            if (!processInstanceId) {
                return
            }
            showLoading(true, '正在加载数据...')
            const params = { processInstanceId }
            Promise.all([
                this.getProcessInstance(processInstanceId),
                this.queryTasks({ ...params, state: 'completed' }),
                this.queryTasks({ ...params })
            ]).then(([instance, completed, running]) => {
                showLoading(false)
                this.instance = instance || {}
                this.completedTasks = completed.data || []
                this.runningTasks = running.data || []
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        isEnded(instance) {
            return !!instance.ended
        },
        canCancel(instance) {
            if (!this.isEnded(instance) && instance.startedBy && instance.startedBy.id === this.userinfo.account) {
                return true
            }
            return false
        },
        candelete(instance) {
            if (this.isEnded(instance) && instance.startedBy && instance.startedBy.id === this.userinfo.account) {
                return true
            }
            return false
        },
        getAvatorName(name) {
            if (name) {
                return name.split('')[0].toUpperCase()
            }
            return ''
        },
        _deleteProcessInstance() {
            const instance = this.instance
            showLoading(true, '正在提交数据...')
            this.deleteProcessInstance(instance.id).then(() => {
                showLoading(false)
                this.instance = {}
                this.reloadProcessInstances()
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        onStateChange() {
            this.reloadProcessInstances()
        },
        onInstanceItemClick(instance) {
            if (this.instance.id !== instance.id) {
                this.instance = instance
                this.loadProcessInstance(instance.id)
            }
        },
        onCancelProcessInstance() {
            const instance = this.instance
            this.$confirm(`确认取消流程 ${instance.name || ''}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this._deleteProcessInstance()
            }).catch(() => { })
        },
        onDeleteProcessInstance() {
            const instance = this.instance
            this.$confirm(`确认删除流程 ${instance.name || ''}? 所有与此流程相关的任务、内容和评论将被永久删除。`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this._deleteProcessInstance()
            }).catch(() => { })
        },
        onStartup() {
            this.$router.push('/flowable/work/processes/startup')
        },
        onTaskClick(task) {
            this.setSelectedTask(task)
            this.$router.push('/flowable/work/tasks')
        }
    }
}
</script>
