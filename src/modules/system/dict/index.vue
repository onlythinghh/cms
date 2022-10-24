<template>
    <div>
        <el-card class="card-container">
            <el-row>
                <el-col :span="6" style="overflow: auto; padding-rhigt: 5px">
                    <el-tree
                        ref="dictTree"
                        node-key="id"
                        :default-expanded-keys="expandKeys"
                        :default-checked-keys="checkKeys"
                        :data="treeDatas"
                        show-checkbox
                        :check-strictly="true"
                        @node-click="dictTreeClick"
                        @check="dictTreeCheck"
                    ></el-tree>
                </el-col>
                <el-col :span="18">
                    <TableRow :has-header="true">
                        <template v-slot:header-left>
                            <el-button type="primary" icon="el-icon-plus" @click="_addDict">新增</el-button>
                        </template>
                        <el-table :data="list" border stripe row-key="id">
                            <el-table-column type="index" label=" " width="50"></el-table-column>
                            <el-table-column property="name" label="字典名称"></el-table-column>
                            <el-table-column property="code" label="字典编码"></el-table-column>
                            <el-table-column property="val" label="值"></el-table-column>
                            <el-table-column property="sort" label="排序"></el-table-column>
                            <el-table-column label="操作" min-width="150">
                                <template v-slot="{row}">
                                    <el-button
                                        icon="el-icon-edit"
                                        size="mini"
                                        type="primary"
                                        @click="_editDict(false, row)"
                                    >编辑</el-button>
                                    <el-button
                                        icon="el-icon-delete"
                                        size="mini"
                                        type="danger"
                                        @click="_delDict(row)"
                                    >删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </TableRow>
                </el-col>
            </el-row>
        </el-card>

        <Edit v-bind="{...edit}" :close="closeEdit"/>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { showLoading, showError, showMessage, confirm } from '../../../utils'
import { isEmpty } from '../../../utils/BaseUtil'
import Edit from './edit.vue'
export default {
    name: 'Dictionary',
    components: {
        Edit
    },
    data() {
        return {
            edit: {
                visible: false,
                isAdd: false,
                info: {}
            },
            checkKeys: [0],
            expandKeys: [0],
            parent: {}
        }
    },
    computed: {
        ...mapGetters('system/dict', ['treeDatas']),
        list() {
            const data = (this.parent.children || []).map(dict => this.filter(dict)).sort((prev, next) => prev.sort - next.sort)
            return data
        }
    },
    created() {
        this.reloadDict().then(() => {
            const treeDatas = this.treeDatas || []
            if (treeDatas.length > 0) {
                this.setDictCheck(treeDatas[0], [treeDatas[0].id])
            }
        })
    },

    methods: {
        ...mapActions('system/dict', ['loadDictData', 'deleteDict']),

        filter({ children, label, ...dict }) {
            // 过滤不必要的字典属性
            return dict
        },

        dictTreeClick(data) {
            // 树点击事件
            this.setDictCheck(data, [data.id])
        },
        dictTreeCheck(data) {
            // 树选中事件
            this.setDictCheck(data, [data.id])
        },
        setDictCheck(data, checkKeys) {
            // 直接设置父级字典，查找列表数据
            this.parent = data
            this.$refs.dictTree && this.$refs.dictTree.setCheckedKeys(checkKeys)
        },
        reloadDict() {
            showLoading(true, '正在加载资源')
            return this.loadDictData().then((dicts = []) => {
                showLoading(false)
                return Promise.resolve(dicts)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
                return Promise.reject(error)
            })
        },
        closeEdit(needReload) {
            const currentDict = { ...this.edit.info }
            this.edit = {
                visible: false,
                info: {},
                isAdd: true
            }
            needReload && this.reloadDict().then(() => {
                // 设置父级字典，计算列表数据
                this.setParent(currentDict)
            })
        },
        findParent(currentDict, dicts = []) {
            // 根据当前数据字典，查找父级字典
            let parent = {}
            dicts.some(dict => {
                if (dict.id === currentDict.pid) {
                    parent = { ...dict }
                    return true
                }
                if (dict.children && dict.children.length > 0) {
                    parent = this.findParent(currentDict, dict.children)
                }
                if (!isEmpty(parent)) {
                    // 如果不为空就不用继续查找
                    return true
                }
                return false
            })
            return parent
        },
        setParent(currentDict) {
            // 设置父级字典，计算列表数据
            const treeDatas = this.treeDatas
            if (isEmpty(currentDict)) {
                this.parent = treeDatas[0]
            } else {
                const parent = this.findParent(currentDict, treeDatas)
                this.parent = parent
            }
        },
        _addDict() {
            this._editDict(true, { pid: this.parent.id ? this.parent.id : 0 })
        },
        _editDict(isAdd, dict) {
            this.edit.visible = true
            this.edit.isAdd = !!isAdd
            this.edit.info = dict || {}
        },
        _delDict(dict) {
            const { id, name } = dict

            confirm(`此操作不可恢复, 确认删除 ${name} 吗?`, '警告', {
                ok: () => {
                    showLoading(true, `正在删除 ${name} `)
                    this.deleteDict({ id }).then(() => {
                        showLoading(false)
                        showMessage('删除成功')
                        this.reloadDict().then(() => {
                            // 设置父级字典，计算列表数据
                            this.setParent(dict)
                        })
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
<style lang="scss" scoped>
/deep/
.el-tree{
    >.el-tree-node{
        min-width:100%;
        display: inline-block;
    }
}
/deep/.el-tree-node__label {
    padding-right: 10px
}
</style>

