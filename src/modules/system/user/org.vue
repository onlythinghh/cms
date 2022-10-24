<template>
    <div @click.capture="containerEvent">
        <el-card class="card-container">
            <el-row>
                <el-col :span="6">
                    <div class="card-left-header">
                        <span>组织机构</span>
                    </div>
                    <div class="card-left-body">
                        <el-alert type="success" class="tree-opt-tips">
                            <template v-slot>
                                <div>1、右键可对机构进行编辑、删除、添加子机构</div>
                                <div>2、若存在下级组织则当前组织不可直接删除</div>
                            </template>
                        </el-alert>
                        <el-tree
                            ref="orgTree"
                            node-key="id"
                            label="shortName"
                            :default-expand-all="true"
                            :data="trees"
                            :check-on-click-node="true"
                            show-checkbox
                            :check-strictly="true"
                            @check="orgCheck"
                            @node-contextmenu="treeContextmenu"
                            @node-click="orgClick"
                        >
                            <template v-slot="{data}">
                                <el-popover
                                    :ref="'popover'+data.id"
                                    v-model="contextmenu[data.id]"
                                    trigger="manual"
                                    width="150"
                                    popper-class="tree-popover"
                                    class="right-popover"
                                >
                                    <ul class="right-menu">
                                        <li
                                            v-if="(!data.children || data.children.length === 0) && data.id !==1"
                                            @click="_delOrg(data)"
                                        >
                                            <i class="el-icon-remove-outline"></i> 删除组织
                                        </li>
                                        <li v-if="data.level < 5" @click="_addOrg(data)">
                                            <i class="el-icon-circle-plus-outline"></i> 添加组织
                                        </li>
                                        <li @click="_editOrg(data)">
                                            <i class="el-icon-edit-outline"></i> 编辑组织
                                        </li>
                                        <li @click="_power(data)">
                                            <i class="el-icon-setting"></i> 权限设置
                                        </li>
                                    </ul>
                                    <div slot="reference">{{data.shortName}}</div>
                                </el-popover>
                            </template>
                        </el-tree>
                    </div>
                </el-col>
                <el-col :span="18">
                    <transition name="fade-transform" mode="out-in">
                        <router-view />
                    </transition>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<style lang="scss">
.right-popover,
.right-popover .el-popover,
.right-popover,
ul.right-menu,
ul.right-menu > li {
    padding: 0;
    margin: 0;
    list-style-type: none;
    cursor: pointer;
}
.right-popover {
    font-size: 14px;
    flex-grow: 1;
    &:focus {
        outline: none;
    }
    .el-popover__reference:focus,
    .el-popover__reference:hover {
        outline: none;
    }
}
ul.right-menu {
    padding: 7px 0;
    & > li {
        padding: 7px 10px 7px 15px;
        &:hover {
            background-color: #e8f4ff;
            color: #46a6ff;
        }
    }
}
.tree-popover {
    padding: 0 !important;
}
</style>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { showLoading, showError, confirm } from '../../../utils';
export default {
    name: 'Organization',
    data() {
        return {
            contextmenu: {

            }
        }
    },
    computed: {
        ...mapState('system/user/org', ['trees', 'rootId'])
    },
    created() {
        this.reloadTree()
    },
    methods: {
        ...mapMutations('system/user', ['setOrgid']),
        ...mapMutations('system/user/org', ['saveTempEditOrg','org_type']),
        ...mapActions('system/user/org', ['loadOrgTree', 'loadOrgUser', 'delOrg', 'saveOrg']),
        reloadTree() {
            showLoading(true, '正在加载机构')
            this.loadOrgTree().then(() => {
                showLoading(false)
            }).catch(error => {
                showLoading(false)
                showError(error.message)
            })
        },
        orgClick(data) {
            this.setOrgid(data.id)
            this.__toUserRoute()
        },
        orgCheck(data, { checkedKeys }) {
            this.$refs.orgTree.setCheckedKeys([data.id])
        },
        setOrgCheck(data) {
            this.$refs.orgTree.setCheckedKeys([data.id])
        },
        hideContextmenu() {
            Object.keys(this.contextmenu).forEach(id => {
                this.contextmenu[id] = false
            })
        },
        treeContextmenu(event, data, node, tree) {
            event.stopPropagation()
            this.hideContextmenu()
            this.contextmenu[data.id] = true
            this.setOrgCheck(data)
        },
        containerEvent() {
            this.hideContextmenu()
        },
        __toUserRoute() {
            this.$router.push('/system/user')
        },
        __toOrgRoute() {
            this.$router.push('/system/user/org')
        },
        // 编辑/新增时候加载用户列表
        __loadOrgUser(orgid) {
            showLoading(true, '正在加载用户列表')
            return this.loadOrgUser({ orgid, isFirst: true }).then(() => {
                showLoading(false)
                return Promise.resolve('')
            }).catch(error => {
                showLoading(false)
                showError(error.message)
                return Promise.resolve('')
            })
        },
        _delOrg(data) {
            this.hideContextmenu()
            confirm('当前组织删除，所属人员将会被释放，确认删除吗?', '警告', {
                ok: () => {
                    showLoading(true, '正在删除机构')
                    this.delOrg(data).then(() => {
                        showLoading(false)
                        // 展示上层机构的的人员信息
                        this.setOrgid(data.pid)
                        // 跳转到列表页
                        this.__toUserRoute()
                    }).catch(error => {
                        showLoading(false)
                        showError(error.message)
                    })
                }
            })
        },
        _addOrg(data) {
            this._editOrg({ id: '', pid: data.id })
        },
        _power(data){
            this.saveTempEditOrg(data)
            this.org_type('org')
            this.hideContextmenu()
            if(this.$route.name!=='Jurisdiction'){
                this.$router.push({name:"Jurisdiction"})
            }
        },
        _editOrg(data) {
            this.hideContextmenu()
            // 设置临时机构信息
            this.saveTempEditOrg(data)
            if (data.id === this.rootId) {
                // 总公司的组织不需要加载用户
                if(this.$route.path!=='/system/user/org'){
                    this.$router.push('/system/user/org')
                }
            } else {
                this.__loadOrgUser(data.id).then(() => {
                    if(this.$route.path!=='/system/user/org'){
                        this.$router.push('/system/user/org')
                    }
                })
            }
        }
    },
}
</script>

