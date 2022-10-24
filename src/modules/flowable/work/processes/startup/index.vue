<template>
    <el-card class="card-container flowable-card-container no-padding">
        <el-row>
            <el-col :span="6">
                <div class="card-left-header">
                    <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-arrow-left"
                        @click="onBackProcess"
                    >返回流程实例</el-button>
                </div>
                <div class="card-left-body">
                    <ul class="flowable-lists">
                        <li
                            v-for="item in _processDefinitions"
                            :key="item.id"
                            :class="'flowable-list-item '+ (definition.id === item.id ? 'active':'')"
                            @click="onDefinitionItemClick(item)"
                        >
                            <div class="flowable-list-item-content">
                                <div class="flowable-list-item-header">
                                    <div
                                        class="flowable-process-name"
                                    >{{item.name ? item.name:'未设置名称'}}</div>
                                    <!--  <div
                                        class="flowable-process-start-time process-calc-time"
                                    >{{item.started | fromNow}} 开始</div>-->
                                </div>
                                <div class="flowable-list-item-summary">
                                    <!-- eslint-disable-next-line -->
                                    <span>{{item.description ||''}}</span>
                                    <span style="margin-left: 10px;">v{{item.version ||''}}</span>
                                </div>
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
                    <el-form
                        ref="instanceFormRef"
                        label-width="100px"
                        :model="instance"
                        :rules="instanceRules"
                    >
                        <el-form-item label="实例名称" prop="name">
                            <el-input v-model="instance.name" placeholder="实例名称" :maxlength="200" />
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                size="mini"
                                type="primary"
                                @click="onStartProcessInstance"
                            >启动流程</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { showLoading, showError } from '@/utils'
import { matchName } from '@/utils/RegExpUtil'

export default {
    data() {
        const instance = { name: '' }
        const instanceRules = {
            name: [
                { required: true, message: '实例名称不能为空' },
                {
                    validator: function (rule, value, callback) {
                        if (!matchName(value)) {
                            callback('只允许中文、数字、字母、下划线、横线、空格；两边不能有空格和横线')
                        } else {
                            callback()
                        }
                    },
                }
            ]
        }

        return {
            definition: {},
            instance,
            instanceRules,
        }
    },
    computed: {
        ...mapState('flowable/work/processes', ['processDefinitions']),
        _processDefinitions() {
            return this.processDefinitions.data || []
        },
        hasPage() {
            const { total } = this.processDefinitions
            return total > 0
        },
        hasPrevPage() {
            const { page } = this.processDefinitions
            if (!this.hasPage) {
                return false
            }
            return page - 1 > 0
        },
        hasNextPage() {
            const { page, size, total } = this.processDefinitions
            if (!this.hasPage) {
                return false
            }
            return page * size < total
        },
        page() {
            return this.processDefinitions.page
        },
        size() {
            return this.processDefinitions.size
        }
    },
    created() {
        this.reloadProcessDefinitions({ page: this.page, size: this.size })
    },
    methods: {
        ...mapActions('flowable/work/processes', [
            'getProcessDefinitions',
            'startProcessInstance',
            'getProcessDefinitionsStartForm'
        ]),
        onLoadMore(isNext) {
            this.definition = {}
            if (isNext) {
                this.reloadProcessDefinitions({ page: this.page + 1, size: this.size })
            } else {
                this.reloadProcessDefinitions({ page: this.page - 1, size: this.size })
            }
        },
        reloadProcessDefinitions(params = {}) {
            showLoading(true, '正在加载数据...')
            this.getProcessDefinitions(params).then(defaultData => {
                this.onDefinitionItemClick(defaultData)
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        loadProcessDefinitionStartForm(definition) {
            showLoading('正在加载数据...')
            this.getProcessDefinitionsStartForm(definition.id).then(startForm => {
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        onBackProcess() {
            this.$router.push('/flowable/work/processes')
        },
        onDefinitionItemClick(definition) {
            this.definition = definition
            this.instance.name = definition.name
            if (definition.hasStartForm) {
                // 加载启动时候的表单数据
                this.loadProcessDefinitionStartForm(definition)
            }
        },
        onStartProcessInstance() {
            const { name } = this.instance
            const { id: processDefinitionId } = this.definition
            this.$refs['instanceFormRef'].validate(valid => {
                if (valid) {
                    showLoading(true, '正在启动流程...')
                    this.startProcessInstance({ name, processDefinitionId }).then(() => {
                        showLoading(false)
                        this.onBackProcess()
                    }).catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
                }
            })
        }
    }
}
</script>
