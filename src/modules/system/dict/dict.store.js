import Request from '../../../request'
import { deepCopy } from '../../../utils/BaseUtil'
const DICT_TREE_DATA = 'DICT_TREE_DATA'
const CLEAR_TREE_DATA = 'CLEAR_TREE_DATA'

const computedTreeData = (dicts = []) => {
    if (!dicts || dicts.length === 0) {
        return
    }
    dicts.forEach(dict => {
        dict.label = dict.name
        if (dict.children && dict.children.length > 0) {
            computedTreeData(dict.children)
        }
    })
}
const state = {
    dicts: []
}
const getters = {
    treeDatas(state) {
        const dicts = state.dicts || []
        const root = {
            id: 0,
            label: '数据字典',
            disabled: true
        }
        const _dicts = deepCopy(dicts)
        computedTreeData(_dicts)
        root.children = _dicts
        return [root]
    }
}
const mutations = {
    [DICT_TREE_DATA](state, dicts = []) {
        state.dicts = dicts
    },
    [CLEAR_TREE_DATA](state, dicts = []) {
        state.dicts = []
    }
}
const actions = {
    loadDictData({ commit, state }) {
        return Request.post('/dict/tree').then(response => {
            const rest = response.data
            if (rest.success) {
                commit(DICT_TREE_DATA, rest.data)
                return Promise.resolve(rest.data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
    saveDict({ commit }, dict) {
        return Request.post('/dict/save', dict).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve('成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
    deleteDict({ commit }, { id }) {
        return Request.post('/dict/del', { id }).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve('成功')
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
