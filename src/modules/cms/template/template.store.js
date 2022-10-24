import Request from '../../../request'
import { isArray, downloadByBlob/* , downloadByForm */ } from '@/utils/BaseUtil'

const TEMPLATEINFO_LIST = 'TEMPLATEINFO_LIST'

const TEMPLATE_TAGS = 'TEMPLATE_TAGS'
const TEMPLATEALLINFO_LIST = 'TEMPLATEALLINFO_LIST'


const state = {
    data: [],
    templateTagsData: [],
    editProps: {},
    allData: []
}
const getters = {
    getTemplateById: state => typeArr => {
        let result = []
        if (isArray(typeArr)) {
            state.allData.map(item => {
                if (typeArr.findIndex(v => v === item.type) !== -1) result.push(item)
            })
        } else {
            state.allData.map(item => {
                if (item.type === typeArr) result.push(item)
            })
        }
        return result
    }
}
const mutations = {
    [TEMPLATEINFO_LIST](state, { data }) {
        state.data = data
    },
    [TEMPLATEALLINFO_LIST](state, data) {
        state.allData = data

    },
    editTemplate(state, data) {
        state.editProps = data
    },

    [TEMPLATE_TAGS](state, templateTagsData) {
        state.templateTagsData = templateTagsData
    },

}
const actions = {
    getAllTemplateList({ commit }) {
        return Request.post('/cms/template/all', {}).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(TEMPLATEALLINFO_LIST, rest.data)
                return Promise.resolve({ allData: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    getTemplateList({ commit }, searchParams = { page: 1, limit: 10, appid: 1, type: null }) {
        return Request.post('/cms/template/list', searchParams).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(TEMPLATEINFO_LIST, { data: rest.data })
                return Promise.resolve({ data: rest.data, count: rest.count })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    TemplateDetail({ commit }, { id }) {
        return Request.post('/cms/template/detail', { id }).then(response => {
            const rest = response.data
            if (rest.success) {
                // commit(TEMPLATEINFO_LIST, rest.data)
                return Promise.resolve({ detailData: rest.data })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    saveTemplate({ commit }, templateinfo) {
        return Request.post('/cms/template/save', templateinfo).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve('保存成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },
    deleteTemplate({ commit }, { id }) {
        return Request.post('/cms/template/del', { id }).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve('删除成功')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },

    exportTemplate({ commit }, { ids }) {
        return Request.post('/cms/template/export', { ids }, {
            responseType:'blob' //指定响应类型
        }).then(response => {
            const rest = response.data
            downloadByBlob(rest, { filename: 'tempalte.zip' })
            return Promise.resolve({ success: true, message: '导入成功' })
            /* if (rest.success) {
                return Promise.resolve('导出成功')
            }
            return Promise.reject(new Error(rest.errMsg)) */
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },

    exportTemplateAll({ commit }) {
        return Request.post('/cms/template/exportAll', {}, {
            responseType:'blob' //指定响应类型
        }).then(response => {
            const rest = response.data
            downloadByBlob(rest, { filename: 'tempalte.zip' })
            return Promise.resolve({ success: true, message: '导出成功' })
            /* if (rest.success) {
                return Promise.resolve('导出成功')
            }
            return Promise.reject(new Error(rest.errMsg)) */
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },

    importTemplate({ commit }, { type, file, name, desc, mode }) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)
        formData.append('name', name)
        formData.append('desc', desc)
        formData.append('mode', mode)

        return Request.post('/cms/template/import', formData).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve({ success: true, message: '导入成功' })
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },

    getTemplatetags({ commit }, argument = {}) {
        return Request.post('/cms/template/tags', argument).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(TEMPLATE_TAGS, rest.data)
                return Promise.resolve('success')
            }
            return Promise.reject(new Error(rest.errMsg))

        }).catch(error => {
            console.error(error)
            return Promise.reject(new Error(error.message || '服务器出现异常'))
        })
    },

}

export default {
    state,
    getters,
    mutations,
    actions
}
