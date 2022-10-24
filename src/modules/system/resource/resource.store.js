import Request from '../../../request'

const LOAD_RESOURCES = 'LOAD_RESOURCES'
const CLEAR_RESOURCE = 'CLEAR_RESOURCE'


const _normalizeResources = function (children, resources) {
    children.forEach(resource => {
        const _children = resource.children
        // 使用副本
        resources.push({ ..._normalizeResource(resource) })
        if (_children && _children.length > 0) {
            _normalizeResources(_children, resources)
        }
    })
}
const _normalizeResource = function ({ children, ...resource }) {
    return resource
}

const getTreeResources = (resources = [], level = 1) => {
    const treeResources = []
    resources.forEach(resource => {
        const _resource = { ...resource, level, label: resource.name, children: [] }
        const children = resource.children
        if (children && children.length > 0) {
            _resource.children = getTreeResources(children, level + 1)
        }
        treeResources.push(_resource)
    })
    return treeResources
}
const state = {
    resources: [],
    resourceType: {
        // TODO 后台接口数据字典提供
        1: '页面',
        2: '元素',
        3: '接口'
    }
}
const getters = {
    normalizeResources(state) {
        const resources = state.resources || []
        const _resources = []
        _normalizeResources(resources, _resources)
        return _resources
    },
    treeResources(state) {
        const resources = state.resources
        return getTreeResources(resources, 1)
    }
}
const mutations = {
    [LOAD_RESOURCES](state, resources = []) {
        state.resources = resources
    },
    [CLEAR_RESOURCE](state) {
        state.resources = []
    }
}
const actions = {
    loadResources({ commit, state }, resource) {
        const resources = state.resources
        if (resources && resources.length > 0) {
            // 无需重复请求
            return Promise.resolve(resources)
        }
        return Request.post('/resource/tree', resource).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(LOAD_RESOURCES, rest.data)
                return Promise.resolve(rest.data)
            }
            return Promise.reject(rest.errMsg)
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    saveResource({ commit }, resource) {
        return Request.post('/resource/save', resource).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(CLEAR_RESOURCE, rest.data)
                return Promise.resolve(rest.data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    delResource({ commit }, resource) {
        return Request.post('/resource/del', { id: resource.id }).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(CLEAR_RESOURCE, rest.data)
                return Promise.resolve(rest.data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    enableResource({ commit }, resource) {
        return Request.post('/resource/enable', { id: resource.id }).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(CLEAR_RESOURCE, rest.data)
                return Promise.resolve(rest.data)
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
