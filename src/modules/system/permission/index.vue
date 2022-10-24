<template>
    <div>
        <TableRow :has-header="true">
            <template v-slot:header-left>
                <el-radio-group v-model="permissionDisplayType" size="small">
                    <el-radio-button label>全部</el-radio-button>
                    <el-radio-button
                        v-for="(val, key) in resourceType"
                        :key="key"
                        :label="key"
                    >{{val}}</el-radio-button>
                </el-radio-group>
                <el-tooltip content="过滤资源" placement="right">
                    <i class="el-icon-question"></i>
                </el-tooltip>
            </template>
            <template v-slot:header-right>
                <el-button size="small" type="primary" @click="_editPerm({}, true, $event)">
                    <i class="el-icon-plus"></i> 新增权限
                </el-button>
                <el-button
                    v-if="emptyResourcePermIds.length > 0"
                    size="small"
                    type="warning"
                    @click="clearPerms"
                >
                    清理无效权限
                    <el-tooltip content="无效权限指没有和资源产生关联的数据" placement="right">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </el-button>
            </template>
            <el-table
                ref="permTable"
                row-key="id"
                :border="true"
                highlight-current-row
                stripe
                :data="filteredTreePerms"
                @row-click="expandRow"
            >
                <el-table-column prop="name" label="权限名称"></el-table-column>
                <el-table-column prop="code" label="权限编码"></el-table-column>
                <el-table-column prop="type" label="权限类型">
                    <template v-slot="{row}">
                        <el-tag :type="row.type | resourceTypeStyle">{{ resourceType[row.type] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="resource" label="资源名称">
                    <template v-slot="{row}">{{row.resource ? row.resource : 'N/A'}}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="{row}">
                        <el-button
                            size="mini"
                            type="primary"
                            @click="_editPerm(row, false, $event)"
                        >
                            <i class="el-icon-edit"></i> 编辑
                        </el-button>
                        <el-button size="mini" type="danger" @click="_delPerm(row, $event)">
                            <i class="el-icon-delete"></i> 删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </TableRow>
        <!-- 权限编辑 -->
        <Edit :edit-prop="editProp" :clear="clearEditInfo" :reload="reloadPermissions"/>
        <!-- 权限编辑 -->
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { showLoading, showError, showMessage, confirm } from '../../../utils'
import { deepCopy } from '../../../utils/BaseUtil'

import Edit from './edit.vue'
const typeStyles = {
    1: '',
    2: 'success',
    3: 'info'
}
export default {
    name: 'Permission',
    filters: {
        resourceTypeStyle: function (type) {
            return typeStyles[type]
        }
    },
    components: {
        Edit
    },
    data() {
        return {
            permissionDisplayType: '',
            isExpandAll: false,
            expandRows: [],
            editProp: {
                isAdd: true,
                visiable: false,
                perm: {}
            }
        }
    },
    computed: {
        ...mapGetters('system/permission', [
            'treePerms',
            'emptyResourcePermIds'
        ]),
        ...mapGetters('authen', ['getDictionary']),
        resourceType() {
            return this.getDictionary('resourceType')
        },
        // ...mapState('system/resource', ['resourceType']),
        resourceTypeFilters() {
            const resourceType = this.resourceType
            const filters = []
            for (let k in resourceType) {
                filters.push({ text: resourceType[k], value: k })
            }
            return filters
        },
        filteredTreePerms() {
            const treePerms = deepCopy(this.treePerms)
            const permissionDisplayType = Number(this.permissionDisplayType)
            if (!permissionDisplayType) {
                return treePerms
            }
            const filter = perms => {
                return perms.filter(perm => {
                    const type = perm.type
                    if (type === 1 || type === Number(permissionDisplayType)) {
                        const children = perm.children
                        if (children && children.length > 0) {
                            perm.children = filter(children)
                        }

                        return true
                    }
                    return false
                })
            }
            return filter(treePerms)
        }
    },
    created() {
        this.reloadPermissions()
    },

    methods: {
        ...mapActions('system/permission', ['loadPerms', 'delPerm']),
        reloadPermissions() {
            showLoading(true, '正在加载权限')
            this.loadPerms()
                .then(() => {
                    showLoading(false)
                })
                .catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
        },
        currentTableBody() {
            return this.$refs.permTable.bodyWrapper.querySelector('table')
        },
        // 获取父级元素
        closest(currentEl, selector) {
            let el = currentEl.parentNode
            const matchesSelector =
                el.matches ||
                el.webkitMatchesSelector ||
                el.mozMatchesSelector ||
                el.msMatchesSelector

            while (el) {
                if (matchesSelector.call(el, selector)) {
                    // return el;
                    break
                } else {
                    el = el.parentElement
                }
            }
            return el
        },
        // 展开行
        toggleExpand(currentRow) {
            const expandIcon = currentRow.querySelector(
                'td .el-table__expand-icon'
            )
            const event = new CustomEvent('click')
            expandIcon && expandIcon.dispatchEvent(event)
        },
        expandRow(row, column, event) {
            const currentRow = this.closest(event.target, 'tr')
            this.toggleExpand(currentRow)
        },
        stopPropagation(event) {
            event.stopPropagation()
        },
        clearEditInfo() {
            this.editProp = {
                isAdd: true,
                visiable: false,
                perm: {}
            }
        },
        _editPerm({ children, label, ...perm }, isAdd, event) {
            this.stopPropagation(event)
            this.editProp = {
                isAdd: !!isAdd,
                visiable: true,
                perm: perm
            }
        },
        clearPerms() {
            const ids = this.emptyResourcePermIds
            if (!ids || ids.length === 0) {
                showError('没有需要清理')
            }
            confirm('清理后无法恢复, 确认清理吗?', '警告', {
                callback: action => {
                    if (action === 'confirm') {
                        this.delPerms(ids)
                    }
                }
            })
        },
        _delPerm(row, event) {
            this.stopPropagation(event)
            confirm('若有子元素也将会被删除且不可恢复,确认删除吗?', '警告', {
                callback: action => {
                    if (action === 'confirm') {
                        this.delPerms([row.id])
                    }
                }
            })
        },
        delPerms(ids) {
            showLoading(true, '正在删除权限')
            this.delPerm(ids)
                .then(() => {
                    showLoading(false)
                    showMessage('权限删除成功')
                    this.reloadPermissions()
                })
                .catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/.el-table__header{
width: 100% !important;
}
/deep/ .el-table__body{
    width: 100% !important;
}
</style>
