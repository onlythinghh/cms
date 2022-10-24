import Request from '../../../request'
const LIST = 'LIST'

const state = {
    list: []
}
const mutations = {
    [LIST](state, data) {
        state.list = data
    }
}
const actions = {
    schedulerList ({commit},request) {
        return Request.post('/cms/scheduler/list',request) .then((response)=>{
            const rest = response.data
            if(rest.success) {
                rest.data.map(item=>{
                    // item.start = '启用'
                    // item.end = '挂起'
                    item.isShowStartButton = item.status === 2||item.status === 3||item.status === 4||item.status === 5
                    item.isShowEndButton = item.status === 1 || item.status === 4  
                })
                commit(LIST, rest.data)
                return Promise.resolve({data: rest.data, count: rest.count})
            }
            return Promise.reject(new Error(rest.errMsg))
        }) .catch(error=>{
            console.error(error)
            return Promise.reject(new Error(error.message || '系统异常'))
        })
    },
    schedulerEdit ({commit},request) {
        return Request.post('/cms/scheduler/edit',request) .then((response)=>{
            const rest = response.data
            if(rest.success) {
                return Promise.resolve({data: rest,})
            }
            return Promise.reject(new Error(rest.errMsg))
        }) .catch(error=>{
            console.error(error)
            return Promise.reject(new Error(error.message || '系统异常'))
        })
    },
    schedulerProgress ({commit},request) {
        return Request.post('/cms/scheduler/progress',request) .then((response)=>{
            const rest = response.data
            if(rest.success) {
                return Promise.resolve({data: rest.data,})
            }
            return Promise.reject(new Error(rest.errMsg))
        }) .catch(error=>{
            console.error(error)
            return Promise.reject(new Error(error.message || '系统异常'))
        })
    },
    startScheduler ({commit},request) {
        return Request.post('/cms/scheduler/enable',request) .then((response)=>{
            const rest = response.data
            if(rest.success) {
                return Promise.resolve({data: rest.data,})
            }
            return Promise.reject(new Error(rest.errMsg))
        }) .catch(error=>{
            console.error(error)
            return Promise.reject(new Error(error.message || '系统异常'))
        })
    },
    endScheduler ({commit},request) {
        return Request.post('/cms/scheduler/suspend',request) .then((response)=>{
            const rest = response.data
            if(rest.success) {
                return Promise.resolve({data: rest.data,})
            }
            return Promise.reject(new Error(rest.errMsg))
        }) .catch(error=>{
            console.error(error)
            return Promise.reject(new Error(error.message || '系统异常'))
        })
    },
    deleteScheduler ({commit},request) {
        return Request.post('/cms/scheduler/del',request) .then((response)=>{
            const rest = response.data
            if(rest.success) {
                return Promise.resolve({data: rest.data,})
            }
            return Promise.reject(new Error(rest.errMsg))
        }) .catch(error=>{
            console.error(error)
            return Promise.reject(new Error(error.message || '系统异常'))
        })
    },
}



export default {
    state,
    mutations,
    actions
}