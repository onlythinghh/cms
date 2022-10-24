import Request from '@/request'
const STAT_SITE = 'STAT_SITE'
const STAT_CHANNEL = 'STAT_CHANNEL'
const STAT_USER = 'STAT_USER'

const state = {
    statSite: [],
    statChannel: [],
    statUser: [],
}
const mutations = {
    [STAT_SITE](state,data){
        state.statSite = data
    },
    [STAT_CHANNEL](state,data){
        state.statChannel = data
    },
    [STAT_USER](state,data){
        state.statUser = data
    },
}
const actions = {
    siteAnalysis({ commit }, timer) {
        return Request.post('/cms/analysis/app', timer).then(response => {
            const rest = response.data
            if (rest.success) {
                const data = rest.data
                commit(STAT_SITE,[data])
                return Promise.resolve(data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    channelAnalysis({ commit }, timer) {
        return Request.post('/cms/analysis/channel', timer).then(response => {
            const rest = response.data
            if (rest.success) {
                const data = rest.data
                commit(STAT_CHANNEL,[data])
                return Promise.resolve(data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    userAnalysis({ commit }, timer) {
        return Request.post('/cms/analysis/user', timer).then(response => {
            const rest = response.data
            if (rest.success) {
                const data = rest.data
                commit(STAT_USER,[data])
                return Promise.resolve(data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },

    deptAnalysis({ commit }, timer) {
        return Request.post('/cms/analysis/dept', timer).then(response => {
            const rest = response.data
            if (rest.success) {
                const data = rest.data
                commit(STAT_USER,[data])
                return Promise.resolve(data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    visitAnalysis({ commit }, timer) {
        return Request.post('/cms/visit/get', timer).then(response => {
            const rest = response.data
            if (rest.success) {
                const data = rest.data
                commit(STAT_USER,[data])
                return Promise.resolve(data)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },

    visituserAnalysis({ commit }, reqData) {
        return Request.post("/cms/visit/get/page", reqData, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        })
            .then(res => {
                return Promise.resolve(res.data);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    },
}



export default {
    Request,
    state,
    actions,
    mutations
}