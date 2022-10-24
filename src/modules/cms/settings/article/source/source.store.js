import Request from '@/request'

const SOURCES = 'SOURCES'
const state = {
    sources: []
}
const getters = {}
const mutations = {
    [SOURCES](state, sources) {
        state.sources = sources
    }
}
const actions = {
    loadSources({ commit }, { appid, name, page = 1, limit = 10 }) {
        return Request.post('/cms/source/list', { appid, name, page, limit }).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(SOURCES, rest.data)
                return Promise.resolve({ data: rest.data, count: rest.count })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
    saveSource({ commit }, source) {
        return Request.post('/cms/source/save', source).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve(rest)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
    deleteSource({ commit }, { id }) {
        return Request.post('/cms/source/del', { id }).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve(rest)
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
