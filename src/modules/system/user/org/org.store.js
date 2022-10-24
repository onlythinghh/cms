import Request from '@/request'
import { deepCopy } from '../../../../utils/BaseUtil'
const TREE = 'TREE'
const ORG_USRE = 'ORG_USER'
const SAVE_ORG = 'SAVE_ORG'
const DEL_ORG = 'DEL_ORG'
const SAVE_TEMP_EDIT_ORG = 'saveTempEditOrg'
const SAVE_TEMP_USER_ORG = 'saveuserOrg'
const ORG_TYPE = 'org_type'
const normailzeOrgs = (treeOrgs = [], targetOrgs = [], excludeOrgId = '') => {
    treeOrgs.forEach(({ children, ...org }) => {
        if (excludeOrgId && excludeOrgId === org.id) {
            return
        }
        targetOrgs.push({ ...org })
        if (children && children.length > 0) {
            normailzeOrgs(children, targetOrgs, excludeOrgId)
        }
    })
}
const addLevel = (trees, level = 1) => {
    return trees.map(node => {
        node.level = level
        if (node.children && node.children.length > 0) {
            addLevel(node.children, level + 1)
        }
        return node
    })
}
const state = {
    trees: [],
    // 编辑时候的用户信息
    orgUser: {
        ids: [],
        users: [],
        userPage: {
            count: 0,
            page: 1,
            limit: 100
        },
        // 第一次是否加载过
        isFirstLoaded: false
    },
    // 编辑时的临时机构信息
    orgType:'',
    editOrg: {

    },
    // 用户的临时信息
    editUser: {

    },
    // 最上级的组织的Id
    rootId: 1
}
const getters = {
    normailzeOrgs(state) {
        const treeOrgs = state.trees
        return excludeOrgId => {
            const orgs = []
            normailzeOrgs(treeOrgs, orgs, excludeOrgId)
            return orgs
        }
    }
}
const mutations = {
    [TREE](state, trees = []) {
        if (trees.length > 0) {
            trees = addLevel(trees, 1)
        }
        state.trees = trees
    },
    [ORG_USRE](state, { ids = [], users = [], page = 1, limit = 100, count = 0, isFirst = true }) {
        if (isFirst) {
            state.orgUser = {
                isFirstLoaded: true,
                ids,
                users,
                userPage: {
                    count,
                    page,
                    limit
                }
            }
        } else {
            state.orgUser = {
                isFirstLoaded: true,
                users: [...state.orgUser.users, ...users],
                ids: [...ids],
                userPage: {
                    ...state.orgUser.userPage,
                    count: count
                }
            }
        }
    },
    [SAVE_ORG](state, org) {

        const trees = deepCopy(state.trees)
        const curPid = org.pid
        const curId = org.id
        // 当前组织的下标
        let currentOrgIndex = -1
        // 当前组织的父级组织
        let parentOrg = {}
        //若是修改则记录原始的父级Id
        let originPid = 0
        // 若是修改则记录原始的机构信息
        let originOrg = null
        // 找到父级机构
        const findParentOrg = (orgs, pid) => {
            return orgs.some(_org => {
                if (_org.id === pid) {
                    parentOrg = _org
                    return true
                }
                if (_org.children && _org.children.length > 0) {
                    return findParentOrg(_org.children, pid)
                }
                return false
            })
        }
        // 找当前机构，存在说明时修改，不存在说明时新增
        const findCurrentOrgIndex = (trees, id) => {
            return trees.some((_org, index) => {
                if (_org.id === id) {
                    currentOrgIndex = index
                    originPid = _org.pid
                    originOrg = _org
                    return true
                }
                if (_org.children && _org.children.length > 0) {
                    return findCurrentOrgIndex(_org.children, id)
                }
                return false
            })
        }

        if (curId === state.rootId) {
            // 顶级组织
            trees[0] = { ...trees[0], ...org }
        } else {
            // 获取当前组织在某个父级组织下的下标
            findCurrentOrgIndex(trees, curId)
            if (currentOrgIndex > -1) {
                // 修改
                findParentOrg(trees, originPid)
                if (curPid === originPid) {
                    // 父级组织未发生改变, 直接替换数据
                    if (originOrg && originOrg.children && originOrg.children.length > 0) {
                        org.children = originOrg.children
                    }
                    parentOrg.children.splice(currentOrgIndex, 1, { ...org })
                } else {
                    // 从原始的父级中删除该组织
                    parentOrg.children.splice(currentOrgIndex, 1)
                    // 将当前的组织添加到新的父级组织下面
                    findParentOrg(trees, curPid)
                    // 直接添加到最后
                    if (originOrg && originOrg.children && originOrg.children.length > 0) {
                        org.children = originOrg.children
                    }
                    parentOrg.children = [...(parentOrg.children || []), org]
                }
            } else {
                // 新增
                findParentOrg(trees, curPid)
                // 直接添加到最后
                if (originOrg && originOrg.children && originOrg.children.length > 0) {
                    org.children = originOrg.children
                }
                parentOrg.children = [...(parentOrg.children || []), org]
            }
        }
        state.trees = trees
    },
    [DEL_ORG](state, { id, pid }) {
        const trees = state.trees
        let parentOrg = {}
        // 找到父级机构
        const findParentOrg = (orgs) => {
            return orgs.some(_org => {
                if (_org.id === pid) {
                    parentOrg = _org
                    return true
                }
                if (_org.children && _org.children.length > 0) {
                    return findParentOrg(_org.children)
                }
                return false
            })
        }
        findParentOrg(trees)
        let currentIndex = -1
        // 找到当前组织所在的下标
        if (parentOrg.children && parentOrg.children.length > 0) {
            parentOrg.children.some((_org, index) => {
                if (_org.id === id) {
                    currentIndex = index
                    return true
                }
                return false
            })
        }
        if (currentIndex > -1) {
            // 删除
            parentOrg.children.splice(currentIndex, 1)
        }
    },
    [SAVE_TEMP_EDIT_ORG](state, org = {}) {
        state.editOrg = org
    },
    [SAVE_TEMP_USER_ORG](state, org = {}) {
        state.editUser = org
    },
    [ORG_TYPE](state, org = ''){
        state.orgType = org
    }
}

const actions = {
    /**
     * 加载机构树
     */
    loadOrgTree({ commit }) {
        return Request.post('/org/tree').then(response => {
            const rest = response.data
            if (rest.success) {
                commit(TREE, rest.data)
                return Promise.resolve('树加载成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
    /**
     * 加载机构用户包含未分配组织的用户
     */
    loadOrgUser({ commit }, { page = 1, limit = 100, account = '', username = '', orgid = '', isFirst = true }) {
        if (isFirst) {
            // 清空历史数据
            commit(ORG_USRE, { ids: [], users: [], page, limit, count: 0, isFirst })
        }
        return Request.post('/org/user', { page, limit, account, username, orgid }).then(response => {
            const rest = response.data
            if (rest.success) {
                let ids = []
                if (orgid) {
                    ids = rest.data.ids || []
                }
                commit(ORG_USRE, { ids: ids, users: rest.data.users, page, limit, count: rest.count, isFirst })
                return Promise.resolve('成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
    saveOrg({ commit }, org) {
        return Request.post('/org/save', org).then(response => {
            const rest = response.data
            if (rest.success) {
                // 保存组织
                commit(SAVE_ORG, rest.data)
                // 设置临时组织信息
                commit(SAVE_TEMP_EDIT_ORG, rest.data)
                return Promise.resolve('保存成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
    delOrg({ commit }, org) {
        return Request.post('/org/del', { id: org.id }).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(DEL_ORG, org)
                return Promise.resolve('删除成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    }

}


export default {
    state,
    getters,
    mutations,
    actions
}
