<template>
    <div>
        <el-form ref="orgForm" label-width="100px" :model="orgForm" :rules="orgFormRules">
            <el-row>
                <el-form-item>
                    <el-col>
                        <div v-if="!isAdd">
                            <h3>
                                编辑组织 【{{editOrg.shortName}}】
                                <el-tag>ID: {{editOrg.id}}</el-tag>
                            </h3>
                        </div>
                        <div v-else>
                            <h3>新增组织</h3>
                        </div>
                    </el-col>
                </el-form-item>
                <el-form-item label="组织简称" prop="shortName">
                    <el-col :span="18">
                        <el-input v-model="orgForm.shortName" placeholder="组织简称" maxlength="20" />
                    </el-col>
                </el-form-item>
                <el-form-item label="组织全称" prop="fullName">
                    <el-col :span="18">
                        <el-input v-model="orgForm.fullName" placeholder="组织全称" maxlength="50" />
                    </el-col>
                </el-form-item>
                <el-form-item v-if="!isRoot" label="父级组织" prop="pid">
                    <el-col :span="18">
                        <el-select v-model="orgForm.pid" class="w100" placeholder="父级组织">
                            <el-option value>请选择</el-option>
                            <el-option
                                v-for="(org, index) in orgOptions"
                                :key="index"
                                :value="org.id"
                                :label="org.shortName"
                            >{{org.shortName}}</el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="描述" prop="descript">
                    <el-col :span="18">
                        <el-input
                            v-model="orgForm.descript"
                            type="textarea"
                            placeholder="描述"
                            rows="3"
                            maxlength="200"
                        />
                    </el-col>
                </el-form-item>
                <hr v-if="!isRoot" class="org-hr" />
                <el-form-item v-if="!isRoot" label="选择用户">
                    <el-col>
                        <el-form :inline="true" class="users-form">
                            <el-form-item v-if="hasCheckAll">
                                <el-checkbox
                                    v-model="checkAll"
                                    :indeterminate="isIndeterminate"
                                    @change="checkAllUsers"
                                >全选</el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-input
                                    v-model="username"
                                    size="small"
                                    placeholder="用户名"
                                    maxlength="50"
                                />
                            </el-form-item>
                            <el-form-item>
                                <el-input
                                    v-model="account"
                                    size="small"
                                    placeholder="登录账号"
                                    maxlength="50"
                                />
                            </el-form-item>
                            <el-form-item>
                                <el-button size="small" type="primary" @click="_filterUsers">查询</el-button>
                            </el-form-item>
                        </el-form>
                        <el-form-item>
                            <el-checkbox-group v-model="uids" @change="checkUser">
                                <el-checkbox
                                    v-for="(user, index) in users"
                                    :key="index"
                                    :label="user.id"
                                >{{user.name}}</el-checkbox>
                            </el-checkbox-group>
                            <span v-if="hasMoreUsers" class="org-user-more" @click="moreUsers">
                                更多
                                <i v-if="moreLoading" class="el-icon-loading"></i>
                            </span>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="_save">保存</el-button>
                    <el-button @click="_goBack">返回</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </div>
</template>
<style lang="scss">
.org-hr {
    margin: 10px 0;
}
.users-form {
    margin-bottom: 10px;
}
.org-user-more:hover {
    cursor: pointer;
    color: #1890ff;
}
</style>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { showLoading, showError,showMessage } from '../../../../utils';
import { matchName } from '../../../../utils/RegExpUtil';
export default {
    name: 'EditOrg',
    data() {
        const orgForm = {
            id: null,
            pid: '',
            fullName: '',
            shortName: '',
            uids: [],
            descript: ''
        }
        const orgFormRules = {
            pid: [
                { required: true, message: '请选择父级组织' }
            ],
            fullName: [
                { required: true, message: '组织全称不能为空' },
                {
                    validator: (rule, value, callback) => {
                        if (!matchName(value)) {
                            callback('组织全称只允许中文、数字、字母、下划线、横线、空格；两边不能有空格和横线')
                        } else {
                            callback()
                        }
                    }
                }
            ],
            shortName: [
                { required: true, message: '组织简称不能为空' },
                { max: 20, message: '组织简称不能超过8个字符' },
                {
                    validator: (rule, value, callback) => {
                        if (!matchName(value)) {
                            callback('组织简称只允许中文、数字、字母、下划线、横线、空格；两边不能有空格和横线')
                        } else {
                            callback()
                        }
                    }
                }
            ],
        }
        return {
            orgForm,
            orgFormRules,
            // 已选择的用户id
            uids: [],
            // 用户列表
            users: [],
            // 用户列表分页
            userPage: {
                count: 0,
                page: 1,
                limit: 100
            },
            // 用户过滤条件
            account: '',
            username: '',
            // 全选按钮的半选状态
            isIndeterminate: false,
            // 是否全选
            checkAll: false,
            isUserListFirstLoaded: false,
            // 更多加载指示器
            moreLoading: false
        }
    },
    computed: {
        ...mapState('system/user/org', ['editOrg', 'orgUser', 'rootId']),
        ...mapGetters('system/user/org', ['normailzeOrgs']),
        isAdd() {
            return !this.editOrg.id
        },
        hasMoreUsers() {
            return this.users.length < this.userPage.count
        },
        orgOptions() {
            const id = this.editOrg.id
            return this.normailzeOrgs(id)

        },
        isRoot() {
            // 是否时总公司
            return this.editOrg.id === this.rootId
        },
        hasCheckAll() {
            return this.users && this.users.length > 0
        }
    },
    watch: {
        editOrg(newOrg) {
            this.orgForm = { ...newOrg }
        },
        orgUser(newOrgUser) {
            this.uids = [...newOrgUser.ids]
            this.users = [...newOrgUser.users]
            this.userPage = { ...newOrgUser.userPage }
            this.setCheckAll(this.uids.length)
        }
    },
    created() {
        this.orgForm = { ...this.editOrg }
        this.uids = [...this.orgUser.ids]
        this.users = [...this.orgUser.users]
        this.userPage = { ...this.orgUser.userPage }
        if (!this.isRoot && !this.orgUser.isFirstLoaded) {
            // 直接在当前页面的刷新操作
            this.reloadOrgUsers({ isFirst: true })
        } else {
            this.setCheckAll(this.uids.length)
        }
    },
    methods: {
        ...mapActions('system/user/org', ['loadOrgUser', 'saveOrg']),
        reloadOrgUsers(params) {
            const orgid = this.editOrg.id || null
            const account = this.account
            const username = this.username
            const page = this.userPage.page
            this.moreLoading = true
            this.loadOrgUser({ orgid, account, username, page, ...params }).then(() => {
                this.moreLoading = false
            }).catch(error => {
                this.moreLoading = false
                showError(error.message)
            })
        },
        // 更多
        moreUsers() {
            this.reloadOrgUsers({ isFirst: false })
        },
        checkAllUsers(val) {
            // 全选/全不选
            if (val) {
                const users = this.orgUser.users
                const ids = users.map(u => u.id)
                this.uids = ids
            } else {
                this.uids = []
            }
            this.isIndeterminate = false
        },
        checkUser(val) {
            // 全选框的处理
            const checkedCount = val.length
            this.setCheckAll(checkedCount)
        },
        setCheckAll(checkedCount) {
            this.checkAll = checkedCount === this.users.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.users.length
        },
        // 过滤用户信息
        _filterUsers() {
            // 重置数据
            this.uids = []
            this.userPage.page = 1
            this.userPage.count = 0
            this.reloadOrgUsers({ isFirst: true })
        },
        _goBack() {
            this.$router.back()
        },
        _save() {
            this.$refs.orgForm.validate(valid => {
                if (!valid) {
                    return false
                }
                const orgForm = this.orgForm
                const uids = this.uids || []
                const org = { ...orgForm, uids: uids.join(',') }
                showLoading(true, '保存组织信息')
                this.saveOrg(org).then(msg =>{
                    showMessage(msg)
                    showLoading(false)
                }).catch(error => {
                    showLoading(false)
                    showError(error.message)
                })
            })
        }
    }
}
</script>

