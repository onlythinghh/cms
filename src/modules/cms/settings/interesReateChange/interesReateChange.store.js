import Request from '@/request'
const state = {
    data: [],
    resChangeinfo: {},
}

const getters = {
}
const mutations = {
}
const actions = {
    // 获取万能型产品
    getRateList({commit}, data) {
        return Request.post('/cms/plan/list', data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(response => {
            const rest = response.data
            return Promise.resolve(rest)
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
    // 获取万能产品详情(table)
    getRateDetail({commit}, data) {
        return Request.post('/cms/plan/detail', data, {
        }).then(response => {
            const rest = response.data
            return Promise.resolve(rest)
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
    // 万能产品保存修改
    getRateSave({commit}, data) {
        return Request.post('/cms/plan/detail/save', data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(response => {
            const rest = response.data
            return Promise.resolve(rest)
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
    // 获取投资连结产品详情(table)
    getInvestRateDetail({commit}, data) {
        return Request.post('/cms/plan/detail2', data, {
        }).then(response => {
            const rest = response.data
            return Promise.resolve(rest)
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
    // 投资连结产品保存修改
    getInvestRateSave({commit}, data) {
        return Request.post('/cms/plan/detail/save2', data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(response => {
            const rest = response.data
            return Promise.resolve(rest)
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    }
}
export {
    state,
    getters,
    mutations,
    actions
}