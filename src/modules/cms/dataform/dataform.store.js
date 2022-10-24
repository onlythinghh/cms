import Request from '@/request'
import { downloadByBlob/* , downloadByForm */ } from '@/utils/BaseUtil'
const state = {
    data: [],
    
}

const getters = {
}
const mutations = {
}

const actions = {
    // 表单 字段列表
    getFieldList({commit}, data){
        return Request.post('/cms/field/list', data, {
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
    // 表单新增字段
    getyzFieldSave({commit}, data) {
        return Request.post('/cms/field/save', data, {
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
    // 表单删除列表中字段
    getyzFieldDel({commit}, data) {
        return Request.post('/cms/field/del', data, {
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

    // 新增表单保存
    getlzFormSave({commit}, data) {
        return Request.post('/cms/capital/form/save', data, {
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
    // 留资 列表
    getlzCapitalList({commit}, data) {
        return Request.post('/cms/capital/form/list', data, {
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
    // 留资 列表删除
    getlzCapitalFormDel({commit}, data) {
        return Request.post('/cms/capital/form/del', data, {
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
    // 留资 列表配置
    getlzCapitalBindChannel({commit}, data) {
        return Request.post('/cms/capital/form/bind/channel', data, {
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
    // 留资 列表详情 (表头)
    getlzDetailListTit({commit}, data) {
        return Request.post('/cms/capital/form/getFormFieldList', data, {
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
    // 留资 列表详情 (表身)
    getlzDetailList({commit}, data) {
        return Request.post('/cms/capital/form/info/list', data, {
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
    // 留资 详情 导出
    getlzInfoExport({commit}, data) {
        return Request.post('/cms/capital/form/info/export', data, {
            responseType:'blob',
            headers: {
                "Content-Type": "application/json;utf-8"
            }
        }).then(response => {
            // console.log('response',response)
            if(response.status == 200) {
                // return Promise.resolve(rest)
                const rest = response.data
                downloadByBlob(rest, { filename: 'formInfo.xlsx' })
                return Promise.resolve({ success: true, message: '导出成功' })
            }
            return Promise.reject(new Error(response.errMsg))
        }).catch(error => {
            return Promise.reject(new Error(error.message || '服务器异常'))
        })
    },
    // 留资 详情 删除
    getlzformDetails({commit}, data) {
        return Request.post('/cms/capital/form/del/formDetails', data,{
            headers: {
                "Content-Type": "application/json;utf-8",
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