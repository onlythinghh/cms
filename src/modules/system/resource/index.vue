<template>
    <el-card class="card-container">
        <el-row>
            <el-col :span="6">
                <div class="card-left-header">
                    <el-radio-group v-model="resourceDisplayType" size="mini">
                        <el-radio-button label="0">全部</el-radio-button>
                        <el-radio-button
                            v-for="(val, key) in resourceType"
                            :key="key"
                            :label="key"
                        >{{val}}</el-radio-button>
                        <!-- <el-radio-button label="0">全部</el-radio-button>
                        <el-radio-button label="1">页面</el-radio-button>
                        <el-radio-button label="2">元素</el-radio-button>
                        <el-radio-button label="3">接口</el-radio-button>-->
                    </el-radio-group>
                    <span class="toolbars">
                        <el-button type="text" size="mini" @click="_addResource({}, $event)">
                            <el-tooltip content="新增资源">
                                <i class="el-icon-plus-resource el-icon-circle-plus-outline"></i>
                            </el-tooltip>
                        </el-button>
                    </span>
                </div>
                <div class="card-left-body">
                    <el-alert type="success" class="tree-opt-tips">
                        <template v-slot>
                            <i class="el-icon-remove-outline tips-icon">禁用</i>
                            <i class="el-icon-circle-check tips-icon">启用</i>
                            <i class="el-icon-circle-plus-outline tips-icon">添加(子)节点</i>
                            <i class="el-icon-circle-close tips-icon">删除节点</i>
                        </template>
                    </el-alert>
                    <el-tree
                        ref="resourceTree"
                        :data="filteredTreeResources"
                        show-checkbox
                        node-key="id"
                        :default-expand-all="false"
                        :auto-expand-parent="true"
                        :expand-on-click-node="true"
                        :check-on-click-node="true"
                        :check-strictly="true"
                        :default-checked-keys="tree.checkedKeys"
                        :default-expanded-keys="tree.expandKeys"
                        @check="check"
                    >
                        <template v-slot="{node, data}">
                            <span class="tree-custome-node">
                                <span>{{ node.label }}</span>
                                <span class="tools">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="_enableResource({...data, children:[]}, $event)"
                                    >
                                        <el-tooltip :content="data.enabled ? '禁用':'启用'">
                                            <i
                                                :class="data.enabled ? 'el-icon-remove-outline':'el-icon-circle-check'"
                                            ></i>
                                        </el-tooltip>
                                    </el-button>
                                    <el-button
                                        v-show="data.type === 1 && data.enabled && data.level < 5"
                                        type="text"
                                        size="mini"
                                        @click="_addResource({...data, children:[]}, $event)"
                                    >
                                        <el-tooltip content="添加子节点">
                                            <i class="el-icon-circle-plus-outline"></i>
                                        </el-tooltip>
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="_delResource({...data, children:[]}, $event)"
                                    >
                                        <el-tooltip content="删除">
                                            <i class="el-icon-circle-close"></i>
                                        </el-tooltip>
                                    </el-button>
                                </span>
                            </span>
                        </template>
                    </el-tree>
                </div>
            </el-col>
            <el-col :span="18">
                <div>
                    <el-form
                        ref="resourceForm"
                        :model="resourceForm"
                        :rules="resourceFormRules"
                        label-width="100px"
                    >
                        <el-form-item>
                            <div class="body-header">{{ edit.isAdd ? '新增' : '编辑' }}资源</div>
                        </el-form-item>
                        <el-form-item label="资源名称" prop="name">
                            <el-col :span="12">
                                <el-input
                                    ref="resourceName"
                                    v-model="resourceForm.name"
                                    placeholder="资源名称"
                                    maxlength="50"
                                    clearable
                                />
                            </el-col>
                        </el-form-item>
                        <el-form-item label="资源编码" prop="code">
                            <el-col :span="12">
                                <el-input
                                    v-model="resourceForm.code"
                                    placeholder="资源编码"
                                    maxlength="50"
                                    clearable
                                />
                            </el-col>
                            <el-col :span="1">
                                <CodeTips />
                            </el-col>
                        </el-form-item>
                        <el-form-item label="父级资源" prop="pid">
                            <el-col :span="12">
                                <!-- <el-input placeholder="父级资源" v-model="resourceForm.pid"/> -->
                                <!-- <el-select
                                    v-model="resourceForm.pid"
                                    class="w100"
                                    filterable
                                    clearable
                                    placeholder="请选择父级资源"
                                >
                                    <el-option
                                        v-for="(item, index) in parentResources"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.id"
                                    ></el-option>
                                </el-select>-->
                                <TreeSelect
                                    ref="testSelect"
                                    v-model="resourceForm.pid"
                                    placeholder="请选择父级资源"
                                    :options="parentResources"
                                    :checked-on-click="true"
                                    text-prop="label"
                                />
                            </el-col>
                            <el-col :span="1">
                                <el-tooltip content="父级资源为空则是根节点资源；不能选择自己作为父级资源">
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="资源类型" prop="type">
                            <el-col :span="12">
                                <el-select
                                    v-model="resourceForm.type"
                                    class="w100"
                                    :disabled="!edit.isAdd"
                                    clearable
                                    placeholder="请选择资源类型"
                                >
                                    <el-option
                                        v-for="(value, key) in resourceType"
                                        :key="key"
                                        :label="value"
                                        :value="Number(key)"
                                    ></el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="资源链接" prop="url">
                            <el-col :span="12">
                                <el-input
                                    v-model="resourceForm.url"
                                    placeholder="资源链接"
                                    maxlength="250"
                                    clearable
                                />
                            </el-col>
                        </el-form-item>
                        <el-form-item label="排序" prop="sort">
                            <el-col :span="12">
                                <el-input
                                    v-model="resourceForm.sort"
                                    placeholder="排序"
                                    maxlength="2"
                                    clearable
                                />
                            </el-col>
                        </el-form-item>
                        <el-form-item label="图标" prop="icon">
                            <el-col :span="12">
                                <el-select
                                    v-model="resourceForm.icon"
                                    placeholder="请选择资源图标"
                                    class="w100"
                                    clearable
                                >
                                    <el-option
                                        v-for="(icon, index) in icons"
                                        :key="index"
                                        :label="icon"
                                        :value="icon"
                                    >
                                        <span style="float: left">{{ icon }}</span>
                                        <span style="font-size:20px; float: right">
                                            <i :class="icon"></i>
                                        </span>
                                    </el-option>
                                </el-select>
                                <!-- <el-input placeholder="图标" v-model="resourceForm.icon">
                                    <template v-slot:append>
                                        <i
                                            :class="resourceForm.icon ? resourceForm.icon : 'el-icon-s-tools'"
                                        ></i>
                                    </template>
                                </el-input>-->
                            </el-col>
                        </el-form-item>
                        <el-form-item label="是否启用" prop="enabled">
                            <el-col :span="12">
                                <el-checkbox v-model="resourceForm.enabled"></el-checkbox>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="启用数据权限" prop="dataPerm">
                            <el-col :span="12">
                                <el-checkbox v-model="resourceForm.dataPerm"></el-checkbox>
                            </el-col>
                        </el-form-item>
                        <el-form-item
                            v-if="resourceForm.dataPerm"
                            label="数据权限类型"
                            prop="dataPermType"
                        >
                            <el-col :span="12">
                                <el-select
                                    v-model="resourceForm.dataPermType"
                                    class="w100"
                                    clearable
                                    placeholder="请选择数据权限类型"
                                >
                                    <el-option label="查看" :value="1"></el-option>
                                    <el-option label="操作" :value="2"></el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                        <el-form-item>
                            <el-col :span="12">
                                <el-button type="primary" @click="save">保 存</el-button>
                            </el-col>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>
<style lang="scss">
/* .resource-custome-node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    font-size: 14px;
    .tools i {
        font-size: 20px;
    }
} */
.toolbars .el-icon-plus-resource {
    font-size: 20px;
}
.body-header {
    font-weight: bold;
    font-size: 18px;
}
/* .tree-opt-tips {
    padding-left: 0 !important;
    margin-bottom: 10px !important;
    .el-alert__description {
        margin: 0 !important;
    }
    .el-alert__closebtn {
        top: 10px;
    }
    .tips-icon:not(:first-child) {
        font-size: 14px;
        margin-left: 10px;
    }
} */
</style>

<script>
import { mapGetters, mapActions } from 'vuex'
import { showLoading, showError, confirm, showMessage } from '../../../utils'
import { deepCopy } from '../../../utils/BaseUtil'
import { matchName, matchExtraCode, matchUrl, matchRemoteUrl } from '../../../utils/RegExpUtil'
import icons from './icon'
export default {
    name: 'Resources',
    data() {
        const defaultResource = {
            id: null,
            name: '',
            code: '',
            pid: null,
            enabled: true,
            url: '',
            sort: 0,
            type: 1,
            dataPerm: false,
            dataPermType: 1

        }
        const resourceFormRules = {
            name: [
                { required: true, message: '资源名称不能为空' },
                { max: 20, message: '长度最长20个字符', trigger: 'blur' },
                {
                    validator: function (rule, value, callback) {
                        if (!matchName(value)) {
                            callback(
                                '资源名称只允许输入中文、数字、字母、下划线、横线、空格；两边不能有空格和横线'
                            )
                        } else {
                            callback()
                        }
                    }
                }
            ],
            code: [
                { required: true, message: '资源编码不能为空' },
                {
                    validator: function (rule, value, callback) {
                        if (!matchExtraCode(value)) {
                            callback(
                                '只允许输入数字、字母、特殊字符(:-_),特殊字符不能连续且只能出现一种'
                            )
                        } else {
                            callback()
                        }
                    }
                }
            ],
            type: [{ required: true, message: '请选择资源类型' }],
            url: [
                {
                    required: true,
                    validator: (rule, value, callback) => {
                        if (this.resourceForm.type !== 2 && !value) {
                            // 页面链接不能为空
                            callback('页面和接口链接不能为空')
                        } else if (value && value !== '/' && !matchRemoteUrl(value) && !matchUrl(value)) {
                            callback('连接输入不合法')
                        } else {
                            callback()
                        }
                    }
                }
            ],
            sort: [
                { required: true, message: '请输入排序号' },
                {
                    validator: function (rule, value, callback) {
                        if (!/^-?\d+$/.test(value)) {
                            callback('只能输入数字')
                        } else if (Number(value) < 0 || Number(value) > 100) {
                            callback('排序不能小于0大于100')
                        } else {
                            callback()
                        }
                    }
                }
            ]
        }
        return {
            resourceDisplayType: 0, // 0 全部 1 页面 2 元素 3 接口,
            tree: {
                checkedKeys: [],
                expandKeys: []
            },
            defaultResource,
            resourceForm: { ...defaultResource },
            resourceFormRules,
            edit: {
                isAdd: true
            }
        }
    },
    computed: {
        ...mapGetters('system/resource', ['treeResources', 'normalizeResources']),
        // ...mapState('system/resource', ['resourceType']),
        ...mapGetters('authen', ['getDictionary']),
        resourceType() {
            return this.getDictionary('resourceType')
        },
        filteredTreeResources() {
            const resourceDisplayType = this.resourceDisplayType
            // 操作副本
            const treeResources = deepCopy(this.treeResources)

            const filter = function (_resources) {
                if (Number(resourceDisplayType) === 0) {
                    return _resources
                }
                return _resources.filter(resource => {
                    const type = resource.type
                    if (type === 1 || type === Number(resourceDisplayType)) {
                        const children = resource.children
                        if (children && children.length > 0) {
                            resource.children = filter(children)
                        }
                        return true
                    }
                    return false
                })
            }
            return filter(treeResources)
        },
        icons() {
            return icons
        },
        // 父级资源
        parentResources() {
            const treeResources = deepCopy(this.treeResources || [])
            return this.toOptions(treeResources)
        }
    },

    created() {
        this.reloadResources()
    },
    methods: {
        ...mapActions('system/resource', [
            'loadResources',
            'saveResource',
            'delResource',
            'enableResource'
        ]),
        toOptions(resources) {
            const { id: currentId } = this.resourceForm
            return resources.map(({ name: label, id: value, level, type, children }) => {
                const opt = { label, value, level, type }
                if (children && children.length > 0) {
                    opt.children = this.toOptions(children)
                }
                return opt
            }).filter(res => {
                if (res.type === 1) {
                    // 父级不能选中自己和自己的子级
                    if (currentId === res.value) {
                        return false
                    }
                    return true
                }
                return false
            })
        },
        // 树选中的操作
        check: function (data) {
            const expandKeys = [data.id]
            if (!data.children || data.children.length === 0) {
                const node = this.$refs.resourceTree.getNode(data.pid)
                if (node) {
                    expandKeys[0] = node.key
                }
            }
            this.tree.expandKeys = expandKeys
            // 单选
            this.setResourcesTreeChecked([data.id])

            this._editResource(false, data)
        },
        // 设置树的选中
        setResourcesTreeChecked(checkedKeys) {
            this.$refs.resourceTree.setCheckedKeys(checkedKeys)
        },
        _enableResource(resource, event) {
            event.stopPropagation()
            const tips = `该操作可能导致子元素也无法使用，确认禁用 ${resource.name} 吗？`
            if (resource.enabled) {
                confirm(tips, '警告', {
                    ok: () => {
                        this.__enableResource(resource)
                    }
                }
                )
            } else {
                this.__enableResource(resource)
            }
        },
        __enableResource(resource) {
            showLoading(true, '')
            this.enableResource(resource)
                .then(() => {
                    showLoading(false)
                    this.reloadResources()
                    if (this.resourceForm.id === resource.id) {
                        this.resourceForm.enabled = !resource.enabled
                    }
                })
                .catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
        },
        // 新增资源
        _addResource(resource, event) {
            event.stopPropagation()
            this.setResourcesTreeChecked([resource.id])
            this._editResource(true, {
                ...this.defaultResource,
                type: 1,
                pid: resource.id
            })
            // 自动聚焦到 资源名称
            // this.$refs.resourceName.focus()
            this.$refs.resourceForm.resetFields()
        },
        _delResource(resource, event) {
            event.stopPropagation()
            const tips = `若存在子元素将会全部删除，确认删除 ${resource.name} 吗?`
            confirm(tips, '警告', {
                ok: () => {
                    showLoading(true, `正在删除资源 ${resource.name}`)
                    this.delResource(resource)
                        .then(() => {
                            showLoading(false)
                            showMessage('资源删除成功')
                            this.edit.isAdd = true
                            this.resourceForm = {
                                ...this.defaultResource
                            }
                            this.reloadResources()
                        })
                        .catch(error => {
                            showLoading(false)
                            showError(error.message)
                        })
                }
            }
            )
        },
        // isAdd = true resource 是父节点
        // isAdd = false resource 是当前节点
        _editResource(isAdd, { children, ...resource }) {
            this.edit.isAdd = !!isAdd
            this.resourceForm = { ...resource, pid: resource.pid || null }
        },
        reloadResources() {
            showLoading(true, '正在获取资源...')
            // 0 表示查询全部资源
            this.loadResources({ enable: 0 })
                .then(res => {
                    showLoading(false)
                })
                .catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
        },
        save() {
            this.$refs.resourceForm.validate(valid => {
                if (!valid) {
                    return false
                }
                showLoading(true, '正在保存资源')
                this.saveResource(this.resourceForm)
                    .then((data) => {
                        showLoading(false)
                        showMessage('资源保存成功')
                        if (data.id) {
                            this.resourceForm = { ...this.resourceForm, ...data }
                        }
                        this.reloadResources()
                    })
                    .catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
            })
        }
    }
}
</script>

