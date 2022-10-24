import { get, toQueryString, toStart, post, del } from '../../request'
import { downloadByBlob } from '@/utils/BaseUtil'

const FORMS = 'FORMS'
const state = {
    forms: {
        data: [],
        size: 10,
        page: 1,
        total: 0
    }
}
const getters = {}
const mutations = {
    [FORMS](state, { page, size, total, data } = {}) {
        state.forms = { page, size, total, data }
    }
}
const actions = {
    getFormDeployments({ commit }, { page = 1, size = 10, ...params } = {}) {
        return get('/flowable-form/form-repository/deployments?' + toQueryString({ start: toStart(page, size), size, ...params })).then(response => {
            const rest = response.data
            if (rest.success) {
                commit(FORMS, { data: rest.data, total: rest.total, page, size })
                return Promise.resolve('success.')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(error)
        })
    },
    createFormDeployments({ commit }, { file = null, tenantId = '' } = {}) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('tenantId', tenantId)
        return post('/flowable-form/form-repository/deployments', formData).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve('success.')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(error)
        })
    },
    deleteFormDeployments({ commit }, deploymentId) {
        return del('/flowable-form/form-repository/deployments/' + deploymentId).then(response => {
            const rest = response.data
            if (rest.success) {
                return Promise.resolve('success.')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(error)
        })
    },
    exportFormDeployments({ commit }, { deploymentId = '', resourceName = '' } = {}) {
        return get(`/flowable-form/form-repository/deployments/${deploymentId}/resourcedata/${resourceName}`).then(response => {
            const rest = response.data
            if (rest.success) {
                downloadByBlob(JSON.stringify(rest.data || {}, null, 4), { filename: resourceName })
                return Promise.resolve('success.')
            }
            return Promise.reject(new Error(rest.errMsg))
        }).catch(error => {
            return Promise.reject(error)
        })
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
