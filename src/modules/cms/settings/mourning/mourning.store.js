import Request from '@/request'
const state = {
 
}

const mutations = {

}

const actions = {
    // 查询列表
    search({ commit }, hotWord) {
        return Request.post('/cms/mourning/state', hotWord,{
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve( rest )
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    // 新增
    set({ commit }, hotWord) {
        return Request.post('/cms/mourning/set', hotWord,{
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve( rest )
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
}

const getters = {

}
export default {
    state,
    actions,
    getters,
    mutations
}
