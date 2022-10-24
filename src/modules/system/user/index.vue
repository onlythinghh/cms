<template>
    <div>
        <TableRow :has-form="true" :has-header="true" :has-pagination="true">
            <template v-slot:form>
                <el-row :gutter="10">
                    <el-form ref="searchForm" label-width="80px" :model="searchForm">
                        <el-col :span="8">
                            <el-form-item label="登录账号" prop="account">
                                <el-input
                                    v-model="searchForm.account"
                                    placeholder="登录账号"
                                    maxlength="50"
                                    clearable
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="用户名" prop="username">
                                <el-input
                                    v-model="searchForm.username"
                                    placeholder="用户名"
                                    maxlength="50"
                                    clearable
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                                <el-button @click="resetSearchForm">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </template>
            <template v-slot:header-left>
                <el-button type="primary" icon="el-icon-plus" @click="editUser(true)">新增</el-button>
            </template>
            <!-- <template v-slot:header-right>wewew</template> -->
            <el-table :data="data" border stripe @row-click="onRowClick">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column property="account" label="登录账号"></el-table-column>
                <el-table-column property="username" label="用户名称"></el-table-column>
                <el-table-column property="locked" label="是否锁定" width="100px" align="center">
                    <template #default="{row}">
                        <el-tag :type="row.locked ? 'danger':'success'">{{ row.locked ? '锁定':'正常'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column property="enabled" label="是否可用" width="100px" align="center">
                    <template #default="{row}">
                        <el-tag
                            :type="row.enabled ? 'success':'danger'"
                        >{{ row.enabled ? '启用':'禁用'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column property="createTime" label="创建时间" width="200px" align="center">
                    <template v-slot="{row}">{{row.createTime | dateFormat}}</template>
                </el-table-column>
                <el-table-column label="操作" width="400px">
                    <template v-slot="{row}">
                        <div v-if="isNotCurrentLoginUser(row.account)">
                            <el-button
                                v-hasPermission="'user-edit'"
                                size="mini"
                                type="primary"
                                icon="el-icon-edit"
                                @click="editUser(false, row)"
                            >编辑</el-button>
                            <el-button
                                v-show="!row.admin"
                                size="mini"
                                :type="row.enabled ? 'warning':'success'"
                                :icon="row.enabled ? 'el-icon-close':'el-icon-check'"
                                @click="_enableUser({...row, enabled: !row.enabled})"
                            >{{ row.enabled ? '禁用':'启用' }}</el-button>

                            <el-button
                                v-show="!row.admin"
                                v-hasPermission="'user-del'"
                                size="mini"
                                type="danger"
                                icon="el-icon-delete"
                                @click="_deleteUser(row)"
                            >删除</el-button>
                            <el-dropdown
                                trigger="click"
                                size="medium"
                                style="margin-left:10px"
                                @command="handleMore"
                            >
                                <el-button type="primary" size="mini">
                                    更多
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                        v-hasPermission="'user-repwd'"
                                        :command="{method:'_resetPwd', userinfo: row}"
                                    >
                                        <i class="el-icon-unlock el-icon--left"></i>
                                        重置密码
                                    </el-dropdown-item>
                                    <el-dropdown-item
                                        v-hasPermission="'user-role'"
                                        :command="{method:'_assignRole', userinfo: row}"
                                    >
                                        <i class="el-icon-s-custom el-icon--left"></i>
                                        分配角色
                                    </el-dropdown-item>
                                    <el-dropdown-item :command="{method:'todata',userinfo:row}">
                                        <i class="el-icon-setting el-icon--left"></i>
                                        权限设置
                                    </el-dropdown-item>
                                    <el-dropdown-item
                                        v-show="row.locked"
                                        :command="{method:'_unlock', userinfo: row}"
                                    >
                                        <i class="el-icon-check el-icon--left"></i>
                                        解锁
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                        <div v-else>
                            <el-button
                                v-hasPermission="'user-role'"
                                size="mini"
                                type="primary"
                                icon="el-icon-s-custom"
                                @click="_assignRole(row)"
                            >分配角色</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <template #pagination>
                <Pagination
                    :current-page="page"
                    :page-size="limit"
                    :total="total"
                    @current-change="changePagination"
                ></Pagination>
                <!-- <el-pagination
                    layout="prev, pager, next"
                    background
                    hide-on-single-page
                    :current-page="page"
                    :page-size="limit"
                    :total="total"
                    @current-change="changePagination"
                ></el-pagination>-->
            </template>
        </TableRow>
        <!-- 用户编辑 -->
        <UserEdit :edit-info="edit" :close="_closeEditModel" />
        <!-- 用户编辑 -->

        <!-- 角色分配 -->
        <AssignRole :assign-role="assignRole" :reload="reload" :close="_closeAssignRoleModel" />
        <!-- 角色分配 -->

        <ResetModal v-bind="resetPwd" @close="closeEditModal"></ResetModal>
    </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import UserEdit from './edit.vue'
import ResetModal from './reset.vue'
import AssignRole from './assignRole.vue'
import { showLoading, showError, showMessage, confirm } from '../../../utils'
import { DEFAULT_PAGE_LIMIT } from '@/utils/Const'
export default {
    name: 'User',
    components: {
        UserEdit,
        AssignRole,
        ResetModal
    },
    data() {
        const searchForm = {
            account: '',
            username: '',
            page: 1,
            limit: DEFAULT_PAGE_LIMIT
        }
        return {
            searchForm,
            edit: {
                visiable: false,
                isAdd: false,
                userinfo: {},
                roles: []
            },
            resetPwd: {
                visiable: false,
                info: {}
            },
            assignRole: {
                visiable: false,
                roles: [],
                userRoles: [],
                account: '',
                id: 0,
                username: ''
            },
            userId: ''
        }
    },
    computed: {
        ...mapState('authen', {
            currentUser: 'userinfo'
        }),
        ...mapState('system/user', ['data', 'page', 'limit', 'total', 'orgid']),
        isNotCurrentLoginUser(state) {
            const currentUser = this.currentUser
            return account => {
                return currentUser.account !== account
            }
        }
    },
    watch: {
        orgid(newOrgid) {
            // 机构ID发生变化用户列表重新加载
            this.reload({ page: 1 })
        }
    },
    created() {
        this.search()
    },
    methods: {
        ...mapActions('system/user', [
            'searchList',
            'deleteUser',
            'enableUser',
            'unlock',
            'loadRoles',
        ]),
        ...mapMutations('system/user/org', ['saveuserOrg','org_type','saveTempEditOrg']),
        ...mapActions('system/role', ['loadRoles']),

        resetSearchForm() {
            this.$refs.searchForm.resetFields()
        },
        changePagination(currentPage) {
            this.searchForm.page = currentPage
            this.search()
        },
        _closeEditModel(needRelod) {
            this.edit = {
                visiable: false,
                isAdd: false,
                userinfo: {},
                roles: []
            }
            needRelod && this.reload()
        },
        _closeAssignRoleModel(needRelod) {
            this.assignRole = {
                visiable: false,
                roles: [],
                userRoles: [],
                account: '',
                id: 0,
                username: ''
            }
            needRelod && this.reload()
        },
        reload(searchForm) {
            searchForm &&
                (this.searchForm = { ...this.searchForm, ...searchForm })
            this.search()
        },
        _loadRoles() {
            showLoading(true, '正在加载必要资源')
            return this.loadRoles({}).then(roles => {
                showLoading(false)
                return Promise.resolve(roles)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
                return new Promise(() => { })
            })
        },
        search() {
            showLoading(true, '正在加载用户列表')
            this.searchList(this.searchForm)
                .then(() => {
                    showLoading(false)
                })
                .catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
        },
        editUser(isAdd, userinfo = {}) {
            this._loadRoles().then(roles => {
                this.edit = {
                    isAdd: isAdd,
                    visiable: true,
                    userinfo,
                    roles
                }
            })
        },
        closeEditModal(needReload) {
            this.resetPwd.visible = false
            needReload && this.reload()
        },
        _deleteUser(userinfo = {}) {
            if (!userinfo.id) {
                showError('用户信息获取失败, 无法删除')
                return
            }
            confirm(`此操作不可恢复, 确认删除用户 ${userinfo.username} ?`, '警告', {
                ok: () => {
                    const user = { id: userinfo.id, account: userinfo.account }
                    showLoading(true, `正在删除用户 ${userinfo.username}`)
                    this.deleteUser(user)
                        .then(() => {
                            showMessage('删除用户成功')
                            this.reload()
                            showLoading(false)
                        })
                        .catch(error => {
                            showLoading(false)
                            showError(error.message)
                        })
                }
            })
        },
        _enableUser(userinfo = {}) {
            if (!userinfo.id) {
                showError('用户信息获取失败, 无法进行该操作')
                return
            }
            const msg = `确认${userinfo.enabled ? '启用' : '禁用'}用户 ${userinfo.username} ?`
            confirm(msg, '警告', {
                ok: action => {
                    const user = {
                        id: userinfo.id,
                        account: userinfo.account,
                        enabled: userinfo.enabled,
                        locked: userinfo.locked
                    }
                    const loadingText = `正在${userinfo.enabled ? '启用' : '禁用'}用户 ${userinfo.username}`
                    showLoading(true, loadingText)
                    this.enableUser(user)
                        .then(() => {
                            const successTips = `${userinfo.enabled ? '启用' : '禁用'} 用户成功`
                            showMessage(successTips)
                            this.reload()
                            showLoading(false)
                        })
                        .catch(error => {
                            showLoading(false)
                            showError(error.message)
                        })
                }
            })
        },
        handleMore({ method = () => { }, userinfo }) {
            this[method] && this[method](userinfo)
        },
        _resetPwd(userinfo = {}) {
            if (!userinfo.id) {
                showError('用户信息获取失败, 无法进行该操作')
                return
            }
            this.resetPwd.visible=true
            this.resetPwd.info = {...userinfo}
        },
        _assignRole(userinfo = {}) {
            // 分配角色
            if (!userinfo.id) {
                showError('用户信息获取失败, 无法进行该操作')
                return
            }
            this._loadRoles().then(roles => {
                this.assignRole = {
                    visiable: true,
                    roles: roles,
                    userRoles: userinfo.roles,
                    account: userinfo.account,
                    id: userinfo.id,
                    username: userinfo.username
                }
            })
        },
        _unlock(userinfo = {}) {
            showLoading(true, `正在解锁用户 ${userinfo.username}`)
            this.unlock({id:userinfo.id})
                .then((res) => {
                    if(res.success){
                        showLoading(false)
                        this.search()
                        showMessage('用户解锁成功')
                    }else{
                        showLoading(false)
                        showError(res.errMs||'用户解锁失败')
                    }
                })
                .catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
        },
        todata(row) {
            this.saveuserOrg(row)
            this.saveTempEditOrg(row)
            this.org_type('user')
            this.$router.push({name:"Jurisdiction"})
        },
        onRowClick(row) {
            this.userId = row.id
        }
    }
}
</script>
