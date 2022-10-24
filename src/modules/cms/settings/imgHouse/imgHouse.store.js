import Request from '@/request'
const state = {
    data: [],
}

const getters = {

}
const mutations = {

}
const actions = {
    /**
     * Logo 上传
     * @param {*} param0
     * @param {*} param1
     */
    uploadImghouse({ dispatch }, data) {
        console.log('测试上传图片按钮',data)
        // data.raw
        return Request.post('/cms/image/upload/image', data).then( response => {
            const rest = response.data
            if(rest.success) {
                return Promise.resolve(rest)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
        
    },
    // 上传的图片保存
    imageSave({commit}, data) {
        return Request.post('/cms/image/save', data, {
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(response => {
            const rest = response.data
            console.log('图片保存：', rest)
            if(rest.success){
                return Promise.resolve(rest)
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },

    // 获取图片列表 + 查询
    getImgList({commit}, data) {
        return Request.post('/cms/image/list', data, {
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
    //  图片修改（上传/删除/还原）
    getImgUpDate({commit}, data) {
        return Request.post('/cms/image/update', data, {
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
    // 标记一引用的图片
    getImgSign({commit}, data){
        return Request.post('/cms/image/sign', data, {
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
    }
}
export default {
    state,
    getters,
    mutations,
    actions
}