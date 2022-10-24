import Request from '@/request'
const RECYCLE_SITES = 'RECYCLE_SITES'
const CLEAR_RECYCLE_SITES = 'CLEAR_RECYCLE_SITES'
const RECOVERY_FLAG = 'recovery'
const DELETE_FLAG = 'delete'
const state = {
    sites: []
}
const mutations = {
    [RECYCLE_SITES](state, sites) {
        state.sites = sites
    },
    [CLEAR_RECYCLE_SITES](state) {
        state.sites = []
    }
}

const actions = {
    loadRecycles({ commit },request) {
        return Request.post('/cms/app/recycle/list', request).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(RECYCLE_SITES, rest.data)
                return Promise.resolve(response.data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
    restoreRecycles({ commit, dispatch }, { ids }) {
        return dispatch('optRecycle', { ids, flag: RECOVERY_FLAG }).then(data => {
            commit('cms/site/CLEAR_SITES', null, { root: true })
            return Promise.resolve(data)
        })
    },
    emptyRecycles({ dispatch }, { ids }) {
        return dispatch('optRecycle', { ids, flag: DELETE_FLAG })
    },
    optRecycle({ commit }, { ids, flag }) {
        return Request.post('/cms/app/recycle/opt', { ids, flag }).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(CLEAR_RECYCLE_SITES)
                return Promise.resolve('')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    }
}

export default {
    state,
    mutations,
    actions
}
