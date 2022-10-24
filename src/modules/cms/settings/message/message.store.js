import Request from '@/request'
const state = {
 
}

const mutations = {

}

const actions = {
    // 查询列表
    list({ commit }, hotWord) {
        return Request.post('/cms/message/list', hotWord,{
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
    // 保存
    messageSave({ commit }, hotWord) {
        return Request.post('/cms/message/audit', hotWord,{
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
    // 详情
    detail({ commit }, hotWord) {
        return Request.post('/cms/message/detail', hotWord,{
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
