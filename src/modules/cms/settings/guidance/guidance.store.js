import Request from '@/request'

const state = {
 
}

const mutations = {

}
const actions = {
    // 文件上传
    uploadFile({ dispatch }, file) {

        return dispatch('cms/uploadFile', file, { root: true }).then(response => {
            // const rest = response.data
            // console.log('rest----',rest)
            // if (rest.success) {
            return Promise.resolve(response)
            // }
            // return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
    // 文件上传
    // async uploadFile ({commit}, reqData) {
    //     let formData = new FormData()
    //     for (let [key, value] of Object.entries(reqData)) {
    //         if (key === 'files' && Array.isArray(value)) {
    //             value.forEach((file, index) => {
    //                 formData.append(key, file)
    //             })
    //         } else {
    //             formData.append(key, value)
    //         }
    //     }
    //     try {
    //         let data  = await Request({
    //             url: '/cms/work-guide/upload',
    //             data: formData
    //         })
    //         return Promise.resolve(data.data)
    //     } catch (error) {
    //         return Promise.reject(error)
    //     }
    // },
    // 统计表
    list({ commit }, hotWord) {
        return Request.post('/cms/work-guide/list', hotWord,{
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
    // 单个通过
    audit({ commit }, hotWord) {
        return Request.post('/cms/work-guide/audit-one', hotWord,{
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(response => {
            const rest = response.data
            // if (rest.success) {
            return Promise.resolve( rest )
            // }
            // return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    // 批量通过
    auditMulti({ commit }, hotWord) {
        return Request.post('/cms/work-guide/audit-multi', hotWord,{
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
    save({ commit }, hotWord) {
        return Request.post('/cms/work-guide/save', hotWord,{
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
    // 删除
    _del({ commit }, hotWord) {
        return Request.post('/cms/work-guide/del', hotWord,{
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

    // 水印列表
    getWatermark({ commit }, hotWord) {
        return Request.post('/cms/work-guide/watermark-list', hotWord,{
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

    getusr_list({ commit }, hotWord) {
        return Request.post('/cms/work-guide/watermark/usr_list', hotWord,{
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

    saveWatermark({ commit }, hotWord) {
        return Request.post('/cms/work-guide/watermark-save', hotWord,{
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

    // 删除
    deletWatermark({ commit }, hotWord) {
        return Request.post('/cms/work-guide/watermark-del', hotWord,{
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


    // 删除
    warterlist({ commit }, hotWord) {
        return Request.post('/cms/work-guide/watermark/list', hotWord,{
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
