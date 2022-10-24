import Request from '@/request'
const state = {
    data: [],
    resChangeinfo: {},
}

const getters = {
    resChangeinfo: state => state.resChangeinfo
}
const mutations = {
    setResChangeinfo(state, infos) {
        state.resChangeinfo = infos
    },
}

const actions = {
    setResChangeinfo({ commit }, info) {
        commit('setResChangeinfo', info)
    },
    // 获取资源列表 + 查询
    getresourcesList({commit}, data) {
        return Request.post('/cms/resources/list', data, {
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

    // 保存新建资源
    getsaveResources({commit}, data) {
        return Request.post('/cms/resources/save', data, {
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
    
    // 上传图片
    getImgLoadResources({commit}, data) {
        return Request.post('/cms/resources/upload/image', data, {
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
    // 上传视频 
    getVideoLoadResources({commit}, data) {
        return Request.post('/cms/resources/upload/video', data, {
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
    //  上传文件
    getAttaLoadResources({commit}, data) {
        return Request.post('/cms/resources/upload/atta', data, {
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
    //  下载次数统计
    getCountResources({commit}, data) {
        return Request.post('/cms/resources/count', data, {
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
    //  删除
    getdDelResources({commit}, data) {
        return Request.post('/cms/resources/delete', data, {
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
export default {
    state,
    getters,
    mutations,
    actions
}