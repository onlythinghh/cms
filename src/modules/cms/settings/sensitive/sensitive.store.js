import Request from '@/request'
const SENSITIVEWORD_LIST='SENSITIVEWORD_LIST'
const TYPE_LIST='TYPE_LIST'
const state = {
    data: [],
    typeList:[]
}

const getters = {

}
const mutations = {
    [SENSITIVEWORD_LIST](state, { data, page, limit, total }) {
        state.data = data
    },
    [TYPE_LIST](state, { data, page, limit, total }) {
        state.typeList = data
    },

}
const actions = {
    getSensitiveWordList({ commit, state }, sensitiveWordListParams = { page: 1, limit: 10 }) {
        return Request.post('/cms/sensitiveword/list', sensitiveWordListParams).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(SENSITIVEWORD_LIST, { data: rest.data})
                return Promise.resolve({ data: rest.data, count: rest.count })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    classify({ commit}, type ) {
        return Request.post('/cms/category/list', type).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(TYPE_LIST, { data: rest.data})
                return Promise.resolve({ data: rest.data})
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    // 删除
    deleteSensitiveWord({ commit }, { id }) {
        return Request.post('/cms/sensitiveword/del', { id }).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve('delete success')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    // 保存
    saveSensitiveWord({ commit }, hotWord) {
        return Request.post('/cms/sensitiveword/save', hotWord).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve('update success')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    
    
}


export default {
    state,
    getters,
    mutations,
    actions
}
