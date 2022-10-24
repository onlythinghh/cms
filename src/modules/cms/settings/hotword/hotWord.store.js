import Request from '@/request'
const HOTWORD_LIST='HOTWORD_LIST'
const state = {
    data: [],
}

const getters = {

}
const mutations = {
    [HOTWORD_LIST](state, { data}) {
        state.data = data
    },

}
const actions = {
    getHotWordList({ commit, state }, hotWordListParams = { page: 1, limit: 10 }) {
        return Request.post('/cms/hotword/list', hotWordListParams).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(HOTWORD_LIST, { data: rest.data })
                // return Promise.resolve('success')
                return Promise.resolve({ data: rest.data, count: rest.count })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    // 删除
    deleteHotWord({ commit }, { id }) {
        return Request.post('/cms/hotword/del', { id }).then(response => {
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
    saveHotWord({ commit }, hotWord) {
        return Request.post('/cms/hotword/save', hotWord).then(response => {
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
