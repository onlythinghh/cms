import Request from '../../../request'
const SHORTCUTS_LIST='SHORTCUTS_LIST'
const state = {
    news:[]
}
const mutations = {
    [SHORTCUTS_LIST](state, { data}) {
        state.news = data.splice(0,5)
    },
}
const actions = {
    getShortcutList({ commit },) {
        return Request.post('/cms/index/list').then(response => {
            const rest = response.data
            if (rest.success) {
                commit(SHORTCUTS_LIST, { data: rest.data })
                return Promise.resolve ({ data: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },

    
}
export default {
    state,
    mutations,
    actions
}