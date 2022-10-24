import Request from '../../../request'
import { deepCopy } from '../../../utils/BaseUtil'
const LOAD_PERMS = 'LOAD_PERMS'
const CLEAR_PERMS = 'CLEAR_PERMS'

const getTreePerms = (perms = []) => {
    const tree = []
    perms.forEach((perm, index) => {
        let children = []
        if (perm.children && perm.children.length > 0) {
            children = getTreePerms(perm.children)
        }
        tree[index] = { label: perm.name, ...perm, children }
    })
    return tree
}

const _normalizePerms = (perms = [], normalizePerms) => {
    perms.forEach(perm => {
        normalizePerms.push(_normalizePerm(perm))
        if (perm.children && perm.children.length > 0) {
            _normalizePerms(perm.children, normalizePerms)
        }
    })
}
const _normalizePerm = ({ children, ...perm }) => {
    return perm
}

const state = {
    perms: []
}
const getters = {
    treePerms(state) {
        const perms = state.perms
        return getTreePerms(perms)
    },
    normalizePagePerms(state, getters) {
        const perms = deepCopy(getters.normalizePerms)
        // 页面
        const pagePerms = perms.filter(perm => {
            return perm.type === 1
        })
        return pagePerms
    },
    normalizePerms(state) {
        const perms = state.perms
        const normalizePerms = []
        _normalizePerms(perms, normalizePerms)
        return normalizePerms
    },
    emptyResourcePermIds(state, getters) {
        // 为关联资源的权限Id
        const perms = deepCopy(getters.normalizePerms)
        const emptyResourcePermIds = []
        perms.forEach(perm => {
            if (!perm.rid) {
                emptyResourcePermIds.push(perm.id)
            }
        })
        return emptyResourcePermIds
    }
}
const mutations = {
    [LOAD_PERMS](state, perms) {
        state.perms = perms
    },
    [CLEAR_PERMS](state) {
        state.perms = []
    }
}
const actions = {
    loadPerms({ commit, state }, perm = {}) {
        const perms = state.perms
        if (perms && perms.length > 0) {
            return Promise.resolve(perms)
        }
        return Request.post('/perm/tree', perm).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(LOAD_PERMS, rest.data)
                return Promise.resolve(rest.data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(error.message || '服务器出现异常')
        })
    },
    savePerm({ commit }, { resource, ...perm }) {
        return Request.post('/perm/save', perm).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(CLEAR_PERMS)
                return Promise.resolve('成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    delPerm({ commit }, ids) {
        return Request.post('/perm/del', { id: ids.join(',') }).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(CLEAR_PERMS)
                return Promise.resolve('删除成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    }
}
export default {
    state,
    getters,
    mutations,
    actions
}
