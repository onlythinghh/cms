import Request from '@/request'
const state = {
 
}

const mutations = {

}

const actions = {
    async exportCurrent ({commit, state}, reqData) {
        try {
            let { data } = await Request.post('/gip/check/month/export', reqData, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                responseType: 'blob' 
            })
            return Promise.resolve(data)
        } catch (err) {
            return Promise.reject(err)
        }
    },
    // 查询列表
    voteList({ commit }, hotWord) {
        return Request.post('/cms/qa/list', hotWord,{
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
    voteSave({ commit }, hotWord) {
        return Request.post('/cms/qa/save', hotWord,{
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
    voteDetail({ commit }, hotWord) {
        return Request.post('/cms/qa/detail', hotWord,{
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
    voteDetele({ commit }, hotWord) {
        return Request.post('/cms/qa/delete', hotWord,{
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
    // 发布
    voteRelease({ commit }, hotWord) {
        return Request.post('/cms/qa/publish', hotWord,{
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
    // 结束
    voteEnd({ commit }, hotWord) {
        return Request.post('/cms/qa/end', hotWord,{
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
    async exportVote ({commit, state}, reqData) {
        try {
            let { data } = await Request.post('/cms/qa/export', reqData, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                responseType: 'blob' 
            })
            return Promise.resolve(data)
        } catch (err) {
            return Promise.reject(err)
        }
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
