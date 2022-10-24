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
    // 获取利率
    getInterestRate({commit}, data) {
        return Request.get('/cms/interestRate/get').then(response => {
            const rest = response.data
            if(rest.success) {
                return Promise.resolve(rest)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
    // 设置利率
    AddInterestRate({commit}, data) {
        return Request.post('/cms/interestRate/add', data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(response => {
            const rest = response.data
            if(rest.success) {
                return Promise.resolve(rest)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
}
export {
    state,
    getters,
    mutations,
    actions
}